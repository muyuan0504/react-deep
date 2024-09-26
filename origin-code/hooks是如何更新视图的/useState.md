以 `useState` 的更新为例，看下 hooks 的更新机制

一个 hook 链表的节点数据如下

```js
// packages/react-reconciler/src/ReactFiberHooks.old.js

export type Hook = {|
    memoizedState: any, // 上次渲染时所用的 state
    baseState: any, // 已处理的 update 计算出的 state
    baseQueue: Update<any, any> | null, // 未处理的 update 队列（一般是上一轮渲染未完成的 update）
    queue: UpdateQueue<any, any> | null, // 当前出发的 update 队列
    next: Hook | null, // 指向下一个 hook，形成链表结构
|}
```

要注意的是不同的 hooks 方法，memoizedState 存储的内容不同，常用的 hooks memoizedState 存储的内容如下：

```text
useState: state
useEffect: effect 对象
useMemo/useCallback: [callback, deps]
useRef: { current: xxx }
```

当我们在函数组件中使用了两个 useState

```js
const [name, setName] = useState('ncu')
const [age, setAge] = useState(2012)
```

那么此时 Hook 结构如下：

```ts
{
  memoizedState: 'ncu',
  baseState: 'ncu',
  baseQueue: null,
  queue: null,
  next: {
    memoizedState: 2012,
    baseState: 2012,
    baseQueue: null,
    queue: null,
  },
};
```
