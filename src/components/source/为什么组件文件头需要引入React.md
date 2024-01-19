### 在 jsx 文件中没有使用 React，为什么还需要手动引入

在 React 中，**如果使用了 JSX（JavaScript XML）语法来定义组件，那么在组件文件中需要引入 React**。

JSX 是一种类似 XML 的语法，它被 React 用来描述用户界面的结构

```jsx
export default function UseComponent() {
    return <button>点击一下</button>
}

/** 上面函数会被转译为对 React.createElement 的调用，React.createElement 是由 React 库提供的一个函数，用于创建虚拟 DOM 元素 */

export default function UseComponent() {
    return React.createElement(<button>点击一下</button>)
}

```

### 什么情况下不需要引入 React 呢

在函数式组件中没有使用 React 的功能，包括转译后的 React 相关函数调用，此时可以不引入 React.

为了确保 JSX 能够正确转译并且 React 功能能够正常运行，通常还是需要在组件文件中引入 React.
