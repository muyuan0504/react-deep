/** 由于 webpack 只能识别js、json 文件， 无法识别 jsx/tsx 文件，所以 React 需要配置 babel */

import React from 'react'
import ReactDOM from 'react-dom/client'

/** React的路由模式
 * BrowserRouter：基于history实现的路由
 *
 */

import { RouterProvider, BrowserRouter } from 'react-router-dom'
import { createHashRouter, Routes, Route } from 'react-router-dom'
import router from './route/index'

// import MyApp from './app'

const root = ReactDOM.createRoot(document.getElementById('root'))

// const HashRouter = createHashRouter()

root.render(
    // 路由声明的第一种方式
    <RouterProvider router={router} />

    // 路由声明的第二种方式
    // <React.StrictMode>
    //     {/* <BrowserRouter>
    //         <MyApp />
    //     </BrowserRouter> */}
    //     <HashRouter>
    //         <MyApp />
    //     </HashRouter>
    // </React.StrictMode>

    // 路由声明的第三种方式

    // <HashRouter>
    //     <Routes>
    //         {routes.map((route) => (
    //             <Route key={route.path} path={route.path} element={route.element} />
    //         ))}
    //     </Routes>
    // </HashRouter>
)
