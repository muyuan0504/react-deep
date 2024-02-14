import React from 'react'

import { useCount } from './util-hook'

export default function ComponentA(props) {
    const [count, setCount] = useCount(99)

    const handleClick = () => {
        setCount(count + 1)
    }

    return (
        <>
            <h3>component a: </h3>
            <p>
                <span>count: {count}</span>
            </p>
            <button onClick={handleClick}>count++</button>
        </>
    )
}
