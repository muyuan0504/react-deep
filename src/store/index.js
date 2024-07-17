/** mobx 状态管理
 *
 * 核心API [observable、 computed、 reactions、 actions]
 *
 * observable(value)：创建可观察的数据结构，value可以是JS基本数据类型、引用类型、普通对象、类实例、数组和映射
 * - 要想使用 @observable 装饰器，首先要确保 在你的编译器(babel 或者 typescript)中 装饰器是启用的
 *
 */

import counterModule from './counter'

export { default as todoStore } from './todo'

export const counterStore = counterModule
