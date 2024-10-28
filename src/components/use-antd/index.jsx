import React from 'react'
import { Button, Flex, Divider } from 'antd'
import styles from './antd.module.scss'

console.error('---------- styles --------------', styles)

const UseAntd = (props) => {
    return (
        <div>
            <h4>{props.children}</h4>
            <p>使用button</p>
            <Button type='primary' variant='filled'>
                Primary Button
            </Button>
            <Divider />
            <Flex gap='small' wrap>
                <Button type='primary'>Primary Button</Button>
                <Button>Default Button</Button>
                <Button type='dashed'>Dashed Button</Button>
                <Button type='text'>Text Button</Button>
                <Button type='link'>Link Button</Button>
            </Flex>
        </div>
    )
}

export default UseAntd
