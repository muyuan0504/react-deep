/**
 * packages\react-reconciler\src\ReactFiberBeginWork.old.js
 * @param {*} current
 * @param {*} workInProgress
 * @param {*} renderLanes
 * @returns
 */
function beginWork(current: Fiber | null, workInProgress: Fiber, renderLanes: Lanes): Fiber | null {
    if (current !== null) {
        const oldProps = current.memoizedProps
        const newProps = workInProgress.pendingProps

        if (
            oldProps !== newProps ||
            hasLegacyContextChanged() ||
            // Force a re-render if the implementation changed due to hot reload:
            (__DEV__ ? workInProgress.type !== current.type : false)
        ) {
            // If props or context changed, mark the fiber as having performed work.
            // This may be unset if the props are determined to be equal later (memo).
            didReceiveUpdate = true
        } else {
            // Neither props nor legacy context changes. Check if there's a pending
            // update or context change.
            const hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(current, renderLanes)
            if (
                !hasScheduledUpdateOrContext &&
                // If this is the second pass of an error or suspense boundary, there
                // may not be work scheduled on `current`, so we check for this flag.
                (workInProgress.flags & DidCapture) === NoFlags
            ) {
                // No pending updates or context. Bail out now.
                didReceiveUpdate = false
                return attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes)
            }
            if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
                // This is a special case that only exists for legacy mode.
                // See https://github.com/facebook/react/pull/19216.
                didReceiveUpdate = true
            } else {
                // An update was scheduled on this fiber, but there are no new props
                // nor legacy context. Set this to false. If an update queue or context
                // consumer produces a changed value, it will set this to true. Otherwise,
                // the component will assume the children have not changed and bail out.
                didReceiveUpdate = false
            }
        }
    } else {
        didReceiveUpdate = false

        if (getIsHydrating() && isForkedChild(workInProgress)) {
            // Check if this child belongs to a list of muliple children in
            // its parent.
            //
            // In a true multi-threaded implementation, we would render children on
            // parallel threads. This would represent the beginning of a new render
            // thread for this subtree.
            //
            // We only use this for id generation during hydration, which is why the
            // logic is located in this special branch.
            const slotIndex = workInProgress.index
            const numberOfForks = getForksAtLevel(workInProgress)
            pushTreeId(workInProgress, numberOfForks, slotIndex)
        }
    }

    // Before entering the begin phase, clear pending update priority.
    // TODO: This assumes that we're about to evaluate the component and process
    // the update queue. However, there's an exception: SimpleMemoComponent
    // sometimes bails out later in the begin phase. This indicates that we should
    // move this assignment out of the common path and into each branch.
    workInProgress.lanes = NoLanes

    switch (workInProgress.tag) {
        case IndeterminateComponent: {
            return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes)
        }
        case LazyComponent: {
            const elementType = workInProgress.elementType
            return mountLazyComponent(current, workInProgress, elementType, renderLanes)
        }
        case FunctionComponent: {
            const Component = workInProgress.type
            const unresolvedProps = workInProgress.pendingProps
            const resolvedProps = workInProgress.elementType === Component ? unresolvedProps : resolveDefaultProps(Component, unresolvedProps)
            return updateFunctionComponent(current, workInProgress, Component, resolvedProps, renderLanes)
        }
        case ClassComponent: {
            const Component = workInProgress.type
            const unresolvedProps = workInProgress.pendingProps
            const resolvedProps = workInProgress.elementType === Component ? unresolvedProps : resolveDefaultProps(Component, unresolvedProps)
            return updateClassComponent(current, workInProgress, Component, resolvedProps, renderLanes)
        }
        case HostRoot:
            return updateHostRoot(current, workInProgress, renderLanes)
        case HostComponent:
            return updateHostComponent(current, workInProgress, renderLanes)
        case HostText:
            return updateHostText(current, workInProgress)
        case SuspenseComponent:
            return updateSuspenseComponent(current, workInProgress, renderLanes)
        case HostPortal:
            return updatePortalComponent(current, workInProgress, renderLanes)
        case ForwardRef: {
            const type = workInProgress.type
            const unresolvedProps = workInProgress.pendingProps
            const resolvedProps = workInProgress.elementType === type ? unresolvedProps : resolveDefaultProps(type, unresolvedProps)
            return updateForwardRef(current, workInProgress, type, resolvedProps, renderLanes)
        }
        case Fragment:
            return updateFragment(current, workInProgress, renderLanes)
        case Mode:
            return updateMode(current, workInProgress, renderLanes)
        case Profiler:
            return updateProfiler(current, workInProgress, renderLanes)
        case ContextProvider:
            return updateContextProvider(current, workInProgress, renderLanes)
        case ContextConsumer:
            return updateContextConsumer(current, workInProgress, renderLanes)
        case MemoComponent: {
            const type = workInProgress.type
            const unresolvedProps = workInProgress.pendingProps
            // Resolve outer props first, then resolve inner props.
            let resolvedProps = resolveDefaultProps(type, unresolvedProps)
            if (__DEV__) {
                if (workInProgress.type !== workInProgress.elementType) {
                    const outerPropTypes = type.propTypes
                    if (outerPropTypes) {
                        checkPropTypes(
                            outerPropTypes,
                            resolvedProps, // Resolved for outer only
                            'prop',
                            getComponentNameFromType(type)
                        )
                    }
                }
            }
            resolvedProps = resolveDefaultProps(type.type, resolvedProps)
            return updateMemoComponent(current, workInProgress, type, resolvedProps, renderLanes)
        }
        case SimpleMemoComponent: {
            return updateSimpleMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes)
        }
        case IncompleteClassComponent: {
            const Component = workInProgress.type
            const unresolvedProps = workInProgress.pendingProps
            const resolvedProps = workInProgress.elementType === Component ? unresolvedProps : resolveDefaultProps(Component, unresolvedProps)
            return mountIncompleteClassComponent(current, workInProgress, Component, resolvedProps, renderLanes)
        }
        case SuspenseListComponent: {
            return updateSuspenseListComponent(current, workInProgress, renderLanes)
        }
        case ScopeComponent: {
            if (enableScopeAPI) {
                return updateScopeComponent(current, workInProgress, renderLanes)
            }
            break
        }
        case OffscreenComponent: {
            return updateOffscreenComponent(current, workInProgress, renderLanes)
        }
        case LegacyHiddenComponent: {
            if (enableLegacyHidden) {
                return updateLegacyHiddenComponent(current, workInProgress, renderLanes)
            }
            break
        }
        case CacheComponent: {
            if (enableCache) {
                return updateCacheComponent(current, workInProgress, renderLanes)
            }
            break
        }
        case TracingMarkerComponent: {
            if (enableTransitionTracing) {
                return updateTracingMarkerComponent(current, workInProgress, renderLanes)
            }
            break
        }
    }

    throw new Error(`Unknown unit of work tag (${workInProgress.tag}). This error is likely caused by a bug in ` + 'React. Please file an issue.')
}

