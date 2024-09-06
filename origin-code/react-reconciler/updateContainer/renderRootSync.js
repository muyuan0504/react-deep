let workInProgress: Fiber | null = null // 当前正在内存中构建的新 Fiber 树

/**
 * packages\react-reconciler\src\ReactFiberWorkLoop.old.js
 * 同步地构建 Fiber 树
 *
 */
function renderRootSync(root: FiberRoot, lanes: Lanes) {
    const prevExecutionContext = executionContext
    executionContext |= RenderContext
    const prevDispatcher = pushDispatcher()

    // If the root or lanes have changed, throw out the existing stack
    // and prepare a fresh one. Otherwise we'll continue where we left off.
    if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
        if (enableUpdaterTracking) {
            if (isDevToolsPresent) {
                const memoizedUpdaters = root.memoizedUpdaters
                if (memoizedUpdaters.size > 0) {
                    restorePendingUpdaters(root, workInProgressRootRenderLanes)
                    memoizedUpdaters.clear()
                }

                // At this point, move Fibers that scheduled the upcoming work from the Map to the Set.
                // If we bailout on this work, we'll move them back (like above).
                // It's important to move them now in case the work spawns more work at the same priority with different updaters.
                // That way we can keep the current update and future updates separate.
                movePendingFibersToMemoized(root, lanes)
            }
        }

        workInProgressTransitions = getTransitionsForLanes(root, lanes)
        prepareFreshStack(root, lanes)
    }
    if (enableSchedulingProfiler) {
        markRenderStarted(lanes)
    }

    do {
        try {
            workLoopSync()
            break
        } catch (thrownValue) {
            handleError(root, thrownValue)
        }
    } while (true)
    resetContextDependencies()

    executionContext = prevExecutionContext
    popDispatcher(prevDispatcher)

    if (workInProgress !== null) {
        // This is a sync render, so we should have finished the whole tree.
        throw new Error('Cannot commit an incomplete root. This error is likely caused by a ' + 'bug in React. Please file an issue.')
    }

    if (__DEV__) {
        if (enableDebugTracing) {
            logRenderStopped()
        }
    }

    if (enableSchedulingProfiler) {
        markRenderStopped()
    }

    // Set this to null to indicate there's no in-progress render.
    workInProgressRoot = null
    workInProgressRootRenderLanes = NoLanes

    return workInProgressRootExitStatus
}

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

/** workLoopSync 是一个工作循环，用于构建 Fiber 树，workInProgress 为根节点 */
function workLoopSync() {
    // Already timed out, so perform work without checking if we need to yield.
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress)
    }
}

function performUnitOfWork(unitOfWork: Fiber): void {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    const current = unitOfWork.alternate
    setCurrentDebugFiberInDEV(unitOfWork)

    let next
    if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
        startProfilerTimer(unitOfWork)
        next = beginWork(current, unitOfWork, subtreeRenderLanes)
        stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true)
    } else {
        next = beginWork(current, unitOfWork, subtreeRenderLanes)
    }

    resetCurrentDebugFiberInDEV()
    unitOfWork.memoizedProps = unitOfWork.pendingProps
    if (next === null) {
        // If this doesn't spawn new work, complete the current work.
        completeUnitOfWork(unitOfWork)
    } else {
        workInProgress = next
    }

    ReactCurrentOwner.current = null
}
