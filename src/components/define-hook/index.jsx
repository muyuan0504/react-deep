/**
 * 自定义 Hook：组件间共享逻辑
 * Hook 的名称必须永远以 use 开头
 * 自定义 Hook 共享的是状态逻辑，而不是状态本身
 */

import React from 'react'

import { useCount } from './util-hook'
import ComponentA from './component-a'

export default function DefineHook(props) {
    const [count, setCount] = useCount(1)

    const handleClick = () => {
        setCount(count + 1)
    }

    return (
        <>
            <h3>define hook: </h3>
            <p>
                <span>count: {count}</span>
            </p>
            <button onClick={handleClick}>count++</button>
            <ComponentA />
        </>
    )
}
