import React, { useEffect, useState } from 'react'

export default function UseEffectComp(props) {
    const [count, setCount] = useState(0)
    const [num, setNum] = useState(0)

    const handleClick = () => {
        setCount(count + 1)
    }

    const handleNumClick = () => {
        setNum(num + 1)
    }

    useEffect(() => {
        /**
         * 每次渲染后都会执行
         * 把调用 DOM 方法的操作封装在 Effect 中，你可以让 React 先更新屏幕，确定相关 DOM 创建好了以后然后再运行 Effect
         *
         * 将 依赖数组 传入 useEffect 的第二个参数，以告诉 React 跳过不必要地重新运行 Effect，只有依赖数组内的变量发生变化，才执行该useEffect
         */
        console.log('执行渲染1')
        //可以在 Effect 中返回一个 清理（cleanup） 函数； 每次重新执行 Effect 之前，React 都会调用清理函数；组件被卸载时，也会调用清理函数
        return () => {
            console.log('effect 清理函数')
        }
    }, [count])

    useEffect(() => {
        console.log('执行渲染2')
    })

    return (
        <>
            <h3>use Effect</h3>
            <p>
                <span>count: {count}</span>
                <br />
                <span>num: {num}</span>
            </p>
            <button onClick={handleClick}>count++</button>
            <button onClick={handleNumClick}>num++</button>
        </>
    )
}
