import React from 'react'

import { NavLink, Outlet } from 'react-router-dom'

function PageIndex() {
    return (
        <div>
            <nav>
                <NavLink to='/pageA'>Navlink跳转pageA // </NavLink>
                <NavLink to='/'>Navlink跳转回根路径</NavLink>
                <NavLink to='/father'>Navlink跳转到father页面</NavLink>
                {/* 从顶级跳转到嵌套子路由，路径需要拼全 */}
                <NavLink to='/father/son'>Navlink跳转到son页面</NavLink>
            </nav>
            <Outlet />
        </div>
    )
}

export default PageIndex
