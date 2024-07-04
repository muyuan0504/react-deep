import React from 'react'

import styled from 'styled-components'
console.error('---------- styled --------------', styled)

/** styled.header -> 会生成一个带有唯一id标识的header标签 <header class="sc-beqWNU jbPySM"><  */
const DivHeader = styled.header`
    background-color: orange;
    color: white;
    padding: 20px;
    .child {
        color: #333;
    }
`

const DivChild = styled.div`
    color: ${(props) => props.color || '#999'};
    margin-top: 12px;
    font-weight: bold;
`

const DivBlack = styled.div`
    background-color: black;
    color: white;
`

const DidExtend = styled(DivBlack)`
    color: yellowgreen;
`

export default function CssInJs() {
    return (
        <div>
            <h5>css in js</h5>
            <DivHeader>
                <div>
                    <span>样式文字</span>
                    <span className='child'>子元素</span>
                    <DivBlack>黑色背景的文字</DivBlack>
                    <DidExtend>黑色背景的文字2</DidExtend>
                </div>
                <DivChild color='blue'>子元素1号</DivChild>
                <DivChild color='pink'>子元素2号</DivChild>
            </DivHeader>
        </div>
    )
}
