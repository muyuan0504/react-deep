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
