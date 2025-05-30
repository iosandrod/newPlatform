import store from '../index.js'
import generateID from '@/printTemplate/utils/generateID'
import eventBus from '@/printTemplate/utils/eventBus'
import decomposeComponent from '@/printTemplate/utils/decomposeComponent'
import { $ } from '@/printTemplate/utils/html-util.js'
import { commonAttr, commonStyle } from '@/printTemplate/components/config/componentList'
import { createGroupStyle } from '@/printTemplate/utils/style-util.js'

export default {
  state: {
    areaData: {
      // 选中区域包含的组件以及区域位移信息
      style: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      components: []
    },
    editor: null
  },
  mutations: {
    getEditor(state) {
      state.editor = $('#designer-page')
    },

    setAreaData(state, data) {
      state.areaData = data
    },

    compose({ componentData, areaData, editor }) {
      const components = []
      areaData.components.forEach((component) => {
        if (component.component !== 'RoyGroup') {
          components.push(component)
        } else {
          // 如果要组合的组件中，已经存在组合数据，则需要提前拆分
          const parentStyle = { ...component.style }
          const subComponents = component.propValue
          const editorRect = editor.getBoundingClientRect()

          subComponents.forEach((component) => {
            decomposeComponent(component, editorRect, parentStyle)
          })

          components.push(...component.propValue)
        }
      })

      const groupComponent = {
        id: generateID(),
        component: 'RoyGroup',
        label: '组合',
        icon: 'ri-shape-line',
        ...commonAttr,
        style: {
          ...commonStyle,
          ...areaData.style
        },
        propValue: components
      }

      createGroupStyle(groupComponent)

      store.commit('printTemplateModule/addComponent', {
        component: groupComponent
      })

      eventBus.$emit('hideArea')

      store.commit('printTemplateModule/batchDeleteComponent', areaData.components)
      store.commit('printTemplateModule/setCurComponent', {
        component: componentData[componentData.length - 1],
        index: componentData.length - 1
      })

      areaData.components = []
    },

    // 将已经放到 Group 组件数据删除，也就是在 componentData 中删除，因为它们已经从 componentData 挪到 Group 组件中了
    batchDeleteComponent({ componentData }, deleteData) {
      deleteData.forEach((component) => {
        for (let i = 0, len = componentData.length; i < len; i++) {
          if (component.id === componentData[i].id) {
            componentData.splice(i, 1)
            break
          }
        }
      })
    },

    decompose({ curComponent, editor }) {
      const parentStyle = { ...curComponent.style }
      const components = curComponent.propValue
      const editorRect = editor.getBoundingClientRect()

      store.commit('printTemplateModule/deleteComponent')
      components.forEach((component) => {
        decomposeComponent(component, editorRect, parentStyle)
        store.commit('printTemplateModule/addComponent', { component })
      })
    }
  }
}
