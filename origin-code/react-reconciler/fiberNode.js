/**
 * packages\react-reconciler\src\ReactFiber.old.js
 *
 * createFiber(HostRoot, null, null, mode)  -> createFiber(3, null, null, 1)
 *
 * @param {*} tag
 * @param {*} pendingProps
 * @param {*} key
 * @param {*} mode
 */

function FiberNode(tag: WorkTag, pendingProps: mixed, key: null | string, mode: TypeOfMode) {
    // Instance
    this.tag = tag
    this.key = key
    this.elementType = null
    this.type = null
    this.stateNode = null

    // Fiber
    this.return = null
    this.child = null
    this.sibling = null
    this.index = 0

    this.ref = null

    this.pendingProps = pendingProps
    this.memoizedProps = null
    this.updateQueue = null
    this.memoizedState = null
    this.dependencies = null

    this.mode = mode

    // Effects
    this.flags = NoFlags
    this.subtreeFlags = NoFlags
    this.deletions = null

    this.lanes = NoLanes
    this.childLanes = NoLanes

    this.alternate = null // 每个 Fiber 节点都有一个 alternate 属性，指向相对应的双缓存下的另一版本的 Fiber 节点

    if (enableProfilerTimer) {
        // Note: The following is done to avoid a v8 performance cliff.
        //
        // Initializing the fields below to smis and later updating them with
        // double values will cause Fibers to end up having separate shapes.
        // This behavior/bug has something to do with Object.preventExtension().
        // Fortunately this only impacts DEV builds.
        // Unfortunately it makes React unusably slow for some applications.
        // To work around this, initialize the fields below with doubles.
        //
        // Learn more about this here:
        // https://github.com/facebook/react/issues/14365
        // https://bugs.chromium.org/p/v8/issues/detail?id=8538
        this.actualDuration = Number.NaN
        this.actualStartTime = Number.NaN
        this.selfBaseDuration = Number.NaN
        this.treeBaseDuration = Number.NaN

        // It's okay to replace the initial doubles with smis after initialization.
        // This won't trigger the performance cliff mentioned above,
        // and it simplifies other profiler code (including DevTools).
        this.actualDuration = 0
        this.actualStartTime = -1
        this.selfBaseDuration = 0
        this.treeBaseDuration = 0
    }

    if (__DEV__) {
        // This isn't directly used but is handy for debugging internals:

        this._debugSource = null
        this._debugOwner = null
        this._debugNeedsRemount = false
        this._debugHookTypes = null
        if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
            Object.preventExtensions(this)
        }
    }
}
