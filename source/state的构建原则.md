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

```jsx
const [isSending, setIsSending] = useState(false)
const [isSent, setIsSent] = useState(false)

// isSending-发送中 和 isSent-已发送 的状态是互斥的,这将使得开发者需要变更其中一个状态的时候，必须更新另一个状态，如果忘记了更新，会使得难以理解组件的状态
// 可以考虑用一个变量维护状态 sendStatus -> init , sending, sent

setIsSending(false)
setIsSent(true)
```

3. 避免冗余的 state

能在渲染期间从组件的 props 或其现有的 state 变量中计算出一些信息，则不应将这些信息放入该组件的 state 中

```jsx
/** 假设有 state numberA , numberB, 当需要对其求和时，不需要单独再定义一个 state 来在numberA,numberB变化后求和，只需要直接定义一个变量即可 */
const [numberA, setNumberA] = useState(1)
const [numberB, setNumberB] = useState(2)

const countNumber = numberA + numberB

setNumberA(numberA + 1)
setNumberB(numberB + 1)
```

4. 避免重复的 state

当同一数据在多个 state 变量之间或在多个嵌套对象中重复时，这会很难保持它们同步。应尽可能减少重复

```jsx
const list = [
    { name: 'a', id: 0 },
    { name: 'b', id: 1 },
    { name: 'c', id: 2 },
]

const [numItems, setNumItems] = useState(list)
/** 这里 activeNum 与 numItems 重复了； 存在的隐藏问题是：当调用 setNumItem 时，视图层的 activeNum 并不会自动更新 */
const [activeNum, setActiveNum] = useState(numItems[0])

// 解决办法：消除重复的 state，通过声明的useActiveNum变量，会在numItems的变化引起的组件更新中，重新找到最新(numItems变化之后)的numItem,并同步到视图层
// 与双向数据绑定不同，这里的 useActiveNum 只会跟当前的 activeId 与 id 一致的数据产生关联，只有该数据被更改后才会同步更新。
// 即当 activeId === 0 时，编辑 id = 2 的对象不会同步 useActiveNum, 除非先通过 setActiveId 使 activeId = 2
const [activeId, setActiveId] = useState(list[0].id)

const useActiveNum = numItems.find((item) => item.id === activeId)
```

5. 避免深度嵌套的 state

深度分层的 state 更新起来不是很方便。如果可能的话，最好以扁平化方式重构数据格式并构建更高效的 state

```

```
