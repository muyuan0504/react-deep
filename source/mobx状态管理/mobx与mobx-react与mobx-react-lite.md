### mobx mobx-react mobx-react-lite 的关系和区别

#### mobx

`mobx` 是一个独立的状态管理库，它提供了响应式编程模型。

它允许你创建可观察的状态（observable state）、定义衍生数据（computed values）、定义操作（actions）和自动追踪状态的变化以触发相应的反应（reactions）

主要功能：

1. 创建可观察的状态（observable state）

2. 定义衍生数据（computed values）

3. 定义操作（actions）

4. 自动追踪状态变化并触发反应（reactions）

#### mobx-react

`mobx-react`是一个将 MobX 与 React 集成的库，提供了一些高阶组件和工具，用于使 React 组件能够响应 MobX 状态的变化。

主要功能：

1. `observer` 高阶组件：使 React 类组件和函数组件能够响应 MobX 状态的变化。

2. `Provider` 组件：用于在组件树中注入 MobX stores。

3. 其他用于与 React 集成的工具和辅助函数。

#### mobx-react-lite

`mobx-react-lite`是一个轻量级的 MobX 与 React 集成的库，它主要用于函数组件。

它提供了与 mobx-react 类似的功能，但仅支持函数组件。由于它没有支持类组件的代码，因此比 mobx-react 更轻量。

主要功能：

1. `observer` 高阶组件：使 React 函数组件能够响应 MobX 状态的变化。

2. `useLocalObservable` 钩子：在函数组件中创建本地的可观察状态。

3. `useObserver` 钩子：使函数组件能够响应 MobX 状态的变化。

### 它们之间的关系和区别

#### 关系

-   mobx 是核心状态管理库，提供了所有的状态管理功能。

-   mobx-react 和 mobx-react-lite 是基于 mobx 的 React 绑定库，它们使 MobX 的状态管理功能可以在 React 组件中使用。

#### 区别

1. 支持的组件类型：

-   mobx-react 支持类组件和函数组件。
-   mobx-react-lite 仅支持函数组件。

2. 体积：

    mobx-react-lite 没有支持类组件的代码，因此比 mobx-react 更轻量。

3. 功能：
   mobx-react 提供了更完整的功能集，包括 Provider 组件和一些用于类组件的工具。
   mobx-react-lite 主要提供基本功能，专注于函数组件。

**选择使用哪个库**

如果你的项目中主要使用函数组件，并且你希望尽可能减小依赖的体积，可以选择 mobx-react-lite。
如果你的项目中有大量的类组件，或者你需要使用 Provider 等高级功能，可以选择 mobx-react。
