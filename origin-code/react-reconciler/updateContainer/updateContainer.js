/**
 * packages\react-reconciler\src\ReactFiberReconciler.old.js
 *
 * updateContainer(children, root, null, null)
 *  渲染根组件时 parentComponent 和 callback 为 null
 * @param {*} element
 * @param {*} container
 * @param {*} parentComponent
 * @param {*} callback
 * @returns
 */

export function updateContainer(element: ReactNodeList, container: OpaqueRoot, parentComponent: ?React$Component<any, any>, callback: ?Function): Lane {
    // continer 的 current 在 createContainer 方法中被定义了
    const current = container.current
    const eventTime = requestEventTime()
    const lane = requestUpdateLane(current)

    if (enableSchedulingProfiler) {
        markRenderScheduled(lane)
    }

    const context = getContextForSubtree(parentComponent)
    if (container.context === null) {
        container.context = context
    } else {
        container.pendingContext = context
    }
    const update = createUpdate(eventTime, lane)
    // Caution: React DevTools currently depends on this property
    // being called "element".
    update.payload = { element }

    callback = callback === undefined ? null : callback
    if (callback !== null) {
        if (__DEV__) {
            if (typeof callback !== 'function') {
                console.error('render(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callback)
            }
        }
        update.callback = callback
    }

    const root = enqueueUpdate(current, update, lane)

    // 根节点通过 initializeUpdateQueue 方法挂载了updateQueue对象，所以返回的root，不会是 null
    if (root !== null) {
        scheduleUpdateOnFiber(root, current, lane, eventTime)
        entangleTransitions(root, current, lane)
    }

    return lane
}

export function createUpdate(eventTime: number, lane: Lane): Update<*> {
    const update: Update<*> = {
        eventTime,
        lane,
        tag: UpdateState, //  UpdateState = 0
        payload: null,
        callback: null,
        next: null,
    }
    return update
}

export function requestUpdateLane(fiber: Fiber): Lane {
    // Special cases
    const mode = fiber.mode
    if ((mode & ConcurrentMode) === NoMode) {
        return (SyncLane: Lane)
    } else if (!deferRenderPhaseUpdateToNextBatch && (executionContext & RenderContext) !== NoContext && workInProgressRootRenderLanes !== NoLanes) {
        // This is a render phase update. These are not officially supported. The
        // old behavior is to give this the same "thread" (lanes) as
        // whatever is currently rendering. So if you call `setState` on a component
        // that happens later in the same render, it will flush. Ideally, we want to
        // remove the special case and treat them as if they came from an
        // interleaved event. Regardless, this pattern is not officially supported.
        // This behavior is only a fallback. The flag only exists until we can roll
        // out the setState warning, since existing code might accidentally rely on
        // the current behavior.
        return pickArbitraryLane(workInProgressRootRenderLanes)
    }

    const isTransition = requestCurrentTransition() !== NoTransition
    if (isTransition) {
        if (__DEV__ && ReactCurrentBatchConfig.transition !== null) {
            const transition = ReactCurrentBatchConfig.transition
            if (!transition._updatedFibers) {
                transition._updatedFibers = new Set()
            }

            transition._updatedFibers.add(fiber)
        }
        // The algorithm for assigning an update to a lane should be stable for all
        // updates at the same priority within the same event. To do this, the
        // inputs to the algorithm must be the same.
        //
        // The trick we use is to cache the first of each of these inputs within an
        // event. Then reset the cached values once we can be sure the event is
        // over. Our heuristic for that is whenever we enter a concurrent work loop.
        if (currentEventTransitionLane === NoLane) {
            // All transitions within the same event are assigned the same lane.
            currentEventTransitionLane = claimNextTransitionLane()
        }
        return currentEventTransitionLane
    }

    // Updates originating inside certain React methods, like flushSync, have
    // their priority set by tracking it with a context variable.
    //
    // The opaque type returned by the host config is internally a lane, so we can
    // use that directly.
    // TODO: Move this type conversion to the event priority module.
    const updateLane: Lane = (getCurrentUpdatePriority(): any)
    if (updateLane !== NoLane) {
        return updateLane
    }

    // This update originated outside React. Ask the host environment for an
    // appropriate priority, based on the type of event.
    //
    // The opaque type returned by the host config is internally a lane, so we can
    // use that directly.
    // TODO: Move this type conversion to the event priority module.
    const eventLane: Lane = (getCurrentEventPriority(): any)
    return eventLane
}

function getContextForSubtree(parentComponent: ?React$Component<any, any>): Object {
    if (!parentComponent) {
        return emptyContextObject
    }

    const fiber = getInstance(parentComponent)
    const parentContext = findCurrentUnmaskedContext(fiber)

    if (fiber.tag === ClassComponent) {
        const Component = fiber.type
        if (isLegacyContextProvider(Component)) {
            return processChildContext(fiber, Component, parentContext)
        }
    }

    return parentContext
}
