##### 构建良好的 state 可以让组件变得易于修改和调试，而不会经常出错

1. 合并关联的 state

将多个单独的 state，合并为公共对象的形式，如

```jsx
const [x, setX] = useState(0)
const [y, setY] = useState(0)

const [position, setPosition] = useState({
    x: 0,
    y: 0,
})
```

2. 避免互相矛盾的 state

3. 避免冗余的 state

能在渲染期间从组件的 props 或其现有的 state 变量中计算出一些信息，则不应将这些信息放入该组件的 state 中

4. 避免重复的 state

当同一数据在多个 state 变量之间或在多个嵌套对象中重复时，这会很难保持它们同步。应尽可能减少重复

5. 避免深度嵌套的 state

深度分层的 state 更新起来不是很方便。如果可能的话，最好以扁平化方式重构数据格式并构建更高效的 state
