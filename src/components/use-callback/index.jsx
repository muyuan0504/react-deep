import React, { useCallback, useState } from 'react'

import ComponentA from './component-a'

export default function UseCallback(props) {
    const [count, setCount] = useState(0)
    const [name, setName] = useState('aiden')
    const handleSetName = (name) => {
        setName(name)
    }
    /**
     * useCallback 是一个允许你在多次渲染中缓存函数的 React Hook
     * const cachedFn = useCallback(fn, dependencies)
     * fn：想要缓存的函数。
     * 此函数可以接受任何参数并且返回任何值; React 将会在初次渲染而非调用时返回该函数。
     * 当进行下一次渲染时，如果 dependencies 相比于上一次渲染时没有改变，那么 React 将会返回相同的函数。
     * 否则，React 将返回在最新一次渲染中传入的函数，并且将其缓存以便之后使用。React 不会调用此函数，而是返回此函数。你可以自己决定何时调用以及是否调用
     *
     * dependencies：有关是否更新 fn 的所有响应式值的一个列表。响应式值包括 props、state，和所有在你组件内部直接声明的变量和函数
     */
    // const handleClick = () => {
    //     // 如果使用普通函数，那么每次handleClick都会出发子组件A的重新渲染，因为 handleClick 每次都会重新创建，对于子组件接收的props而言，就是变化的
    //     console.log('handleClick exec')
    //     setCount(count + 1)
    // }
    const handleClick = useCallback(() => {
		// 当使用 useCallback 包裹执行函数后，除了首次执行会出发子组件A的重新渲染，后续的执行都不会再出发子组件的更新
        console.log('useCallback exec')
        setCount(count + 1)
    }, [])
    return (
        <>
            <h3>use callback:</h3>
            <p>
                <span>count: {count}</span>
            </p>
            <p>
                <button onClick={handleClick}>count++ in father</button>
            </p>
            <p>
                <span>name: {name}</span>
            </p>
            <p>
                <button onClick={() => handleSetName(Math.random() * 10)}>set name</button>
            </p>
            <ComponentA onClick={handleClick} />
        </>
    )
}
