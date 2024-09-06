/** packages\react-reconciler\src\ReactFiberWorkLoop.old.js */

// This is the entry point for synchronous tasks that don't go
// through Scheduler
function performSyncWorkOnRoot(root) {
    if (enableProfilerTimer && enableProfilerNestedUpdatePhase) {
        syncNestedUpdateFlag()
    }

    if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
        throw new Error('Should not already be working.')
    }

    flushPassiveEffects()

    let lanes = getNextLanes(root, NoLanes)
    if (!includesSomeLane(lanes, SyncLane)) {
        // There's no remaining sync work left.
        ensureRootIsScheduled(root, now())
        return null
    }

    /** 构建Fiber树 */
    let exitStatus = renderRootSync(root, lanes)

    if (root.tag !== LegacyRoot && exitStatus === RootErrored) {
        // If something threw an error, try rendering one more time. We'll render
        // synchronously to block concurrent data mutations, and we'll includes
        // all pending updates are included. If it still fails after the second
        // attempt, we'll give up and commit the resulting tree.
        const errorRetryLanes = getLanesToRetrySynchronouslyOnError(root)
        if (errorRetryLanes !== NoLanes) {
            lanes = errorRetryLanes
            exitStatus = recoverFromConcurrentError(root, errorRetryLanes)
        }
    }

    if (exitStatus === RootFatalErrored) {
        const fatalError = workInProgressRootFatalError
        prepareFreshStack(root, NoLanes)
        markRootSuspended(root, lanes)
        ensureRootIsScheduled(root, now())
        throw fatalError
    }

    if (exitStatus === RootDidNotComplete) {
        throw new Error('Root did not complete. This is a bug in React.')
    }

    // We now have a consistent tree. Because this is a sync render, we
    // will commit it even if something suspended.
    const finishedWork: Fiber = (root.current.alternate: any)
    root.finishedWork = finishedWork
    root.finishedLanes = lanes
    commitRoot(root, workInProgressRootRecoverableErrors, workInProgressTransitions)

    // Before exiting, make sure there's a callback scheduled for the next
    // pending level.
    ensureRootIsScheduled(root, now())

    return null
}

function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
    const existingCallbackNode = root.callbackNode

    // Check if any lanes are being starved by other work. If so, mark them as
    // expired so we know to work on those next.
    markStarvedLanesAsExpired(root, currentTime)

    // Determine the next lanes to work on, and their priority.
    const nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes)

    if (nextLanes === NoLanes) {
        // Special case: There's nothing to work on.
        if (existingCallbackNode !== null) {
            cancelCallback(existingCallbackNode)
        }
        root.callbackNode = null
        root.callbackPriority = NoLane
        return
    }

    // We use the highest priority lane to represent the priority of the callback.
    const newCallbackPriority = getHighestPriorityLane(nextLanes)

    // Check if there's an existing task. We may be able to reuse it.
    const existingCallbackPriority = root.callbackPriority
    if (
        existingCallbackPriority === newCallbackPriority &&
        // Special case related to `act`. If the currently scheduled task is a
        // Scheduler task, rather than an `act` task, cancel it and re-scheduled
        // on the `act` queue.
        !(__DEV__ && ReactCurrentActQueue.current !== null && existingCallbackNode !== fakeActCallbackNode)
    ) {
        // The priority hasn't changed. We can reuse the existing task. Exit.
        return
    }

    if (existingCallbackNode != null) {
        // Cancel the existing callback. We'll schedule a new one below.
        cancelCallback(existingCallbackNode)
    }

    // Schedule a new callback.
    let newCallbackNode
    if (newCallbackPriority === SyncLane) {
        // Special case: Sync React callbacks are scheduled on a special
        // internal queue
        if (root.tag === LegacyRoot) {
            if (__DEV__ && ReactCurrentActQueue.isBatchingLegacy !== null) {
                ReactCurrentActQueue.didScheduleLegacyUpdate = true
            }
            scheduleLegacySyncCallback(performSyncWorkOnRoot.bind(null, root))
        } else {
            scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root))
        }
        if (supportsMicrotasks) {
            // Flush the queue in a microtask.
            if (__DEV__ && ReactCurrentActQueue.current !== null) {
                // Inside `act`, use our internal `act` queue so that these get flushed
                // at the end of the current scope even when using the sync version
                // of `act`.
                ReactCurrentActQueue.current.push(flushSyncCallbacks)
            } else {
                scheduleMicrotask(() => {
                    // In Safari, appending an iframe forces microtasks to run.
                    // https://github.com/facebook/react/issues/22459
                    // We don't support running callbacks in the middle of render
                    // or commit so we need to check against that.
                    if ((executionContext & (RenderContext | CommitContext)) === NoContext) {
                        // Note that this would still prematurely flush the callbacks
                        // if this happens outside render or commit phase (e.g. in an event).
                        flushSyncCallbacks()
                    }
                })
            }
        } else {
            // Flush the queue in an Immediate task.
            scheduleCallback(ImmediateSchedulerPriority, flushSyncCallbacks)
        }
        newCallbackNode = null
    } else {
        let schedulerPriorityLevel
        switch (lanesToEventPriority(nextLanes)) {
            case DiscreteEventPriority:
                schedulerPriorityLevel = ImmediateSchedulerPriority
                break
            case ContinuousEventPriority:
                schedulerPriorityLevel = UserBlockingSchedulerPriority
                break
            case DefaultEventPriority:
                schedulerPriorityLevel = NormalSchedulerPriority
                break
            case IdleEventPriority:
                schedulerPriorityLevel = IdleSchedulerPriority
                break
            default:
                schedulerPriorityLevel = NormalSchedulerPriority
                break
        }
        newCallbackNode = scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root))
    }

    root.callbackPriority = newCallbackPriority
    root.callbackNode = newCallbackNode
}
