/** 由于 webpack 只能识别js、json 文件， 无法识别 jsx/tsx 文件，所以 React 需要配置 babel */

import React from 'react'
import ReactDOM from 'react-dom/client'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<h1>Hello, world!</h1>)
