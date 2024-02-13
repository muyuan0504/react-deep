import React, { useContext } from 'react'
import { LevelContext } from './util-context'

import ComponentB from './component-b'

export default function ComponentA(props) {
    const level = useContext(LevelContext)
    return (
        <>
            <h4>is Component A</h4>
            {/* 使用 Consumer 进行消费 */}
            <LevelContext.Consumer>
                {(level) => (
                    <p>
                        <span>is level: {level}</span>
                    </p>
                )}
            </LevelContext.Consumer>
            <LevelContext.Provider value={level + 1}>
                <ComponentB />
            </LevelContext.Provider>
        </>
    )
}
