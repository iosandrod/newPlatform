// import Vue from 'vue'
// // 用于监听、触发事件
// export default new Vue()

// src/printTemplate/utils/event-bus.js

import mitt from 'mitt'

// 创建并导出一个全局事件总线实例
const emitter = mitt()
emitter.$emit = emitter.emit.bind(emitter) //
export default emitter
 