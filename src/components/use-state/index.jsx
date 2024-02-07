import React, { useState } from 'react'

// Hooks ——以 use 开头的函数——只能在组件或自定义 Hook 的最顶层调用。 你不能在条件语句、循环语句或其他嵌套函数内调用 Hook

/**
 * 为什么需要state:
 * 1. 局部变量无法在多次渲染中持久保存; 当 React 再次渲染这个组件时，它会从头开始渲染——不会考虑之前对局部变量的任何更改
 * 2. 更改局部变量不会触发渲染。 React 没有意识到它需要使用新数据再次渲染组件
 *
 * 要使用新数据更新组件，需要做两件事:
 * 1. 保留 渲染之间的数据
 * 2. 触发 React 使用新数据渲染组件（重新渲染）
 *
 * state: 组件的记忆(官方定义)，如同一张快照
 * API： useState Hook，提供了【要使用新数据更新组件，需要做两件事】这两个功能：
 * 1. State 变量 用于保存渲染间的数据；
 * 2. State setter 函数 更新变量并触发 React 再次渲染组件
 *
 * setter函数的参数可以是：
 * 1. 一个更新函数（例如：n => n + 1）会被添加到队列中：更新函数必须是 纯函数 并且只 返回 结果
 * 2. 任何其他的值（例如：数字 5）会导致“替换为 5”被添加到队列中，已经在队列中的内容会被忽略
 * 事件处理函数执行完成后，React 将触发重新渲染。在重新渲染期间，React 将处理队列。更新函数会在渲染期间执行
 *
 * const [ a, setA ] = useState(xxx); -> 惯例是将这对返回值命名为 const [thing, setThing]。可以将其命名为任何名称，但遵照约定俗成能使跨项目合作更易理解
 * useState 的唯一参数是 state 变量的初始值
 *
 * 看看 const [index, setIndex] = useState(0); 背后的过程：
 * 1. 组件进行第一次渲染：因为你将 0 作为 index 的初始值传递给 useState，它将返回 [0, setIndex]。 React 记住 0 是最新的 state 值
 * 2. 更新了 state：当用户点击按钮时，它会调用 setIndex(index + 1)。 index 是 0，所以它是 setIndex(1)。这告诉 React 现在记住 index 是 1 并触发下一次渲染
 * 3. 组件进行第二次渲染：React 仍然看到 useState(0)，但是因为 React 记住 了你将 index 设置为了 1，它将返回 [1, setIndex]
 *
 * React 如何知道返回哪个 state ？
 * 在 React 内部，为每个组件保存了一个数组，其中每一项都是一个 state 对。
 * 它维护当前 state 对的索引值，在渲染之前将其设置为 “0”。
 * 每次调用 useState 时，React 都会为你提供一个 state 对并增加索引值
 *
 *
 * 当我们使用state时，遵循以下原则：
 * 1. 将 React 中所有的 state 都视为不可直接修改的
 * 2. 当你在 state 中存放对象时，直接修改对象并不会触发重渲染，并会改变前一次渲染“快照”中 state 的值。
 * 3. 不要直接修改一个对象，而要为它创建一个 新 版本，并通过把 state 设置成这个新版本来触发重新渲染。
 * 4. 你可以使用这样的 {...obj, something: 'newValue'} 对象展开语法来创建对象的拷贝。
 * 5. 对象的展开语法是浅层的：它的复制深度只有一层
 * 6. 想要更新嵌套对象，你需要从你更新的位置开始自底向上为每一层都创建新的拷贝
 * 7. 想要减少重复的拷贝代码，可以使用 Immer -> Immer 的底层实现基于对象代理Proxy
 *
 * 为什么在 React 中不推荐直接修改 state
 * 1. 调试：如果你使用 console.log 并且不直接修改 state，你之前日志中的 state 的值就不会被新的 state 变化所影响。这样你就可以清楚地看到两次渲染之间 state 的值发生了什么变化
 * 2. 优化：React 常见的 优化策略 依赖于如果之前的 props 或者 state 的值和下一次相同就跳过渲染。如果你从未直接修改 state ，那么你就可以很快看到 state 是否发生了变化。
 *          如果 prevObj === obj，那么你就可以肯定这个对象内部并没有发生改变
 * 3. 新功能：我们正在构建的 React 的新功能依赖于 state 被 像快照一样看待 的理念。如果你直接修改 state 的历史版本，可能会影响你使用这些新功能
 * 4. 需求变更：有些应用功能在不出现任何修改的情况下会更容易实现，比如实现撤销/恢复、展示修改历史，或是允许用户把表单重置成某个之前的值。
 * 5. 更简单的实现：React 并不依赖于 mutation ，所以你不需要对对象进行任何特殊操作。
 *                 它不需要像很多“响应式”的解决方案一样去劫持对象的属性、总是用代理把对象包裹起来，或者在初始化时做其他工作。
 *                 这也是为什么 React 允许你把任何对象存放在 state 中——不管对象有多大——而不会造成有任何额外的性能或正确性问题的原因。
 */

