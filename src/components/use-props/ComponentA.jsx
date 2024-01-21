import React from 'react'

const ComponentA = (props) => {
    console.log('component A get props: ', props)
    return (
        <p>
            <span>{props.toString()}</span>
            <span>{props.children}</span>
        </p>
    )
}

export default ComponentA

// export default function ComponentA(props) {
//     return <span>{props.toString()}</span>
// }
