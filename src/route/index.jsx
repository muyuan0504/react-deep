/**
 * React 的web路由管理涉及两个库的使用 react-router 与 react-router-dom
 *
 * [react-router]：
 * 是 React 官方提供的路由库，它提供了核心的路由功能，但不包含 DOM 相关的部分
 * 提供了 <Route>、<Switch>、<Redirect> 等核心组件来定义路由。
 *
 * [react-router-dom]:
 * 针对 Web 应用程序的库，它构建在 react-router 之上，并提供了与浏览器 DOM 相关的额外功能
 * 包含了在 Web 应用中常用的组件，比如 <BrowserRouter>、<Link> 等，这些组件用于在应用中创建链接、处理浏览器历史记录等
 */
import React from 'react'
import { createHashRouter, Link } from 'react-router-dom'

import App from '@/app'

const routes = createHashRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/about',
                element: (
                    <div>
                        <h2>about</h2>
                        <Link to='/about/concat'>About concat</Link>
                    </div>
                ),
                children: [
                    {
                        path: 'concat',
                        element: <div>about的子路由-concat</div>,
                    },
                ],
            },
            // {
            //     path: 'home',
            //     element: <MyApp />,
            // },
        ],
    },
])

export default routes
