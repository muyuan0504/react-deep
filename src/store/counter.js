/** 基于 makeAutoObservable API的 状态管理 */

import { makeAutoObservable } from 'mobx'

class CounterStore {
    count = 0

    constructor() {
        makeAutoObservable(this)
    }

    increment() {
        this.count++
    }

    decrement() {
        this.count--
    }
}

const counterStore = new CounterStore()

export default counterStore
