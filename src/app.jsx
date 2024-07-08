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
