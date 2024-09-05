### react 渲染机制

#### 初始化渲染

-   创建根节点

    当调用 ReactDOM.render 或 ReactDOM.createRoot 时，React 会创建一个根 Fiber 节点。

```jsx
// ReactDOM.render
const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)

// ReactDOM.createRoot 的简单示例（React 18+）
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
```

-   reconciler: 协调器

调和是 React 的一个过程，用于比较当前 Fiber 树和新的更新以决定如何更新 DOM。这个过程由 React Reconciler 负责

1. 创建 Fiber 树

React 会将组件树转换为 Fiber 树。每个组件和元素都会被表示为一个 Fiber 节点

2. 开始工作循环

React 会从根节点开始遍历 Fiber 树，生成更新任务。这个过程是异步的，并且可以中断以响应用户交互

```js
// packages/react-reconciler/src/ReactFiberWorkLoop.js

function workLoopSync() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress)
    }
}
```

#### 更新过程

更新过程主要包括两个阶段：调和（Reconciliation）和提交（Commit）

-   调和阶段

调和阶段是对比旧的 Fiber 树和新的 JSX 结构，生成新的 Fiber 树的过程

1. 生成新的 Fiber 树：React 通过比较新旧虚拟 DOM，决定哪些节点需要更新、添加或删除

2. 生成更新任务：

React 会为每个需要更新的节点生成更新任务。这些任务会被存储在 Fiber 树中，等待提交阶段执行

```js
// packages/react-reconciler/src/ReactFiberBeginWork.js

function beginWork(current, workInProgress, renderLanes) {
    // 比较新旧 Fiber 树，生成新的 Fiber 树
}
```

-   提交阶段(commit)

提交阶段是将调和阶段生成的更新任务应用到真实 DOM 的过程。

1. 前处理（Before Mutation）：在更新真实 DOM 之前，React 会进行一些准备工作，比如调用生命周期方法

2. 更新 DOM（Mutation）：React 会遍历新的 Fiber 树，执行所有需要的 DOM 更新操作

3. 后处理（Layout）：更新完成后，React 会调用一些生命周期方法，比如 componentDidUpdate

```js
// packages/react-reconciler/src/ReactFiberCommitWork.js

function commitRoot(root) {
    commitBeforeMutationEffects()
    commitMutationEffects(root.current)
    commitLayoutEffects(root.current)
}
```

#### 调度和优先级

React 使用一种基于优先级的调度机制来管理更新任务。这个机制通过 lanes 来实现，确保高优先级任务（如用户交互）能迅速响应，而低优先级任务（如数据更新）可以延后执行

```js
// packages/react-reconciler/src/ReactFiberLane.js

function getNextLanes(root, wipLanes) {
    // 返回下一个需要处理的 lanes
}
```

```
在初次渲染的情况下，performSyncWorkOnRoot 是通过 updateContainer 调用的。具体调用链如下：

ReactDOMRoot.render -> updateContainer
updateContainer -> enqueueUpdate
enqueueUpdate -> scheduleUpdateOnFiber
scheduleUpdateOnFiber -> ensureRootIsScheduled
ensureRootIsScheduled -> performSyncWorkOnRoot

```
