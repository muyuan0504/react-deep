import React from 'react'
import { useNavigate, Outlet, Link } from 'react-router-dom'

const PageFather = () => {
    const navigate = useNavigate()
    const handlerClick = () => {
        navigate('son')
    }

    const handlerClickA = () => {
        navigate('sonA')
    }
    return (
        <div>
            <nav>
                <Link to='son'>前往son</Link>
                <Link to='sonA'>前往sonA</Link>
            </nav>
            <span>父级页面在这里</span>
            <button onClick={handlerClick}>跳转到子路由son页面</button>
            <button onClick={handlerClickA}>跳转到子路由sonA页面</button>
            <div>
                {/* 使用 Outlet 组件来渲染嵌套的子路由, 在Vue中等同于<router-view /> */}
                <Outlet />
            </div>
        </div>
    )
}

export default PageFather
