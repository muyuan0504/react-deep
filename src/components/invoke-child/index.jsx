/**
 * 父组件调用子组件的方法:
 * 1. 通过ref实现
 * 2. 通过回调函数传递
 *
 * 子组件调用父组件方法：通过props传递
 */

import React, { useRef, useState } from 'react'
import ComponentChild from './child'
import ChildCb from './childCb'

const InvokeChild = (props) => {
    const [num, setNum] = useState(0)
    const handleNum = () => {
        setNum(() => num + 1)
    }
    /**
     * 方法1：通过ref调用子组件方法
     */
    const childRef = useRef()
    const handleClick = () => {
        console.error('---------- aiden --------------', childRef)
        if (childRef.current) {
            childRef.current.dispatchCount() // 调用子组件方法
        }
    }

    /**
     * 方法2：通过回调函数传递, 如果组件方法内部涉及state的变动，可能导致组件的状态重置
     */
    const [childMethod, setChildMethod] = useState(null)
    const handleClickCb = () => {
        if (childMethod) {
            childMethod() // 调用子组件方法
        }
    }
    return (
        <div>
            <h2>父组件</h2>
            <span>{num}</span>
            <button onClick={handleNum}>更新num</button>
            <button onClick={handleClick}>父组件调用子组件内部方法</button>
            <button onClick={handleClickCb}>父组件调用子组件内部方法 - cb</button>
            <h3>子组件</h3>
            <ComponentChild ref={childRef} />
            <h3>子组件回调函数</h3>
            <ChildCb setChildMethod={setChildMethod} updateNum={handleNum} />
        </div>
    )
}

export default InvokeChild
