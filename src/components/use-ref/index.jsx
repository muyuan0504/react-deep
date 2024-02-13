import React, { useRef } from 'react'

export default function UseRef() {
    /**
     * UseRef接收一个初始值参数，并返回一个带有属性 current , 值为初始值参数的对象
     * 即 useRef(initialValue) 返回 { current: initialValue }
     *
     * 何时使用 ref ：
     * 1. 存储 timeout ID
     * 2. 存储和操作 DOM 元素
     * 3. 存储不需要被用来计算 JSX 的其他对象
     *
     * ref 是一种脱围机制，用于保留不用于渲染的值。 你不会经常需要它们
     * ref 是一个普通的 JavaScript 对象，具有一个名为 current 的属性，你可以对其进行读取或设置
     * 与 state 一样，ref 允许你在组件的重新渲染之间保留信息
     * 与 state 不同，设置 ref 的 current 值不会触发重新渲染
     * 不要在渲染过程中读取或写入 ref.current。这使你的组件难以预测
     *
     */
    const count = useRef(0)
    const handleClick = () => {
        // ref 变更不会导致重新渲染
        count.current = count.current + 1
        console.log(count.current)
    }

    /** 使用 useRef 操作DOM */
    const customEl = useRef(null)
    setTimeout(() => {
        // 获取到了p元素节点
        console.log(customEl.current)
    }, 0)
    return (
        <>
            <h3>use ref:</h3>
            <p ref={customEl}>
                <span>count: {count.current}</span>
            </p>
            <button onClick={handleClick}>点击count++</button>
        </>
    )
}
