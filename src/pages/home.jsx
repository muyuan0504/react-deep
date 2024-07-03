import React, { useState } from 'react'

import UseJsx from '@/components/use-jsx'
import UseProps from '@/components/use-props'
import UseState from '@/components/use-state'
import UseReducer from '@/components/use-reducer'
import UseContext from '@/components/use-context'
import UseRef from '@/components/use-ref'
import UseEffect from '@/components/use-effect'
import UseMemo from '@/components/use-memo'
import UseCallback from '@/components/use-callback'
import DefineHook from '@/components/define-hook'
import UseRoute from '@/components/use-route'
import UseRouteComA from '@/components/use-route/UseRouteComA'

const PageHome = () => {
    const appData = { count: 0 }
    const [appCount, setappCount] = useState(0)
    const stateProp = { appCount, setappCount }

    return (
        <React.StrictMode>
            <h3>HOME: </h3>
            {/* React 组件必须以大写字母开头，而 HTML 标签则必须是小写字母 */}
            {/* <UseJsx /> */}
            {/* <UseProps appData={appData} stateProp={stateProp} /> */}
            {/* <UseState /> */}
            {/* <UseReducer /> */}
            {/* <UseContext /> */}
            {/* <UseRef /> */}
            {/* <UseEffect /> */}
            {/* <UseMemo /> */}
            <UseRoute />

            {/* <UseCallback /> */}
            {/* <DefineHook /> */}
        </React.StrictMode>
    )
}

export default PageHome
