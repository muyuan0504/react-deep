import React from 'react'
import { HashRouter, useRoutes, Router, NavLink } from 'react-router-dom'

import routes from './route/index'

/** 对象式组件配置 */

// 使用 `useRoutes` Hooks 来生成路由组件
const AppRoutes = () => {
    const element = useRoutes(routes)
    return element
}

export default function MyApp() {
    return (
        <HashRouter>
            <AppRoutes />
        </HashRouter>
    )
}

/** 组件式路由配置 */

// import Home from '@/pages/home'
// import PageA from '@/pages/pageA'
// import PageFather from '@/pages/nestPage/father'
// import PageSon from '@/pages/nestPage/son'
// import PageSonA from '@/pages/nestPage/sonA'
// import MyApp from './app';
// export default function MyApp() {
//     const dynamicClass = ({ isActive, isPending, isTransitioning }) => {
//         console.error('---------- 激活状态 --------------', isPending, isActive, isTransitioning)
//         return isActive || isPending ? 'isActive' : 'notActive'
//     }
//     return (
//         /** 基于组件化的Route配置，使用HashRouter */
//         <HashRouter>
//             <nav>
//                 {/* 新版本activeClassName已经被移除，需要手动定义 */}
//                 {/* <NavLink to='pageA' activeClassName={styles.navActive}></NavLink> */}
//                 {/* <NavLink to='pageA' className={({ isActive }) => (isActive ? styles.navActive : '')}> */}
//                 <NavLink to='/pageA' className={dynamicClass}>
//                     Navlink跳转pageA
//                 </NavLink>
//                 <NavLink to='/'>Navlink跳转回根路径</NavLink>
//                 <NavLink to='/father'>Navlink跳转到father页面</NavLink>
//                 {/* 从顶级跳转到嵌套子路由，路径需要拼全 */}
//                 <NavLink to='/father/son'>Navlink跳转到son页面</NavLink>
//             </nav>
//             <Routes>
//                 <Route path='/' element={<Home />} />
//                 <Route path='/pageA' element={<PageA />} />
//                 <Route path='/father' element={<PageFather />}>
//                     {/* 嵌套路由的path，不需要带上/前缀 */}
//                     <Route path='son' element={<PageSon />} />
//                     <Route path='sonA' element={<PageSonA />} />
//                 </Route>
//             </Routes>
//         </HashRouter>
//     )
// }
