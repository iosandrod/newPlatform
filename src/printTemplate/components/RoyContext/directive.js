// /* eslint-disable no-param-reassign */
// export default {
//   // 之所以用 inserted 而不是 bind，是需要确保 contentmenu mounted 后才进行 addRef 操作
//   inserted(el, binding, vnode) {
//     const node = vnode.context.$refs[binding.arg] || vnode.context.$refs[binding.value]
//     const contextmenu = Object.prototype.toString.call(node) === '[object Array]' ? node[0] : node
//     contextmenu.addRef({ el, vnode })
//     contextmenu.$contextmenuId = el.id || contextmenu._uid // eslint-disable-line no-underscore-dangle
//   }
// }

// src/printTemplate/components/RoyContext/directive.js

// src/printTemplate/components/RoyContext/directive.js

export default {
  // Vue 3 中不再使用 inserted，而是 mounted
  mounted(el, binding, vnode) {
    // 在 Vue 3 中，binding.instance 就是当前组件的代理实例（相当于 Vue 2 的 vnode.context）
    const instance = binding.instance
    if (!instance) {
      console.warn('[v-contextmenu] 无法获取到组件实例（binding.instance 为空）')
      return
    }

    // binding.arg 对应指令使用时的参数（如 v-contextmenu:myMenu 的 "myMenu"）
    // binding.value 对应指令绑定的值（如 v-contextmenu="myMenuRef"）
    let contextmenu = instance.$refs[binding.arg] || instance.$refs[binding.value]

    // 有时 $refs 可能是一个数组
    if (Array.isArray(contextmenu)) {
      contextmenu = contextmenu[0]
    }

    if (!contextmenu || typeof contextmenu.addRef !== 'function') {
      console.warn(
        `[v-contextmenu] 未找到对应的 Context 组件实例，或实例中缺少 addRef 方法。\
请检查 v-contextmenu 参数或值是否正确，且目标组件是否实现了 addRef()。`
      )
      return
    }
    // 将当前 DOM 节点和 vnode 关联到 Context 组件
    // vnode 在 Vue 3 中不再有 component.proxy，因此这里直接传 el 和 instance 就行
    contextmenu.addRef({ el, vnode: null })

    // 为 Context 组件设置一个唯一 ID，供 hideAll 时区分
    // 如果 el 本身有 id，就使用它，否则使用组件实例 _uid
    contextmenu.$contextmenuId = el.id || contextmenu._uid
  }, 

  beforeUnmount(el, binding) {
    // 如果需要在指令解绑时做清理，可以在这里实现。
    // 例如：移除对 Context 组件的引用、取消事件监听等
    const instance = binding.instance
    if (!instance) return

    let contextmenu = instance.$refs[binding.arg] || instance.$refs[binding.value]
    if (Array.isArray(contextmenu)) {
      contextmenu = contextmenu[0]
    }
    if (!contextmenu || typeof contextmenu.removeRef !== 'function') {
      return
    }
    // 假设 Context 组件实现了 removeRef 方法来清理引用
    contextmenu.removeRef({ el })
  }
}