const UseState = (props) => {
    /** useState 使用基本数据类型
     * 关于 setCount(count++)和setCount(count+1)的区别
     * 当初始化是 const [count, setCount] = useState(0), setCount(count++)会报错，因为count是read_only类型
     * 当初始化是 let [count, setCount] = useState(0)：
     *   使用setCount(count++)，由于  React 会获取你上一个更新函数的返回值，
     *       相当于内部返回count++; 而++的特性我们知道，执行后才+1，所以React获取的是上一次的结果，也就导致要获取实际想要的效果需要点击两次
     *   而使用setCount(count+1)就不需要面对这种情况了。
     */
    // let [count, setCount] = useState(0)
    const [count, setCount] = useState(0)

    const calcCount = count + 1

    /** useState 使用引用类型
     * - state 中可以保存任意类型的 JavaScript 值，包括对象, 同时，把所有存放在 state 中的 JavaScript 对象都视为只读的
     * 但是，你不应该直接修改存放在 React state 中的对象。
     * 相反，当你想要更新一个对象时，你需要创建一个新的对象（或者将其拷贝一份），然后将 state 更新为此对象
     *
     * 对于数组的处理：
     * 同对象一样，你需要将 React state 中的数组视为只读的。
     * 这意味着你不应该使用类似于 arr[0] = 'bird' 这样的方式来重新分配数组中的元素，也不应该使用会直接修改原始数组的方法，例如 push() 和 pop()
     * 相反，每次要更新一个数组时，你需要把一个新的数组传入 state 的 setting 方法中
     * 数组的删除：从数组中删除一个元素最简单的方法就是将它过滤出去。换句话说，你需要生成一个不包含该元素的新数组
     * 数组的转换：map()
     * 更新数组内部的对象： 当你更新一个嵌套的 state 时，你需要从想要更新的地方创建拷贝值，一直这样，直到顶层
     *
     */
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const mouseMove = (e) => {
        // console.log(e)
        /** 不使用state的设置函数，React不知道对象已变更，以下操作不会触发组件更新 */
        position.x = e.clientX
        position.y = e.clientY

        /** 通过使用 setPosition，你在告诉 React
         * 1. 使用这个新的对象替换 position 的值
         * 2. 然后再次渲染这个组件
         *
         * 有趣的是，当搭配position.x = e.clientX, 在setPosition设置...position, y： xx，也会同步更新
         */
        setPosition({
            ...position,
            // x: e.clientX,
            y: e.clientY,
        })
    }

    /**
     * 批量处理
     * setState 的更新会被批量处理，所以batchSet执行了三次setCount, 但最终只会更新一次
     * React 会等到事件处理函数中的 所有 代码都运行完毕再处理你的 state 更新
     *
     * 如果想在下次渲染前多次更新同一个 state, 可以使用更新函数
     * setCount(count + 1) -> setCount(count => count + 1)
     * 当你将它传递给一个 state 设置函数时:
     * 1. React 会将此函数加入队列，以便在事件处理函数中的所有其他代码运行后进行处理;
     * 2. 在下一次渲染期间，React 会遍历队列并给你更新之后的最终 state
     */
    const batchSet = () => {
        /** 批量处理 */
        // setCount(count + 1)
        // setCount(count + 1)
        // setCount(count + 1)

        /** 更新函数 在下次渲染期间调用 useState 时，React 会遍历队列并执行 */
        // setCount((count) => count + 1)
        // setCount((count) => count + 1)
        // setCount((count) => count + 1)

        /** 更新函数与正常更新同时存在，批量处理和更新函数互相作用 */
        setCount(count + 5) // number 为 0，所以 setNumber(0 + 5)。React 将 “替换为 5” 添加到其队列中
        setCount((count) => count + 1) //  React 将 该函数 添加到其队列中
        // setCount(count + 5) // 如果这行注释放开，那么React 将 “替换为 5” 添加到其队列中, 后续执行，count会被重置为5
        setCount((count) => count + 1) // React 将 该函数 添加到其队列中，如果 setCount(count + 5)  注释放开，此时函数执行的count参数最终是5，返回5 + 1
    }
    return (
        <div>
            <h3>UseState:</h3>
            <h5>基本数据类型：</h5>
            <p>
                <span>count:</span>
                <span>{count}</span>
                {/* <button onClick={() => setCount(count++)}>count++</button> */}
                <button onClick={() => setCount(count + 1)}>count++</button>
                <button onClick={batchSet}>batchSet</button>
            </p>
            <p>
                <span>calcCount: {calcCount}</span>
            </p>
            <h5>引用数据类型：</h5>
            <div
                onPointerMove={mouseMove}
                style={{
                    position: 'relative',
                    width: '300px',
                    height: '200px',
                    border: '1px solid',
                }}>
                <div
                    style={{
                        position: 'absolute',
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        left: -10,
                        top: -10,
                        width: 20,
                        height: 20,
                    }}
                />
            </div>
        </div>
    )
}

export default UseState
