import React from 'react'

import { counterStore } from '@/store/index'

const PageSon = () => {
    return (
        <div>
            <h1>Page Son</h1>
            <div>
                <span>counterStore.count的值：</span>
                <span>{counterStore.count}</span>
            </div>
            <div>这个页面是son.jsx</div>
        </div>
    )
}

export default PageSon
