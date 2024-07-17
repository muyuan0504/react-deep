/** 非 Class 的形式实现状态管理 */

import { observable, action } from 'mobx'

const todoStore = observable({
    todos: [1, 2, 3, 4],
    addTodo: action(function (todo) {
        this.todos.push(todo)
    }),
    removeTodo: action(function (index) {
        this.todos.splice(index, 1)
    }),
    get todoCount() {
        return this.todos.length
    },
})

export default todoStore
