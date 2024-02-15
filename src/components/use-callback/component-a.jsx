import React from 'react'

export default function ComponentA({ onClick }) {
    console.log('componentA渲染了')

    return (
        <>
            <h3>component a: </h3>
            <button onClick={onClick}>count++ in children</button>
        </>
    )
}
