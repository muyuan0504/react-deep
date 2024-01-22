import React from 'react'

import ComponentA from './ComponentA'

/**
 * 组件函数的参数即是接收的 props 对象，来自于父组件引用子组件时注入 <UseProps appData={appData} />
 * props 可以接收父组件定义的 useState  Hook函数，并且Hook的特性同样被保留
 * 支持 props 函数内部提供默认值，但是当传入了的值即使是 null，默认值也将 不 被使用
 */
const UseProps = (props) => {
    const { appData = {}, stateProp = {} } = props
    console.log('use Props get props', props)

    const { appCount, setappCount } = stateProp

    const btnClick = (e) => {
        /** 阻止事件捕获，将btnClick传递给 componentA 时，可以避免component A 中children 的父组件上面的点击事件被触发 */
        e.stopPropagation()
        setappCount(appCount + 1)
    }

    return (
        <>
            <h3>use Props</h3>
            <p>
                <span>appcount: </span>
                <span>{appCount}</span>
            </p>
            <p>
                <button onClick={btnClick}>appCount++</button>
            </p>
            {/** 使用 JSX 支持展开语法传递 props, 支持传递事件，事件名相当于props的一个属性   */}
            <ComponentA {...props} onClick={btnClick}>
                {/** 组件的slot将以children的形式传递给组件内部 */}
                <span>children in Component A</span>
            </ComponentA>
        </>
    )
}

export default UseProps
