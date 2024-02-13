import React, { useState } from 'react'
import UseJsx from './components/use-jsx'
import UseProps from './components/use-props'
import UseState from './components/use-state'
import UseReducer from './components/use-reducer'
import UseContext from './components/use-context'
import UseRef from './components/use-ref'

export default function MyApp() {
    const appData = { count: 0 }
    const [appCount, setappCount] = useState(0)
    const stateProp = { appCount, setappCount }

    return (
        /** React.StrictMode
         *  StrictMode 是一个用来突出显示应用程序中潜在问题的工具。与 Fragment 一样，StrictMode 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告
         */
        <React.StrictMode>
            <h3>app.vue:</h3>
            {/* React 组件必须以大写字母开头，而 HTML 标签则必须是小写字母 */}
            {/* <UseJsx /> */}
            {/* <UseProps appData={appData} stateProp={stateProp} /> */}
            {/* <UseState /> */}
            {/* <UseReducer /> */}
            {/* <UseContext /> */}
            <UseRef />
        </React.StrictMode>
    )
}
