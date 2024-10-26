import React, { useState, forwardRef, useImperativeHandle } from 'react'

const ComponentChild = forwardRef((props, ref) => {
    const [count, updateCount] = useState(0)

    useImperativeHandle(ref, () => ({
        dispatchCount() {
            updateCount(() => count + 1)
        },
    }))
    return (
        <div>
            <span>{count}</span>
            <button onClick={() => updateCount(() => count + 1)}>更新count</button>
        </div>
    )
})

export default ComponentChild
