
import toast from '@/printTemplate/utils/toast'

const swap = (arr, i, j) => {
  // Vue 3 中直接赋值即可保持响应式
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

export default {
  mutations: {
    upComponent(state) {
      const { componentData, curComponentIndex } = state
      // 上移一层
      if (curComponentIndex < componentData.length - 1) {
        swap(componentData, curComponentIndex, curComponentIndex + 1)
        state.curComponentIndex = curComponentIndex + 1
      } else {
        toast('已经到顶了')
      }
    },

    downComponent(state) {
      const { componentData, curComponentIndex } = state
      // 下移一层
      if (curComponentIndex > 0) {
        swap(componentData, curComponentIndex, curComponentIndex - 1)
        state.curComponentIndex = curComponentIndex - 1
      } else {
        toast('已经到底了')
      }
    },

    topComponent(state) {
      const { componentData, curComponentIndex, curComponent } = state
      // 置顶
      if (curComponentIndex < componentData.length - 1) {
        componentData.splice(curComponentIndex, 1)
        componentData.push(curComponent)
        state.curComponentIndex = componentData.length - 1
      } else {
        toast('已经到顶了')
      }
    },

    bottomComponent(state) {
      const { componentData, curComponentIndex, curComponent } = state
      // 置底
      if (curComponentIndex > 0) {
        componentData.splice(curComponentIndex, 1)
        componentData.unshift(curComponent)
        state.curComponentIndex = 0
      } else {
        toast('已经到底了')
      }
    },
  },
  actions: {},
}
