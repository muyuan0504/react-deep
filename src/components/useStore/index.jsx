import React from 'react'

import { observer } from 'mobx-react-lite'
import { counterStore } from '@/store/index'

console.error('---------- counterStore --------------', counterStore)

const UseStore = observer(() => {
    return (
        <div>
            <h1>component use-store</h1>
            <div>{counterStore.count}</div>
            <button onClick={() => counterStore.increment()}>增加</button>
            <button onClick={() => counterStore.decrement()}>减少todo</button>
        </div>
    )
})

export default UseStore
