hash 路由的跳转方式

1. 使用 Link 组件

2. 使用 useNavigate 钩子

3. 使用 NavLink 组件

NavLink 组件与 Link 类似，但它会自动为活动链接添加样式

4. 直接在 JavaScript 代码中设置 window.location.hash

-   在使用 HashRouter 时，推荐使用 Link 组件和 useNavigate 钩子来进行页面跳转，因为它们更符合 React 的编程范式，并且不会导致页面刷新。

-   NavLink 组件可以用于需要添加活动链接样式的导航。虽然直接修改 window.location.hash 也能实现跳转，但不推荐这种方式

NavLink 组件通常用于导航条样式，由于要监听当前导航的组件页面的状态，所以需要放到 Routes 之外

```jsx
import React from 'react'
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'

import Home from '@/pages/home'
import PageA from '@/pages/pageA'

export default function MyApp() {
    const dynamicClass = ({ isActive, isPending, isTransitioning }) => {
        console.error('---------- 激活状态 --------------', isPending, isActive, isTransitioning)
        return isActive || isPending ? 'isActive' : 'notActive'
    }
    /** HashRouter的使用 */
    return (
        <HashRouter>
            <nav>
                {/* 新版本activeClassName已经被移除，需要手动定义 */}
                {/* <NavLink to='pageA' activeClassName={styles.navActive}></NavLink> */}
                {/* <NavLink to='pageA' className={({ isActive }) => (isActive ? styles.navActive : '')}> */}
                <NavLink to='pageA' className={dynamicClass}>
                    Navlink跳转
                </NavLink>
                <NavLink to='/'>Navlink跳转回根路径</NavLink>
            </nav>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='pageA' element={<PageA />} />
            </Routes>
        </HashRouter>
    )
}
```
