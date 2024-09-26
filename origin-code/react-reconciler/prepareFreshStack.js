// The fiber we're working on
let workInProgress: Fiber | null = null

function prepareFreshStack(root: FiberRoot, lanes: Lanes): Fiber {
    root.finishedWork = null
    root.finishedLanes = NoLanes

    const timeoutHandle = root.timeoutHandle
    if (timeoutHandle !== noTimeout) {
        // The root previous suspended and scheduled a timeout to commit a fallback
        // state. Now that we have additional work, cancel the timeout.
        root.timeoutHandle = noTimeout
        // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
        cancelTimeout(timeoutHandle)
    }

    if (workInProgress !== null) {
        let interruptedWork = workInProgress.return
        while (interruptedWork !== null) {
            const current = interruptedWork.alternate
            unwindInterruptedWork(current, interruptedWork, workInProgressRootRenderLanes)
            interruptedWork = interruptedWork.return
        }
    }
    workInProgressRoot = root
    const rootWorkInProgress = createWorkInProgress(root.current, null)
    workInProgress = rootWorkInProgress
    workInProgressRootRenderLanes = subtreeRenderLanes = workInProgressRootIncludedLanes = lanes
    workInProgressRootExitStatus = RootInProgress
    workInProgressRootFatalError = null
    workInProgressRootSkippedLanes = NoLanes
    workInProgressRootInterleavedUpdatedLanes = NoLanes
    workInProgressRootRenderPhaseUpdatedLanes = NoLanes
    workInProgressRootPingedLanes = NoLanes
    workInProgressRootConcurrentErrors = null
    workInProgressRootRecoverableErrors = null

    finishQueueingConcurrentUpdates()

    if (__DEV__) {
        ReactStrictModeWarnings.discardPendingWarnings()
    }

    return rootWorkInProgress
}

// This is used to create an alternate fiber to do work on.
export function createWorkInProgress(current: Fiber, pendingProps: any): Fiber {
    let workInProgress = current.alternate
    if (workInProgress === null) {
        // We use a double buffering pooling technique because we know that we'll
        // only ever need at most two versions of a tree. We pool the "other" unused
        // node that we're free to reuse. This is lazily created to avoid allocating
        // extra objects for things that are never updated. It also allow us to
        // reclaim the extra memory if needed.
        workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode)
        workInProgress.elementType = current.elementType
        workInProgress.type = current.type
        workInProgress.stateNode = current.stateNode

        if (__DEV__) {
            // DEV-only fields

            workInProgress._debugSource = current._debugSource
            workInProgress._debugOwner = current._debugOwner
            workInProgress._debugHookTypes = current._debugHookTypes
        }

        workInProgress.alternate = current
        current.alternate = workInProgress
    } else {
        workInProgress.pendingProps = pendingProps
        // Needed because Blocks store data on type.
        workInProgress.type = current.type

        // We already have an alternate.
        // Reset the effect tag.
        workInProgress.flags = NoFlags

        // The effects are no longer valid.
        workInProgress.subtreeFlags = NoFlags
        workInProgress.deletions = null

        if (enableProfilerTimer) {
            // We intentionally reset, rather than copy, actualDuration & actualStartTime.
            // This prevents time from endlessly accumulating in new commits.
            // This has the downside of resetting values for different priority renders,
            // But works for yielding (the common case) and should support resuming.
            workInProgress.actualDuration = 0
            workInProgress.actualStartTime = -1
        }
    }

    // Reset all effects except static ones.
    // Static effects are not specific to a render.
    workInProgress.flags = current.flags & StaticMask
    workInProgress.childLanes = current.childLanes
    workInProgress.lanes = current.lanes

    workInProgress.child = current.child
    workInProgress.memoizedProps = current.memoizedProps
    workInProgress.memoizedState = current.memoizedState
    workInProgress.updateQueue = current.updateQueue

    // Clone the dependencies object. This is mutated during the render phase, so
    // it cannot be shared with the current fiber.
    const currentDependencies = current.dependencies
    workInProgress.dependencies =
        currentDependencies === null
            ? null
            : {
                  lanes: currentDependencies.lanes,
                  firstContext: currentDependencies.firstContext,
              }

    // These will be overridden during the parent's reconciliation
    workInProgress.sibling = current.sibling
    workInProgress.index = current.index
    workInProgress.ref = current.ref

    if (enableProfilerTimer) {
        workInProgress.selfBaseDuration = current.selfBaseDuration
        workInProgress.treeBaseDuration = current.treeBaseDuration
    }

    if (__DEV__) {
        workInProgress._debugNeedsRemount = current._debugNeedsRemount
        switch (workInProgress.tag) {
            case IndeterminateComponent:
            case FunctionComponent:
            case SimpleMemoComponent:
                workInProgress.type = resolveFunctionForHotReloading(current.type)
                break
            case ClassComponent:
                workInProgress.type = resolveClassForHotReloading(current.type)
                break
            case ForwardRef:
                workInProgress.type = resolveForwardRefForHotReloading(current.type)
                break
            default:
                break
        }
    }

    return workInProgress
}
