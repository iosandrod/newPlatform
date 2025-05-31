// import Vue from 'vue'
// import { on } from './dom'

// const nodeList = []
// const ctx = '@@clickoutsideContext'

// let startClick
// let seed = 0

// !Vue.prototype.$isServer && on(document, 'mousedown', (e) => (startClick = e))

// !Vue.prototype.$isServer &&
//   on(document, 'mouseup', (e) => {
//     nodeList.forEach((node) => node[ctx].documentHandler(e, startClick))
//   })

// function createDocumentHandler(el, binding, vnode) {
//   return function (mouseup = {}, mousedown = {}) {
//     if (
//       !vnode ||
//       !vnode.context ||
//       !mouseup.target ||
//       !mousedown.target ||
//       el.contains(mouseup.target) ||
//       el.contains(mousedown.target) ||
//       el === mouseup.target ||
//       (vnode.context.popperElm &&
//         (vnode.context.popperElm.contains(mouseup.target) ||
//           vnode.context.popperElm.contains(mousedown.target)))
//     ) {
//       return
//     }

//     if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
//       vnode.context[el[ctx].methodName]()
//     } else {
//       el[ctx].bindingFn && el[ctx].bindingFn()
//     }
//   }
// }

// /**
//  * v-clickoutside
//  * @desc 点击元素外面才会触发的事件
//  * @example
//  * ```vue
//  * <div v-element-clickoutside="handleClose">
//  * ```
//  */
// export default {
//   bind(el, binding, vnode) {
//     nodeList.push(el)
//     const id = seed++
//     el[ctx] = {
//       id,
//       documentHandler: createDocumentHandler(el, binding, vnode),
//       methodName: binding.expression,
//       bindingFn: binding.value
//     }
//   },

//   update(el, binding, vnode) {
//     el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
//     el[ctx].methodName = binding.expression
//     el[ctx].bindingFn = binding.value
//   },

//   unbind(el) {
//     let len = nodeList.length

//     for (let i = 0; i < len; i++) {
//       if (nodeList[i][ctx].id === el[ctx].id) {
//         nodeList.splice(i, 1)
//         break
//       }
//     }
//     delete el[ctx]
//   }
// }

import { on } from './dom' // 假设你自己封装了事件监听工具

const nodeList = []
const ctx = '@@clickoutsideContext'
let startClick
let seed = 0

// 全局监听鼠标按下/抬起
if (typeof window !== 'undefined') {
  on(document, 'mousedown', (e) => {
    startClick = e
  })

  on(document, 'mouseup', (e) => {
    nodeList.forEach((node) => {
      node[ctx].documentHandler(e, startClick)
    })
  })
}

function createDocumentHandler(el, binding) {
  return function (mouseup = {}, mousedown = {}) {
    const instance = binding.instance
    const popper = instance?.popperElm

    if (
      !instance ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (popper && (popper.contains(mouseup.target) || popper.contains(mousedown.target)))
    ) {
      return
    }

    const method = el[ctx].methodName
    if (binding.value && typeof binding.value === 'function') {
      binding.value()
    } else if (method && typeof instance[method] === 'function') {
      instance[method]()
    }
  }
}

export default {
  beforeMount(el, binding) {
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding),
      methodName: binding.expression,
      bindingFn: binding.value
    }
    nodeList.push(el)
  },

  updated(el, binding) {
    el[ctx].documentHandler = createDocumentHandler(el, binding)
    el[ctx].methodName = binding.expression
    el[ctx].bindingFn = binding.value
  },

  unmounted(el) {
    const index = nodeList.findIndex((item) => item[ctx]?.id === el[ctx]?.id)
    if (index !== -1) {
      nodeList.splice(index, 1)
    }
    delete el[ctx]
  }
}
