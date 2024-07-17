import React from 'react'

import { observer } from 'mobx-react-lite'
import { counterStore, todoStore } from '@/store/index'

const PageSon = observer(() => {
    const handleClick = () => {
        /** 无论是直接 counterStore.count++ 还是 counterStore.increment(), 都会响应式变更  */
        // counterStore.count++
        counterStore.increment()
    }

    // 如果是用函数式组件的方式渲染todos列表，那么要记得用 ovserver 包裹该组件，否则变更 store 数据，组件不会渲染
    const TodoList = observer(() => {
        return (
            <div className='todo-list'>
                {todoStore.todos.map((item) => (
                    <div key={item} className='todo-item'>
                        {item}
                    </div>
                ))}
            </div>
        )
    })

    return (
        <div>
            <h1>Page Son</h1>
            <div>
                <span>counterStore.count的值：</span>
                <span>{counterStore.count}</span>
            </div>
            <div>这个页面是son.jsx</div>
            <button onClick={handleClick}>增加</button>
            <TodoList />
            <button onClick={() => todoStore.addTodo(new Date().getTime() + 'son')}>增加</button>
            <button onClick={() => todoStore.removeTodo(todoStore.todoCount - 1)}>减少todo</button>
        </div>
    )
})

export default PageSon
