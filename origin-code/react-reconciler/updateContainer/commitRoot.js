function commitRoot(root: FiberRoot, recoverableErrors: null | Array<CapturedValue<mixed>>, transitions: Array<Transition> | null) {
    // TODO: This no longer makes any sense. We already wrap the mutation and
    // layout phases. Should be able to remove.
    const previousUpdateLanePriority = getCurrentUpdatePriority()
    const prevTransition = ReactCurrentBatchConfig.transition

    try {
        ReactCurrentBatchConfig.transition = null
        setCurrentUpdatePriority(DiscreteEventPriority)
        commitRootImpl(root, recoverableErrors, transitions, previousUpdateLanePriority)
    } finally {
        ReactCurrentBatchConfig.transition = prevTransition
        setCurrentUpdatePriority(previousUpdateLanePriority)
    }

    return null
}

function commitRootImpl(root: FiberRoot, recoverableErrors: null | Array<CapturedValue<mixed>>, transitions: Array<Transition> | null, renderPriorityLevel: EventPriority) {
    do {
        // `flushPassiveEffects` will call `flushSyncUpdateQueue` at the end, which
        // means `flushPassiveEffects` will sometimes result in additional
        // passive effects. So we need to keep flushing in a loop until there are
        // no more pending effects.
        // TODO: Might be better if `flushPassiveEffects` did not automatically
        // flush synchronous work at the end, to avoid factoring hazards like this.
        flushPassiveEffects()
    } while (rootWithPendingPassiveEffects !== null)
    flushRenderPhaseStrictModeWarningsInDEV()

    if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
        throw new Error('Should not already be working.')
    }

    const finishedWork = root.finishedWork
    const lanes = root.finishedLanes

    if (__DEV__) {
        if (enableDebugTracing) {
            logCommitStarted(lanes)
        }
    }

    if (enableSchedulingProfiler) {
        markCommitStarted(lanes)
    }

    if (finishedWork === null) {
        if (__DEV__) {
            if (enableDebugTracing) {
                logCommitStopped()
            }
        }

        if (enableSchedulingProfiler) {
            markCommitStopped()
        }

        return null
    } else {
        if (__DEV__) {
            if (lanes === NoLanes) {
                console.error('root.finishedLanes should not be empty during a commit. This is a ' + 'bug in React.')
            }
        }
    }
    root.finishedWork = null
    root.finishedLanes = NoLanes

    if (finishedWork === root.current) {
        throw new Error('Cannot commit the same tree as before. This error is likely caused by ' + 'a bug in React. Please file an issue.')
    }

    // commitRoot never returns a continuation; it always finishes synchronously.
    // So we can clear these now to allow a new callback to be scheduled.
    root.callbackNode = null
    root.callbackPriority = NoLane

    // Update the first and last pending times on this root. The new first
    // pending time is whatever is left on the root fiber.
    let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes)
    markRootFinished(root, remainingLanes)

    if (root === workInProgressRoot) {
        // We can reset these now that they are finished.
        workInProgressRoot = null
        workInProgress = null
        workInProgressRootRenderLanes = NoLanes
    } else {
        // This indicates that the last root we worked on is not the same one that
        // we're committing now. This most commonly happens when a suspended root
        // times out.
    }

    // If there are pending passive effects, schedule a callback to process them.
    // Do this as early as possible, so it is queued before anything else that
    // might get scheduled in the commit phase. (See #16714.)
    // TODO: Delete all other places that schedule the passive effect callback
    // They're redundant.
    if ((finishedWork.subtreeFlags & PassiveMask) !== NoFlags || (finishedWork.flags & PassiveMask) !== NoFlags) {
        if (!rootDoesHavePassiveEffects) {
            rootDoesHavePassiveEffects = true
            pendingPassiveEffectsRemainingLanes = remainingLanes
            // workInProgressTransitions might be overwritten, so we want
            // to store it in pendingPassiveTransitions until they get processed
            // We need to pass this through as an argument to commitRoot
            // because workInProgressTransitions might have changed between
            // the previous render and commit if we throttle the commit
            // with setTimeout
            pendingPassiveTransitions = transitions
            scheduleCallback(NormalSchedulerPriority, () => {
                flushPassiveEffects()
                // This render triggered passive effects: release the root cache pool
                // *after* passive effects fire to avoid freeing a cache pool that may
                // be referenced by a node in the tree (HostRoot, Cache boundary etc)
                return null
            })
        }
    }

    // Check if there are any effects in the whole tree.
    // TODO: This is left over from the effect list implementation, where we had
    // to check for the existence of `firstEffect` to satisfy Flow. I think the
    // only other reason this optimization exists is because it affects profiling.
    // Reconsider whether this is necessary.
    const subtreeHasEffects = (finishedWork.subtreeFlags & (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !== NoFlags
    const rootHasEffect = (finishedWork.flags & (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !== NoFlags

    if (subtreeHasEffects || rootHasEffect) {
        const prevTransition = ReactCurrentBatchConfig.transition
        ReactCurrentBatchConfig.transition = null
        const previousPriority = getCurrentUpdatePriority()
        setCurrentUpdatePriority(DiscreteEventPriority)

        const prevExecutionContext = executionContext
        executionContext |= CommitContext

        // Reset this to null before calling lifecycles
        ReactCurrentOwner.current = null

        // The commit phase is broken into several sub-phases. We do a separate pass
        // of the effect list for each phase: all mutation effects come before all
        // layout effects, and so on.

        // The first phase a "before mutation" phase. We use this phase to read the
        // state of the host tree right before we mutate it. This is where
        // getSnapshotBeforeUpdate is called.
		// Before Mutation 阶段
        const shouldFireAfterActiveInstanceBlur = commitBeforeMutationEffects(root, finishedWork)

        if (enableProfilerTimer) {
            // Mark the current commit time to be shared by all Profilers in this
            // batch. This enables them to be grouped later.
            recordCommitTime()
        }

        if (enableProfilerTimer && enableProfilerNestedUpdateScheduledHook) {
            // Track the root here, rather than in commitLayoutEffects(), because of ref setters.
            // Updates scheduled during ref detachment should also be flagged.
            rootCommittingMutationOrLayoutEffects = root
        }

        // The next phase is the mutation phase, where we mutate the host tree.
		// commitMutationEffects： 处理 DOM 变更，如插入、更新和删除 DOM 节点
        commitMutationEffects(root, finishedWork, lanes)

        if (enableCreateEventHandleAPI) {
            if (shouldFireAfterActiveInstanceBlur) {
                afterActiveInstanceBlur()
            }
        }
        resetAfterCommit(root.containerInfo)

        // The work-in-progress tree is now the current tree. This must come after
        // the mutation phase, so that the previous tree is still current during
        // componentWillUnmount, but before the layout phase, so that the finished
        // work is current during componentDidMount/Update.
        root.current = finishedWork

        // The next phase is the layout phase, where we call effects that read
        // the host tree after it's been mutated. The idiomatic use case for this is
        // layout, but class component lifecycles also fire here for legacy reasons.
        if (__DEV__) {
            if (enableDebugTracing) {
                logLayoutEffectsStarted(lanes)
            }
        }
        if (enableSchedulingProfiler) {
            markLayoutEffectsStarted(lanes)
        }
		// commitLayoutEffects： 处理 layout 的生命周期方法和副作用
        commitLayoutEffects(finishedWork, root, lanes)
        if (__DEV__) {
            if (enableDebugTracing) {
                logLayoutEffectsStopped()
            }
        }

        if (enableSchedulingProfiler) {
            markLayoutEffectsStopped()
        }

        if (enableProfilerTimer && enableProfilerNestedUpdateScheduledHook) {
            rootCommittingMutationOrLayoutEffects = null
        }

        // Tell Scheduler to yield at the end of the frame, so the browser has an
        // opportunity to paint.
        requestPaint()

        executionContext = prevExecutionContext

        // Reset the priority to the previous non-sync value.
        setCurrentUpdatePriority(previousPriority)
        ReactCurrentBatchConfig.transition = prevTransition
    } else {
        // No effects.
        root.current = finishedWork
        // Measure these anyway so the flamegraph explicitly shows that there were
        // no effects.
        // TODO: Maybe there's a better way to report this.
        if (enableProfilerTimer) {
            recordCommitTime()
        }
    }

    const rootDidHavePassiveEffects = rootDoesHavePassiveEffects

    if (rootDoesHavePassiveEffects) {
        // This commit has passive effects. Stash a reference to them. But don't
        // schedule a callback until after flushing layout work.
        rootDoesHavePassiveEffects = false
        rootWithPendingPassiveEffects = root
        pendingPassiveEffectsLanes = lanes
    } else {
        // There were no passive effects, so we can immediately release the cache
        // pool for this render.
        releaseRootPooledCache(root, remainingLanes)
        if (__DEV__) {
            nestedPassiveUpdateCount = 0
            rootWithPassiveNestedUpdates = null
        }
    }

    // Read this again, since an effect might have updated it
    remainingLanes = root.pendingLanes

    // Check if there's remaining work on this root
    // TODO: This is part of the `componentDidCatch` implementation. Its purpose
    // is to detect whether something might have called setState inside
    // `componentDidCatch`. The mechanism is known to be flawed because `setState`
    // inside `componentDidCatch` is itself flawed — that's why we recommend
    // `getDerivedStateFromError` instead. However, it could be improved by
    // checking if remainingLanes includes Sync work, instead of whether there's
    // any work remaining at all (which would also include stuff like Suspense
    // retries or transitions). It's been like this for a while, though, so fixing
    // it probably isn't that urgent.
    if (remainingLanes === NoLanes) {
        // If there's no remaining work, we can clear the set of already failed
        // error boundaries.
        legacyErrorBoundariesThatAlreadyFailed = null
    }

    if (__DEV__ && enableStrictEffects) {
        if (!rootDidHavePassiveEffects) {
            commitDoubleInvokeEffectsInDEV(root.current, false)
        }
    }

    onCommitRootDevTools(finishedWork.stateNode, renderPriorityLevel)

    if (enableUpdaterTracking) {
        if (isDevToolsPresent) {
            root.memoizedUpdaters.clear()
        }
    }

    if (__DEV__) {
        onCommitRootTestSelector()
    }

    // Always call this before exiting `commitRoot`, to ensure that any
    // additional work on this root is scheduled.
    ensureRootIsScheduled(root, now())

    if (recoverableErrors !== null) {
        // There were errors during this render, but recovered from them without
        // needing to surface it to the UI. We log them here.
        const onRecoverableError = root.onRecoverableError
        for (let i = 0; i < recoverableErrors.length; i++) {
            const recoverableError = recoverableErrors[i]
            const componentStack = recoverableError.stack
            const digest = recoverableError.digest
            onRecoverableError(recoverableError.value, { componentStack, digest })
        }
    }

    if (hasUncaughtError) {
        hasUncaughtError = false
        const error = firstUncaughtError
        firstUncaughtError = null
        throw error
    }

    // If the passive effects are the result of a discrete render, flush them
    // synchronously at the end of the current task so that the result is
    // immediately observable. Otherwise, we assume that they are not
    // order-dependent and do not need to be observed by external systems, so we
    // can wait until after paint.
    // TODO: We can optimize this by not scheduling the callback earlier. Since we
    // currently schedule the callback in multiple places, will wait until those
    // are consolidated.
    if (includesSomeLane(pendingPassiveEffectsLanes, SyncLane) && root.tag !== LegacyRoot) {
        flushPassiveEffects()
    }

    // Read this again, since a passive effect might have updated it
    remainingLanes = root.pendingLanes
    if (includesSomeLane(remainingLanes, (SyncLane: Lane))) {
        if (enableProfilerTimer && enableProfilerNestedUpdatePhase) {
            markNestedUpdateScheduled()
        }

        // Count the number of times the root synchronously re-renders without
        // finishing. If there are too many, it indicates an infinite update loop.
        if (root === rootWithNestedUpdates) {
            nestedUpdateCount++
        } else {
            nestedUpdateCount = 0
            rootWithNestedUpdates = root
        }
    } else {
        nestedUpdateCount = 0
    }

    // If layout work was scheduled, flush it now.
    flushSyncCallbacks()

    if (__DEV__) {
        if (enableDebugTracing) {
            logCommitStopped()
        }
    }

    if (enableSchedulingProfiler) {
        markCommitStopped()
    }

    return null
}
