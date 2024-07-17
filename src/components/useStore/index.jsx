import React from 'react'
import styles from './index.module'

import { observer } from 'mobx-react-lite'
import { counterStore, todoStore } from '@/store/index'

console.error('---------- counterStore --------------', counterStore)
console.error('---------- todoStore --------------', todoStore)

const UseStore = observer(() => {
    const todoList = todoStore.todos.map((item) => (
        <div key={item} className={styles.todoItem}>
            {item}
        </div>
    ))
    return (
        <div>
            <h1>component use-store</h1>
            <div>{counterStore.count}</div>
            <button onClick={() => counterStore.increment()}>增加</button>
            <button onClick={() => counterStore.decrement()}>减少count</button>
            <div className={styles.todoList}>{todoList}</div>
            <button onClick={() => todoStore.addTodo(new Date().getTime())}>增加</button>
            <button onClick={() => todoStore.removeTodo(todoStore.todoCount - 1)}>减少todo</button>
        </div>
    )
})

export default UseStore
