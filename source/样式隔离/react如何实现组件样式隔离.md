在 React 中实现组件样式隔离可以通过多种方式来完成。以下是几种常见的方法：

1. CSS Modules

CSS Modules 是一种 CSS 文件的模块化方案，它可以让你为每个组件定义独立的样式，避免样式冲突

基于 create-react-app 创建的项目默认支持 CSS Modules，因此不需要额外安装依赖

```css
/* src/App.module.css */
.appHeader {
    background-color: #282c34;
    padding: 20px;
    color: white;
}
```

```jsx
// src/App.js
import React from 'react'
import styles from './App.module.css'

function App() {
    return (
        <div className='App'>
            <header className={styles.appHeader}>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
            </header>
        </div>
    )
}

export default App
```

2. Styled Components

一种使用 JavaScript 来定义样式的库，它可以让你将样式直接写在组件内，实现样式的完全隔离

```bash
npm install styled-components
```

```jsx
// src/App.js
import React from 'react'
import styled from 'styled-components'

const AppHeader = styled.header`
    background-color: #282c34;
    padding: 20px;
    color: white;
`

function App() {
    return (
        <div className='App'>
            <AppHeader>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
            </AppHeader>
        </div>
    )
}

export default App
```

3. Emotion

Emotion 是另一个流行的 CSS-in-JS 库，功能类似于 Styled Components

```bash
npm install @emotion/react @emotion/styled
```

```jsx
// src/App.js
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import styled from '@emotion/styled'

const appHeaderStyle = css`
    background-color: #282c34;
    padding: 20px;
    color: white;
`

const AppHeader = styled.header`
    ${appHeaderStyle}
`

function App() {
    return (
        <div className='App'>
            <AppHeader>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
            </AppHeader>
        </div>
    )
}

export default App
```

4. Scoped Styles with SCSS

可以通过 SCSS 和 Webpack 的模块化功能实现组件样式的隔离, 需要注意的是，为了保证能引入 scss 模块对象，scss 文件的命名需要基于 xxx.module.scss 的格式，必须要有 .module 标识

```bash
npm install sass style-loader css-loader sass-loader --save-dev
```

```scss
/* src/App.module.scss */
.appHeader {
    background-color: #282c34;
    padding: 20px;
    color: white;
}
```

```jsx
// src/App.js
import React from 'react'
import styles from './App.module.scss'

function App() {
    return (
        <div className='App'>
            <header className={styles.appHeader}>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
            </header>
        </div>
    )
}

export default App
```

styles.appHeader 会被创建一个唯一标识，类似于 <header class="cDDx4KlPghp6PIeN5KM2">，要注意的是，如果另一个组件也引用了这个 styles 对象，会同样沿用 [cDDx4KlPghp6PIeN5KM2] 该 class 标识
