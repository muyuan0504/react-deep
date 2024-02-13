import React, { useContext } from 'react'
import { LevelContext } from './util-context'

export default function ComponentB(props) {
    return (
        <>
            <h4>in Component B</h4>
            {/* 使用 Consumer 进行消费 */}
            <LevelContext.Consumer>
                {(level) => (
                    <p>
                        <span>level: {level}</span>
                    </p>
                )}
            </LevelContext.Consumer>
        </>
    )
}
