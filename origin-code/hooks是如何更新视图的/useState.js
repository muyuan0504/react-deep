/**
 * packages\react\src\ReactHooks.js
 * @param {*} initialState
 * @returns
 */
export function useState<S>(initialState: (() => S) | S): [S, Dispatch<BasicStateAction<S>>] {
    const dispatcher = resolveDispatcher()
    return dispatcher.useState(initialState)
}

// packages\react\src\ReactCurrentDispatcher.js
// 在初次渲染和更新渲染时，ReactCurrentDispatcher.current 会指向不同的调度器
const ReactCurrentDispatcher = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: (null: null | Dispatcher),
}

function resolveDispatcher() {
    const dispatcher = ReactCurrentDispatcher.current
    return ((dispatcher: any): Dispatcher)
}
