// import Vue from 'vue'

// export default {
//   mutations: {
//     lock({ curComponent }) {
//       Vue.set(curComponent, 'isLock', true)
//     },

//     unlock({ curComponent }) {
//       Vue.set(curComponent, 'isLock', false)
//     }
//   }
// }

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
