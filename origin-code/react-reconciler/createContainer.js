/** packages\react-reconciler\src\ReactFiberReconciler.old.js
 *
 *
 */

export function createContainer(
    containerInfo: Container,
    tag: RootTag,
    hydrationCallbacks: null | SuspenseHydrationCallbacks,
    isStrictMode: boolean,
    concurrentUpdatesByDefaultOverride: null | boolean,
    identifierPrefix: string,
    onRecoverableError: (error: mixed) => void,
    transitionCallbacks: null | TransitionTracingCallbacks
): OpaqueRoot {
    const hydrate = false
    const initialChildren = null
    // 创建 fiber 树的根节点
    return createFiberRoot(
        containerInfo,
        tag,
        hydrate,
        initialChildren,
        hydrationCallbacks,
        isStrictMode,
        concurrentUpdatesByDefaultOverride,
        identifierPrefix,
        onRecoverableError,
        transitionCallbacks
    )
}

/**
 * createFiberRoot: 创建 fiber 根节点
 * packages\react-reconciler\src\ReactFiberRoot.old.js
 *
 */
export function createFiberRoot(
    containerInfo: any,
    tag: RootTag,
    hydrate: boolean,
    initialChildren: ReactNodeList,
    hydrationCallbacks: null | SuspenseHydrationCallbacks,
    isStrictMode: boolean,
    concurrentUpdatesByDefaultOverride: null | boolean,
    // TODO: We have several of these arguments that are conceptually part of the
    // host config, but because they are passed in at runtime, we have to thread
    // them through the root constructor. Perhaps we should put them all into a
    // single type, like a DynamicHostConfig that is defined by the renderer.
    identifierPrefix: string,
    onRecoverableError: null | ((error: mixed) => void),
    transitionCallbacks: null | TransitionTracingCallbacks
): FiberRoot {
    const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onRecoverableError): any)
    if (enableSuspenseCallback) {
        root.hydrationCallbacks = hydrationCallbacks
    }

    if (enableTransitionTracing) {
        root.transitionCallbacks = transitionCallbacks
    }

    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    const uninitializedFiber = createHostRootFiber(tag, isStrictMode, concurrentUpdatesByDefaultOverride)

    root.current = uninitializedFiber

    uninitializedFiber.stateNode = root

    if (enableCache) {
        const initialCache = createCache()
        retainCache(initialCache)

        // The pooledCache is a fresh cache instance that is used temporarily
        // for newly mounted boundaries during a render. In general, the
        // pooledCache is always cleared from the root at the end of a render:
        // it is either released when render commits, or moved to an Offscreen
        // component if rendering suspends. Because the lifetime of the pooled
        // cache is distinct from the main memoizedState.cache, it must be
        // retained separately.
        root.pooledCache = initialCache
        retainCache(initialCache)
        const initialState: RootState = {
            element: initialChildren,
            isDehydrated: hydrate,
            cache: initialCache,
            transitions: null,
            pendingSuspenseBoundaries: null,
        }
        uninitializedFiber.memoizedState = initialState
    } else {
        const initialState: RootState = {
            element: initialChildren,
            isDehydrated: hydrate,
            cache: (null: any), // not enabled yet
            transitions: null,
            pendingSuspenseBoundaries: null,
        }
        uninitializedFiber.memoizedState = initialState
    }

    initializeUpdateQueue(uninitializedFiber)

    return root
}

/** packages\react-reconciler\src\ReactFiberClassUpdateQueue.old.js
 * 在初始化根节点后，初始化了根节点的updateQueue对象
 */
export function initializeUpdateQueue<State>(fiber: Fiber): void {
    const queue: UpdateQueue<State> = {
        baseState: fiber.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
            pending: null,
            interleaved: null,
            lanes: NoLanes,
        },
        effects: null,
    }
    fiber.updateQueue = queue
}
