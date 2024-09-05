/**
 * packages\react-reconciler\src\ReactFiberConcurrentUpdates.old.js
 * @param {*} fiber
 * @param {*} queue
 * @param {*} update
 * @param {*} lane
 * @returns
 */

// enqueueUpdate 函数会将更新添加到 Fiber 节点的更新队列中，并返回根 Fiber 节点。如果返回 null，通常是因为没有根节点或者更新无法被处理
export function enqueueUpdate<State>(fiber: Fiber, update: Update<State>, lane: Lane): FiberRoot | null {
    const updateQueue = fiber.updateQueue
    if (updateQueue === null) {
        // Only occurs if the fiber has been unmounted.
        return null
    }

    const sharedQueue: SharedQueue<State> = (updateQueue: any).shared

    if (isUnsafeClassRenderPhaseUpdate(fiber)) {
        // This is an unsafe render phase update. Add directly to the update
        // queue so we can process it immediately during the current render.
        const pending = sharedQueue.pending
        if (pending === null) {
            // This is the first update. Create a circular list.
            update.next = update
        } else {
            update.next = pending.next
            pending.next = update
        }
        sharedQueue.pending = update

        // Update the childLanes even though we're most likely already rendering
        // this fiber. This is for backwards compatibility in the case where you
        // update a different component during render phase than the one that is
        // currently renderings (a pattern that is accompanied by a warning).
        return unsafe_markUpdateLaneFromFiberToRoot(fiber, lane)
    } else {
        return enqueueConcurrentClassUpdate(fiber, sharedQueue, update, lane)
    }
}

export function enqueueConcurrentClassUpdate<State>(fiber: Fiber, queue: ClassQueue<State>, update: ClassUpdate<State>, lane: Lane) {
    const interleaved = queue.interleaved
    if (interleaved === null) {
        // This is the first update. Create a circular list.
        update.next = update
        // At the end of the current render, this queue's interleaved updates will
        // be transferred to the pending queue.
        pushConcurrentUpdateQueue(queue)
    } else {
        update.next = interleaved.next
        interleaved.next = update
    }
    queue.interleaved = update

    return markUpdateLaneFromFiberToRoot(fiber, lane)
}

function markUpdateLaneFromFiberToRoot(sourceFiber: Fiber, lane: Lane): FiberRoot | null {
    // Update the source fiber's lanes
    sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane)
    let alternate = sourceFiber.alternate
    if (alternate !== null) {
        alternate.lanes = mergeLanes(alternate.lanes, lane)
    }
    if (__DEV__) {
        if (alternate === null && (sourceFiber.flags & (Placement | Hydrating)) !== NoFlags) {
            warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber)
        }
    }
    // Walk the parent path to the root and update the child lanes.
    let node = sourceFiber
    let parent = sourceFiber.return
    while (parent !== null) {
        parent.childLanes = mergeLanes(parent.childLanes, lane)
        alternate = parent.alternate
        if (alternate !== null) {
            alternate.childLanes = mergeLanes(alternate.childLanes, lane)
        } else {
            if (__DEV__) {
                if ((parent.flags & (Placement | Hydrating)) !== NoFlags) {
                    warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber)
                }
            }
        }
        node = parent
        parent = parent.return
    }
    if (node.tag === HostRoot) {
        const root: FiberRoot = node.stateNode
        return root
    } else {
        return null
    }
}
