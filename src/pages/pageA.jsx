import React from 'react'
import styles from '../components/use-route/index.module.scss'

import UseAntd from '../components/use-antd/index'

const PageA = () => {
    return (
        <React.StrictMode>
            <div className={styles.showItem}>哈哈哈, 页面A</div>
            <UseAntd>
                <span>使用antd</span>
            </UseAntd>
        </React.StrictMode>
    )
}

export default PageA
