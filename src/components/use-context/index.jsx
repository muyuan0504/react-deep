import React, { useContext } from 'react'

import { LevelContext } from './util-context'
import ComponentA from './component-a'

/** useContext: 用于深层传递参数，避免冗长的props传递方式
 * 可以将 context 的创建单独放到一个js文件中，如 src\components\use-context\util-context.js
 *
 * 常见使用场景：
 * 1. 主题
 * 2. 当前账户
 * 3. 路由
 * 4. 状态管理
 */

const UseContext = (props) => {
    /** useContext 告诉 React 当前组件想要读取 LevelContext */
    const level = useContext(LevelContext)
    return (
        <>
            <h3>use context: </h3>
            {/* 使用 Provider 提供context: 用 context provider 包裹起来，这里的value可以使用useState变量，所以 context 经常和 state 结合使用 */}
            <LevelContext.Provider value={level + 1}>
                <ComponentA />
            </LevelContext.Provider>
        </>
    )
}

export default UseContext
