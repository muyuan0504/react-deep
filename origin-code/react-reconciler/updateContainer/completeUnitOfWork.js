function completeUnitOfWork(unitOfWork: Fiber): void {
    // Attempt to complete the current unit of work, then move to the next
    // sibling. If there are no more siblings, return to the parent fiber.
    let completedWork = unitOfWork
    do {
        // The current, flushed, state of this fiber is the alternate. Ideally
        // nothing should rely on this, but relying on it here means that we don't
        // need an additional field on the work in progress.
        const current = completedWork.alternate
        const returnFiber = completedWork.return

        // Check if the work completed or if something threw.
        if ((completedWork.flags & Incomplete) === NoFlags) {
            setCurrentDebugFiberInDEV(completedWork)
            let next
            if (!enableProfilerTimer || (completedWork.mode & ProfileMode) === NoMode) {
                next = completeWork(current, completedWork, subtreeRenderLanes)
            } else {
                startProfilerTimer(completedWork)
                next = completeWork(current, completedWork, subtreeRenderLanes)
                // Update render duration assuming we didn't error.
                stopProfilerTimerIfRunningAndRecordDelta(completedWork, false)
            }
            resetCurrentDebugFiberInDEV()

            if (next !== null) {
                // Completing this fiber spawned new work. Work on that next.
                workInProgress = next
                return
            }
        } else {
            // This fiber did not complete because something threw. Pop values off
            // the stack without entering the complete phase. If this is a boundary,
            // capture values if possible.
            const next = unwindWork(current, completedWork, subtreeRenderLanes)

            // Because this fiber did not complete, don't reset its lanes.

            if (next !== null) {
                // If completing this work spawned new work, do that next. We'll come
                // back here again.
                // Since we're restarting, remove anything that is not a host effect
                // from the effect tag.
                next.flags &= HostEffectMask
                workInProgress = next
                return
            }

            if (enableProfilerTimer && (completedWork.mode & ProfileMode) !== NoMode) {
                // Record the render duration for the fiber that errored.
                stopProfilerTimerIfRunningAndRecordDelta(completedWork, false)

                // Include the time spent working on failed children before continuing.
                let actualDuration = completedWork.actualDuration
                let child = completedWork.child
                while (child !== null) {
                    actualDuration += child.actualDuration
                    child = child.sibling
                }
                completedWork.actualDuration = actualDuration
            }

            if (returnFiber !== null) {
                // Mark the parent fiber as incomplete and clear its subtree flags.
                returnFiber.flags |= Incomplete
                returnFiber.subtreeFlags = NoFlags
                returnFiber.deletions = null
            } else {
                // We've unwound all the way to the root.
                workInProgressRootExitStatus = RootDidNotComplete
                workInProgress = null
                return
            }
        }

        const siblingFiber = completedWork.sibling
        if (siblingFiber !== null) {
            // If there is more work to do in this returnFiber, do that next.
            workInProgress = siblingFiber
            return
        }
        // Otherwise, return to the parent
        completedWork = returnFiber
        // Update the next thing we're working on in case something throws.
        workInProgress = completedWork
    } while (completedWork !== null)

    // We've reached the root.
    if (workInProgressRootExitStatus === RootInProgress) {
        workInProgressRootExitStatus = RootCompleted
    }
}
