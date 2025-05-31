

export default {
  mutations: {
    lock(state) {
      // Vue 3 中 reactive 对象可直接新增属性
      state.curComponent.isLock = true
    },

    unlock(state) {
      state.curComponent.isLock = false
    }
  }
}
