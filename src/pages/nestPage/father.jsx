import React from 'react'
import { useNavigate, Router } from 'react-router-dom'

const PageFather = () => {
    const navigate = useNavigate()
    const handlerClick = () => {
        navigate('son')
    }
    return (
        <div>
            <span>父级页面在这里</span>
            <button onClick={handlerClick}>跳转到子页面</button>
            <div></div>
        </div>
    )
}

export default PageFather
