### styled-components

一个流行的 CSS-in-JS 库，它允许你在 JavaScript 中编写 CSS。

实现原理涉及以下几个关键部分：

1. CSS-in-JS：将 CSS 作为 JavaScript 对象管理，并在运行时将其动态注入到 HTML 中。

2. Tagged Template Literals：利用 ES6 的 Tagged Template Literals 语法来创建样式。

3. 样式隔离：通过生成唯一的类名来避免样式冲突。

4. 动态样式：支持基于组件的 props 动态生成样式。

5. SSR 支持：支持服务端渲染，确保样式在初次加载时正确应用。

#### CSS-in-JS

styled-components 通过将 CSS 写在 JavaScript 文件中，使得样式能够直接在组件内部定义和管理。这种方法的优点是样式和组件的逻辑紧密结合，增强了组件的可维护性。

#### Tagged Template Literals

styled-components 使用 ES6 的 Tagged Template Literals 语法来定义样式：

```js
/** 补充：标签函数 */
const person = 'Mike'
const age = 28

function myTag(strings, personExp, ageExp) {
    const str0 = strings[0] // "That "
    const str1 = strings[1] // " is a "
    const str2 = strings[2] // "."
    const ageStr = ageExp > 99 ? 'centenarian' : 'youngster'
    // 我们甚至可以返回使用模板字面量构建的字符串
    return `${str0}${personExp}${str1}${ageStr}${str2}`
}

const output = myTag`That ${person} is a ${age}.`

console.log(output)
// That Mike is a youngster.

// 来一个更简单的例子

function test(str) {
    console.log(str.join(''))
}

test`模板字符串123 32r3` // 打印：模板字符串123 32r3
```

```jsx
import styled from 'styled-components'

const Button = styled.button`
    background: blue;
    color: white;
    font-size: 16px;

    &:hover {
        background: darkblue;
    }
`
```

styled.button 是一个 Tagged Template Literal，它将样式字符串传递给一个函数，这个函数负责处理字符串并生成相应的样式规则。

#### 样式隔离

为了避免样式冲突，styled-components 会为每个组件生成唯一的类名。这些类名通常是哈希值，确保不同组件之间的样式不会互相影响。

```css
/* 生成的 CSS */
.sc-a1234567 {
    background: blue;
    color: white;
    font-size: 16px;
}

.sc-a1234567:hover {
    background: darkblue;
}
```

#### 动态样式

styled-components 允许你基于组件的 props 动态生成样式：

```jsx
const Button = styled.button`  background: ${props => props.primary ? 'blue' : 'gray'};
  color: white;
  font-size: 16px;`;

<Button primary>Primary Button</Button>
<Button>Secondary Button</Button>
```

上面的代码中，primary prop 决定了按钮的背景颜色。

#### SSR 支持

为了支持服务端渲染
（SSR），styled-components 提供了一些工具，比如 ServerStyleSheet。这些工具确保样式在服务器端渲染时正确生成，并注入到 HTML 中。

**styled-components 的工作流程**

1. 定义样式：使用 Tagged Template Literals 定义样式。

2. 生成唯一类名：解析样式字符串，生成唯一的类名。

3. 注入样式：将生成的 CSS 注入到 <style> 标签中，并添加到文档的 <head> 部分。

4. 应用类名：将生成的唯一类名应用到相应的 React 组件上。

示例
以下是 styled-components 的简单示例，展示了从定义到渲染的整个流程：

```jsx
import React from 'react'
import styled from 'styled-components'

const Button = styled.button`
    background: ${(props) => (props.primary ? 'blue' : 'gray')};
    color: white;
    font-size: 16px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;

    &:hover {
        background: ${(props) => (props.primary ? 'darkblue' : 'darkgray')};
    }
`

function App() {
    return (
        <div>
            <Button primary>Primary Button</Button>
            <Button>Secondary Button</Button>
        </div>
    )
}

export default App
```

在这个示例中：

1. styled.button 使用 Tagged Template Literals 语法定义了一个按钮的样式。

2. 根据 primary prop，动态生成不同的背景颜色。

3. styled-components 生成唯一的类名，并将其应用到组件上。

4. 生成的 CSS 被注入到 HTML 的 <style> 标签中，确保样式在页面加载时正确应用。

通过这种方式，styled-components 实现了样式与组件的高度集成和隔离，提供了强大的动态样式生成和管理能力。
