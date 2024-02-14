import { useState, useEffect } from 'react'

/**
 * 自定义 Hook 为了逻辑复用
 * 编写自定义hooks，要注意参数与返回值的一致性
 * @returns
 */

export const useCount = (init) => {
    const [count, setCount] = useState(init)

    useEffect(() => {
        console.log('每次count变化都处理下')
    }, [count])

    return [count, setCount]
}
