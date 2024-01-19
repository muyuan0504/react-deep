// import React from 'react'
import React, { useState } from 'react'

function UseComponent() {
    const count = 0
    const showEle = true
    const countList = [0, 1, 2, 3]

    /** 使用 Hook 在 jsx 更新视图,  [useCount, setCount] 不要求同名，但是尽量保持同名[state, setState]格式, [useCount, setuseCount]，方便可读性 */
    let [useCount, setCount] = useState(0)

    let useEle
    if (showEle) {
        useEle = <span>显示useEle</span>
    }

    /** 渲染列表，对于列表中的每一个元素，你都应该传递一个字符串或者数字给 key，用于在其兄弟节点中唯一标识该元素*/
    const listItems = countList.map((item) => <li key={item}>{item}</li>)

    const handleClick = (e) => {
        console.log('点击： ', e)
        setCount(useCount + 1)
    }

    return (
        /** jsx 表达式必须要有一个父元素
         * 可以是空标签 <> </>
         * 可以是 <React.Fragment> </React.Fragment>
         * 要在 jsx 中使用js，必须使用 { } 包裹需要执行的js代码，此时不需要再增加额外的符号，比如在属性中使用 src={ js变量 },而不是 src="{xxx}"
         */
        <React.Fragment>
            {/** JSX 比 HTML 更加严格，必须闭合标签，如 <br />；组件也不能返回多个 JSX 标签，你必须将它们包裹到一个共享的父级中 */}
            <h3>use-jsx</h3>
            <br></br>
            <p>
                <span>count: </span>
                {/* 显示数据：JSX 会让你把标签放到 JavaScript 中；而大括号会让你 “回到” JavaScript 中，以方便在代码中嵌入一些变量 */}
                <span>{count}</span>
            </p>
            <p>
                {/** React 没有特殊的语法来编写条件语句，因此你使用的就是普通的 JavaScript 代码 */}
                {useEle}
            </p>
            <div>
                {/** 列表渲染，提前构建渲染item，插入到标签内 */}
                <ul>{listItems}</ul>
            </div>
            <button onClick={handleClick}>useCount: {useCount}</button>
        </React.Fragment>
    )
}

export default UseComponent
