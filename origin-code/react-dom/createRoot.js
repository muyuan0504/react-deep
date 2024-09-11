/** packages\react-dom\src\client\ReactDOMRoot.js
 *
 * 当应用侧执行ReactDOM.createRoot时调用
 */

export function createRoot(container: Element | Document | DocumentFragment, options?: CreateRootOptions): RootType {
    if (!isValidContainer(container)) {
        // 校验是否是有效的element容器
        throw new Error('createRoot(...): Target container is not a DOM element.')
    }

    // warnIfReactDOMContainerInDEV Dev模式下，如果试图将body当做contain或者将一个构建好的ROOT对象传入，抛出警告
    warnIfReactDOMContainerInDEV(container)

    let isStrictMode = false
    let concurrentUpdatesByDefaultOverride = false
    let identifierPrefix = ''
    let onRecoverableError = defaultOnRecoverableError
    let transitionCallbacks = null

    if (options !== null && options !== undefined) {
        if (options.unstable_strictMode === true) {
            isStrictMode = true
        }
        if (allowConcurrentByDefault && options.unstable_concurrentUpdatesByDefault === true) {
            concurrentUpdatesByDefaultOverride = true
        }
        if (options.identifierPrefix !== undefined) {
            identifierPrefix = options.identifierPrefix
        }
        if (options.onRecoverableError !== undefined) {
            onRecoverableError = options.onRecoverableError
        }
        if (options.transitionCallbacks !== undefined) {
            transitionCallbacks = options.transitionCallbacks
        }
    }

    /**
     * 用于创建一个可以处理并发更新的 React 根容器
     * 创建fiber树的根节点, 参考 origin-code\react-reconciler\createContainer.js
     *
     * ConcurrentRoot：常量为1,代表的是渲染根类型；   packages\react-reconciler\src\ReactRootTags.js
     * isStrictMode：是否开启严格模式，默认为false
     * concurrentUpdatesByDefaultOverride: 是否启用并发更新的默认行为，默认false，采用同步模式
     * identifierPrefix：这个参数用于为生成的 HTML 元素 ID 或 key 值添加一个前缀，以确保在不同 React 应用实例之间的唯一性， 默认为 ''
     * onRecoverableError: 这是一个回调函数，当 React 捕获到可恢复的错误时（即不会导致应用崩溃的错误），会调用该函数。你可以使用这个回调来记录错误或展示用户友好的提示
     * transitionCallbacks:  用于监听和处理 React 并发模式下的“过渡”状态。React 18 引入了“过渡”概念，用于处理状态更新和界面切换
     */
    const root = createContainer(container, ConcurrentRoot, null, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError, transitionCallbacks)

    // 将一个 DOM 容器标记为 React 的根容器（即 将它与 React 的根节点关联起来）root.current 在createContainer时构造了 root.current = uninitializedFiber
    markContainerAsRoot(root.current, container)

    const rootContainerElement: Document | Element | DocumentFragment = container.nodeType === COMMENT_NODE ? (container.parentNode: any) : container
    listenToAllSupportedEvents(rootContainerElement)

    return new ReactDOMRoot(root)
}

function ReactDOMRoot(internalRoot: FiberRoot) {
    this._internalRoot = internalRoot
}

/** 声明 ReactDOMRoot 实例的 render 方法，接收一个子元素，即作为入口的父组件
 *
 * const root = ReactDOM.createRoot(document.getElementById('root'))
 * root.render(<MyApp />)
 *
 */
ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function (children: ReactNodeList): void {
    const root = this._internalRoot
    if (root === null) {
        throw new Error('Cannot update an unmounted root.')
    }
    // origin-code\react-reconciler\updateContainer.js
    updateContainer(children, root, null, null)
}
