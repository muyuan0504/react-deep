import React, { useMemo, useState } from 'react'

export default function UseMemo(props) {
    const [count, setCount] = useState(0)
    const handleClick = () => {
        setCount(count + 1)
    }
    /**
     * useMemo: 在每次重新渲染的时候能够缓存计算的结果；有点类似于 Vue 中的 computed api
     *
     * 默认情况下，React 会在每次重新渲染时重新运行整个组件;
     * 当依赖的state或者props数据特别大时，比如当正在过滤转换一个大型数组，或者进行一些昂贵的计算，而数据没有改变，那么可能希望跳过这些重复计算，
     * 那么就可以将计算函数包装在 useMemo 中
     *
     * const cachedValue = useMemo(calculateValue, dependencies)
     * calculateValue：
     * 要缓存计算值的函数。它应该是一个没有任何参数的纯函数，并且可以返回任意类型。
     * React 将会在首次渲染时调用该函数；在之后的渲染中，如果 dependencies 没有发生变化，React 将直接返回相同值。
     * 否则，将会再次调用 calculateValue 并返回最新结果，然后缓存该结果以便下次重复使用
     *
     * dependencies:
     * 所有在 calculateValue 函数中使用的响应式变量组成的数组。响应式变量包括 props、state 和所有你直接在组件中定义的变量和函数
     *
     * 应该仅仅把 useMemo 作为性能优化的手段
     */
    const computedCount = useMemo(() => {
        // 在初次渲染时，useMemo 返回不带参数调用 calculateValue 的结果; 在接下来的渲染中，如果依赖项没有发生改变，它将返回上次缓存的值
        return count * 2
    }, [count])
    return (
        <>
            <h3>use-memo</h3>
            <p>
                <span>computedCount: {computedCount}</span>
            </p>
            <p>
                <span>count: {count}</span>
            </p>
            <button onClick={handleClick}>count++</button>
        </>
    )
}
