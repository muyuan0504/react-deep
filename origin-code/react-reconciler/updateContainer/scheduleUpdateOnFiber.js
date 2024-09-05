/**
 * packages\react-reconciler\src\ReactFiberWorkLoop.old.js
 * @param {*} root
 * @param {*} fiber
 * @param {*} lane
 * @param {*} eventTime
 */

// 调度更新
export function scheduleUpdateOnFiber(root: FiberRoot, fiber: Fiber, lane: Lane, eventTime: number) {
    checkForNestedUpdates()
    // Mark that the root has a pending update.
    markRootUpdated(root, lane, eventTime)

    if ((executionContext & RenderContext) !== NoLanes && root === workInProgressRoot) {
        // This update was dispatched during the render phase. This is a mistake
        // if the update originates from user space (with the exception of local
        // hook updates, which are handled differently and don't reach this
        // function), but there are some internal React features that use this as
        // an implementation detail, like selective hydration.
        warnAboutRenderPhaseUpdatesInDEV(fiber)

        // Track lanes that were updated during the render phase
        workInProgressRootRenderPhaseUpdatedLanes = mergeLanes(workInProgressRootRenderPhaseUpdatedLanes, lane)
    } else {
        // This is a normal update, scheduled from outside the render phase. For
        // example, during an input event.
        if (enableUpdaterTracking) {
            if (isDevToolsPresent) {
                addFiberToLanesMap(root, fiber, lane)
            }
        }

        warnIfUpdatesNotWrappedWithActDEV(fiber)

        if (enableProfilerTimer && enableProfilerNestedUpdateScheduledHook) {
            if ((executionContext & CommitContext) !== NoContext && root === rootCommittingMutationOrLayoutEffects) {
                if (fiber.mode & ProfileMode) {
                    let current = fiber
                    while (current !== null) {
                        if (current.tag === Profiler) {
                            const { id, onNestedUpdateScheduled } = current.memoizedProps
                            if (typeof onNestedUpdateScheduled === 'function') {
                                onNestedUpdateScheduled(id)
                            }
                        }
                        current = current.return
                    }
                }
            }
        }

        if (enableTransitionTracing) {
            const transition = ReactCurrentBatchConfig.transition
            if (transition !== null) {
                if (transition.startTime === -1) {
                    transition.startTime = now()
                }

                addTransitionToLanesMap(root, transition, lane)
            }
        }

        if (root === workInProgressRoot) {
            // Received an update to a tree that's in the middle of rendering. Mark
            // that there was an interleaved update work on this root. Unless the
            // `deferRenderPhaseUpdateToNextBatch` flag is off and this is a render
            // phase update. In that case, we don't treat render phase updates as if
            // they were interleaved, for backwards compat reasons.
            if (deferRenderPhaseUpdateToNextBatch || (executionContext & RenderContext) === NoContext) {
                workInProgressRootInterleavedUpdatedLanes = mergeLanes(workInProgressRootInterleavedUpdatedLanes, lane)
            }
            if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
                // The root already suspended with a delay, which means this render
                // definitely won't finish. Since we have a new update, let's mark it as
                // suspended now, right before marking the incoming update. This has the
                // effect of interrupting the current render and switching to the update.
                // TODO: Make sure this doesn't override pings that happen while we've
                // already started rendering.
                markRootSuspended(root, workInProgressRootRenderLanes)
            }
        }

        ensureRootIsScheduled(root, eventTime)
        if (
            lane === SyncLane &&
            executionContext === NoContext &&
            (fiber.mode & ConcurrentMode) === NoMode &&
            // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
            !(__DEV__ && ReactCurrentActQueue.isBatchingLegacy)
        ) {
            // Flush the synchronous work now, unless we're already working or inside
            // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
            // scheduleCallbackForFiber to preserve the ability to schedule a callback
            // without immediately flushing it. We only do this for user-initiated
            // updates, to preserve historical behavior of legacy mode.
            resetRenderTimer()
            flushSyncCallbacksOnlyInLegacyMode()
        }
    }
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
        if (__DEV__) {
            // If we're going to re-use an existing task, it needs to exist.
            // Assume that discrete update microtasks are non-cancellable and null.
            // TODO: Temporary until we confirm this warning is not fired.
            if (existingCallbackNode == null && existingCallbackPriority !== SyncLane) {
                console.error('Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.')
            }
        }
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
