import React from 'react'
import { useNavigate } from 'react-router-dom'

function UseRoute() {
    /**
     * 使用 useNavigate 的优点是它允许你在函数式组件中直接进行路由导航，而不需要像类组件中使用的 history 对象或 props.history.push 方法
     */
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/about')
    }

    return (
        <React.StrictMode>
            <div>use-route</div>
            <div onClick={handleClick}>点击跳转</div>
        </React.StrictMode>
    )
}

export default UseRoute
