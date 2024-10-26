import React, { useState, useEffect } from 'react'

const ChildCb = ({ setChildMethod, updateNum }) => {
    const [count, updateCount] = useState(0)

    function dispatchCount() {
        // updateCount(() => count + 1) // 父组件调用后，count重置为了1
        console.log('子组件方法调用')
    }

    useEffect(() => {
        console.error('---------- aiden --------------', setChildMethod)
        setChildMethod(() => dispatchCount)
    }, [setChildMethod])

    return (
        <div>
            <span>{count}</span>
            <button onClick={() => updateCount(count + 1)}>更新count</button>
            <button onClick={updateNum}>更新父组件</button>
        </div>
    )
}

export default ChildCb
