import React from 'react'
import { useNavigate, Link, NavLink } from 'react-router-dom'

import styles from './index.module.scss'
import textStyles from './text.module.scss'

function UseRoute() {
    /**
     * 使用 useNavigate 的优点是它允许你在函数式组件中直接进行路由导航，而不需要像类组件中使用的 history 对象或 props.history.push 方法
     */
    const navigate = useNavigate()

    // 注意：绑定事件的时候，会默认接收事件实例，所以当直接绑定函数时，参数的处理需要第一个事件参数；除非是 onClick={() => handleClick('father')} 这种绑定方式
    // const handleClick = (route) => {
    //     navigate(route || '/pageA')
    // }
    const handleClick = (_e, route) => {
        navigate(route || '/pageA')
    }

    const goToPageA = (route) => {
        navigate(route)
    }

    const locationToPageA = () => {
        window.location.hash = '#/pageA'
    }

    return (
        <React.StrictMode>
            <div className={`${styles.showItem} flex-box`}>
                <span>use-route: </span>
                <div className={styles.showUse}>这个是border</div>
            </div>
            <div onClick={handleClick}>点击跳转到PageA</div>
            {/* <div onClick={() => goToPageA('/pageA')}>点击跳转到页面A</div> */}
            <div>
                <Link to='pageA'>通过Link跳转到PageA</Link>
            </div>
            <div></div>
            <div className={textStyles.textColor} onClick={locationToPageA}>
                windonw.location跳转到PageA
            </div>
        </React.StrictMode>
    )
}

export default UseRoute
