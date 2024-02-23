import { useState, useEffect } from 'react'

/**
 * 自定义 Hook 为了逻辑复用
 * 编写自定义hooks，要注意参数与返回值的一致性
 *
 * 自定义hook类似于将共同的存在相互依赖的的hooks数据封装到一个模块内，方便各个组件直接调用，可以理解为使用了hooks的封装函数
 *
 * @returns
 */

export const useCount = (init) => {
    const [count, setCount] = useState(init)

    useEffect(() => {
        console.log('每次count变化都处理下')
    }, [count])

    return [count, setCount]
}
