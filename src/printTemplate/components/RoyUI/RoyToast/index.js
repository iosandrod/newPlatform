// import Vue from 'vue'
// import toast from './toast.vue'

// let ToastConstructor = Vue.extend(toast)
// let instance
// let instances = []
// let seed = 1

// const Toast = function (options = {}) {
//   return new Promise((resolve) => {
//     let userOnClose = options.onClose
//     let id = 'roy_toast_' + seed++
//     options.onClose = function () {
//       Toast.close(id, userOnClose)
//       resolve()
//     }
//     instance = new ToastConstructor({
//       data: options
//     })
//     instance.id = id
//     instance.$mount()
//     document.body.appendChild(instance.$el)
//     let verticalOffset = options.offset || 0
//     instances.forEach((item) => {
//       verticalOffset += item.$el.offsetHeight
//     })
//     instance.verticalOffset = verticalOffset
//     instance.visible = true
//     instances.push(instance)
//   })
// }

// Toast.close = function (seed, userOnClose) {
//   let len = instances.length
//   let index = -1
//   let removedHeight
//   for (let i = 0; i < len; i++) {
//     if (seed === instances[i].id) {
//       removedHeight = instances[i].$el.offsetHeight
//       index = i
//       if (typeof userOnClose === 'function') {
//         userOnClose(instances[i])
//       }
//       instances.splice(i, 1)
//       break
//     }
//   }
//   if (len <= 1 || index === -1 || index > instances.length - 1) {
//     return
//   }
//   for (let i = index; i < len - 1; i++) {
//     let dom = instances[i].$el
//     dom.style['top'] = parseInt(dom.style['top'], 10) - removedHeight + 'px'
//   }
// }

// export default Toast

import { createApp, h } from 'vue'
import ToastComponent from './toast.vue'

let instances = []
let seed = 1

const Toast = function (options = {}) {
  return new Promise((resolve) => {
    const id = 'roy_toast_' + seed++
    const userOnClose = options.onClose

    const container = document.createElement('div')
    document.body.appendChild(container)

    let verticalOffset = options.offset || 0
    instances.forEach((item) => {
      verticalOffset += item.el.offsetHeight
    })

    const app = createApp({
      data() {
        return {
          visible: false,
          verticalOffset,
          id
        }
      },
      render() {
        return h(ToastComponent, {
          ...options,
          visible: this.visible,
          verticalOffset: this.verticalOffset,
          onClose: () => {
            Toast.close(id, userOnClose)
            resolve()
            app.unmount()
            container.remove()
          }
        })
      },
      mounted() {
        this.visible = true
      }
    })

    const vm = app.mount(container)

    instances.push({
      id,
      el: container,
      vm
    })
  })
}

Toast.close = function (id, userOnClose) {
  const index = instances.findIndex(inst => inst.id === id)
  if (index === -1) return

  const removedHeight = instances[index].el.offsetHeight

  if (typeof userOnClose === 'function') {
    userOnClose(instances[index].vm)
  }

  instances.splice(index, 1)

  for (let i = index; i < instances.length; i++) {
    const dom = instances[i].el.firstChild
    if (dom && dom.style) {
      const top = parseInt(dom.style.top, 10)
      dom.style.top = `${top - removedHeight}px`
    }
  }
}

export default Toast
