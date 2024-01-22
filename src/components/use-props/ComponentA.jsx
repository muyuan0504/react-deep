import React from 'react'

const ComponentA = (props) => {
    console.log('component A get props: ', props)
    return (
        <>
            <h3>子组件ComponentA:</h3>
            {/** { } 内的是js执行代码，所以可以直接像下面这样写js箭头函数 */}
            <p onClick={() => console.log('component A 点击')}>
                <span>{props.toString()}</span>
                <span>{props.children}</span>
                {/** onClick 被e.stopPropagation() 时，p标签的点击事件就会阻止捕获触发，打印看到的事件触发顺序是 p 标签 -> button 标签 */}
                <button onClick={props.onClick}>点击触发父组件传递的事件 appCount++</button>
            </p>
        </>
    )
}

export default ComponentA

// export default function ComponentA(props) {
//     return <span>{props.toString()}</span>
// }