function updateFunctionComponent(current, workInProgress, Component, nextProps: any, renderLanes) {
    if (__DEV__) {
        if (workInProgress.type !== workInProgress.elementType) {
            // Lazy component props can't be validated in createElement
            // because they're only guaranteed to be resolved here.
            const innerPropTypes = Component.propTypes
            if (innerPropTypes) {
                checkPropTypes(
                    innerPropTypes,
                    nextProps, // Resolved props
                    'prop',
                    getComponentNameFromType(Component)
                )
            }
        }
    }

    let context
    if (!disableLegacyContext) {
        const unmaskedContext = getUnmaskedContext(workInProgress, Component, true)
        context = getMaskedContext(workInProgress, unmaskedContext)
    }

    let nextChildren
    let hasId
    prepareToReadContext(workInProgress, renderLanes)
    if (enableSchedulingProfiler) {
        markComponentRenderStarted(workInProgress)
    }
    if (__DEV__) {
        ReactCurrentOwner.current = workInProgress
        setIsRendering(true)
        nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, context, renderLanes)
        hasId = checkDidRenderIdHook()
        if (debugRenderPhaseSideEffectsForStrictMode && workInProgress.mode & StrictLegacyMode) {
            setIsStrictModeForDevtools(true)
            try {
                nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, context, renderLanes)
                hasId = checkDidRenderIdHook()
            } finally {
                setIsStrictModeForDevtools(false)
            }
        }
        setIsRendering(false)
    } else {
        nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, context, renderLanes)
        hasId = checkDidRenderIdHook()
    }
    if (enableSchedulingProfiler) {
        markComponentRenderStopped()
    }

    if (current !== null && !didReceiveUpdate) {
        bailoutHooks(current, workInProgress, renderLanes)
        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
    }

    if (getIsHydrating() && hasId) {
        pushMaterializedTreeId(workInProgress)
    }

    // React DevTools reads this flag.
    workInProgress.flags |= PerformedWork
    reconcileChildren(current, workInProgress, nextChildren, renderLanes)
    return workInProgress.child
}

export function reconcileChildren(current: Fiber | null, workInProgress: Fiber, nextChildren: any, renderLanes: Lanes) {
    if (current === null) {
        // If this is a fresh new component that hasn't been rendered yet, we
        // won't update its child set by applying minimal side-effects. Instead,
        // we will add them all to the child before it gets rendered. That means
        // we can optimize this reconciliation pass by not tracking side-effects.
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes)
    } else {
        // If the current child is the same as the work in progress, it means that
        // we haven't yet started any work on these children. Therefore, we use
        // the clone algorithm to create a copy of all the current children.

        // If we had any progressed work already, that is invalid at this point so
        // let's throw it out.
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes)
    }
}

export const mountChildFibers = ChildReconciler(false)


