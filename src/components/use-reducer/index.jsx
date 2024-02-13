/** reducer: 将组件的所有状态更新逻辑整合到一个外部函数中，这个函数叫作 reducer
 * Reducer 是处理状态的另一种方式。你可以通过三个步骤将 useState 迁移到 useReducer：
 * 1. 将设置状态的逻辑 修改 成 dispatch 的一个 action;
 * 2. 编写 一个 reducer 函数；
 * 3. 在你的组件中 使用 reducer.
 */

import React, { useReducer } from 'react'
import { customReducer } from './util-reducer'

const list = [
    {
        id: 0,
        text: 'item0',
    },
    {
        id: 1,
        text: 'item1',
    },
]

const UseReducer = (props) => {
    /** useReducer
     * useReducer 和 useState 很相似——必须传递一个初始状态，它会返回一个有状态的值和一个设置该状态的函数
     * useReducer 钩子接受 2 个参数：
     * 1. 一个 reducer 函数 => 函数的返回值就是更新后的state的值
     * 2. 一个初始的 state
     *
     * 简单来看，reducer相当于将对同一份数据的不同操作，内聚到一个函数内进行处理，而函数的返回值，就是更新后的状态值。
     * 和 useState 不同的是，useState 的set函数是直接变更状态值，而 reducer 函数可以在内部定义不同的操作逻辑。
     */
    const [nameList, dispatch] = useReducer(customReducer, list)
    const nameItem = nameList.map((_item) => <div key={_item.id}>{_item.text}</div>)
    const addItem = () => {
        const useId = nameList[nameList.length - 1].id + 1
        dispatch({
            type: 'add',
            id: useId,
            text: `item${useId}`,
        })
    }
    return (
        <>
            <h3>use-reducer:</h3>
            <p></p>
            <div>{nameItem}</div>
            <p>
                <button onClick={addItem}>添加元素</button>
            </p>
        </>
    )
}

export default UseReducer
