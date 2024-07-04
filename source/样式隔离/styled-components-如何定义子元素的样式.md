### 使用 styled-components 做样式隔离，如何定义子元素的样式

在 styled-components 中定义子元素的样式可以通过嵌套样式、样式变量、属性选择器、子组件传递和组件扩展等多种方式来实现。

选择哪种方式取决于具体需求和代码风格。嵌套样式适合简单的层级结构，样式变量和组件扩展适合复杂的组件组合和复用

1. 使用嵌套样式

styled-components 支持嵌套样式，可以直接在父组件的样式中定义子元素的样式

```jsx
import React from 'react'

import styled from 'styled-components'
console.error('---------- styled --------------', styled)

const DivHeader = styled.header`
    background-color: orange;
    color: white;
    padding: 20px;
    .child {
        color: #333;
    }
`

export default function CssInJs() {
    return (
        <div>
            <h5>css in js</h5>
            <DivHeader>
                <div>
                    <span>样式文字</span>
                    <span className='child'>子元素</span>
                </div>
            </DivHeader>
        </div>
    )
}
```

2. 使用样式变量包裹每个标签

```jsx
import styled from 'styled-components'
console.error('---------- styled --------------', styled)

/** styled.header -> 会生成一个带有唯一id标识的header标签 <header class="sc-beqWNU jbPySM"><  */
const DivHeader = styled.header`
    background-color: orange;
    color: white;
    padding: 20px;
    .child {
        color: #333;
    }
`

const DivBlack = styled.div`
    background-color: black;
`

export default function CssInJs() {
    return (
        <div>
            <h5>css in js</h5>
            <DivHeader>
                <span>样式文字</span>
                <span className='child'>子元素</span>
                <DivBlack>黑色背景的文字</DivBlack>
            </DivHeader>
        </div>
    )
}
```

3. 使用属性选择器或子组件传递

-   子组件传递

```jsx
import React from 'react'
import styled from 'styled-components'

const Parent = styled.div`
    background-color: #f0f0f0;
    padding: 20px;
`

const Child = styled.div`
    color: ${(props) => props.color || '#333'};
    margin-top: 10px;
`

function App() {
    return (
        <Parent>
            <Child color='blue'>This is a child element</Child>
            <Child color='green'>This is another child element</Child>
        </Parent>
    )
}

export default App
```

-   属性选择器

```jsx
import React from 'react'
import styled from 'styled-components'

const Parent = styled.div`
    background-color: #f0f0f0;
    padding: 20px;

    &[data-type='primary'] .child {
        color: blue;
    }

    &[data-type='secondary'] .child {
        color: green;
    }
`

function App() {
    return (
        <Parent data-type='primary'>
            <div className='child'>This is a child element</div>
        </Parent>
    )
}

export default App
```

4. 使用组件扩展

可以扩展一个已有的 styled-component 来创建新的组件。

```jsx
import React from 'react'
import styled from 'styled-components'

const DivBlack = styled.div`
    background-color: black;
    color: white;
`

const DidExtend = styled(DivBlack)`
    color: yellowgreen;
`

export default function CssInJs() {
    return (
        <div>
            <h5>css in js</h5>
            <div>
                <span>样式文字</span>
                <span className='child'>子元素</span>
                <DivBlack>黑色背景的文字</DivBlack>
                <DidExtend>黑色背景的文字2</DidExtend>
            </div>
        </div>
    )
}
```
