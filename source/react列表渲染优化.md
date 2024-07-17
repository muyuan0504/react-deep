### 列表渲染

1. 使用 `map` 方法渲染列表

```jsx
import React from 'react'

const TodoList = ({ todos }) => {
    return (
        <ul>
            {todos.map((todo, index) => (
                <li key={index}>{todo}</li>
            ))}
        </ul>
    )
}

export default TodoList
```

2. 拆分为子组件 - 如果列表项的渲染逻辑复杂，可以将其拆分为子组件。这有助于代码的可读性和可维护性

```jsx
import React from 'react'

const TodoItem = ({ todo, index, removeTodo }) => {
    return (
        <li>
            {todo}
            <button onClick={() => removeTodo(index)}>Remove</button>
        </li>
    )
}
const TodoList = ({ todos, removeTodo }) => {
    return (
        <ul>
            {todos.map((todo, index) => (
                <TodoItem key={index} todo={todo} index={index} removeTodo={removeTodo} />
            ))}
        </ul>
    )
}

export default TodoList
```

3. 使用 `Fragment` 或者短语法 `<>`, 避免在列表中生成不必要的 DOM 元素

```jsx
import React from 'react'

const TodoList = ({ todos }) => {
    return (
        <ul>
            {todos.map((todo, index) => (
                <React.Fragment key={index}>
                    <li>{todo}</li>
                </React.Fragment>
            ))}
        </ul>
    )
}

export default TodoList
```

4. 使用 useMemo 优化性能

对于大列表，可以使用 useMemo 来优化性能，防止不必要的重新渲染

```jsx
import React, { useMemo } from 'react'

const TodoList = ({ todos }) => {
    const renderedTodos = useMemo(() => {
        return todos.map((todo, index) => <li key={index}>{todo}</li>)
    }, [todos])

    return <ul>{renderedTodos}</ul>
}

export default TodoList
```

5. 使用 React Virtualized 或其他虚拟化库

对于非常大的列表，可以使用虚拟化技术来优化性能。React Virtualized 是一个流行的库，用于高效地渲染大列表

```jsx
import React from 'react'
import { List } from 'react-virtualized'

const TodoList = ({ todos }) => {
    const rowRenderer = ({ index, key, style }) => {
        return (
            <div key={key} style={style}>
                {todos[index]}
            </div>
        )
    }

    return <List width={300} height={300} rowCount={todos.length} rowHeight={20} rowRenderer={rowRenderer} />
}

export default TodoList
```
