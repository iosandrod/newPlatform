<script>
import utils from '@ER/utils'
import hooks from '@ER/hooks'
import { ref, computed, reactive, watch, onMounted, inject, h } from 'vue'
import _ from 'lodash'
import Icon from '@ER/icon'
import PanelsConfigComponentsPropsPanel from '@ER/formEditor/components/Panels/Config/components/PropsPanel.vue'
import GlobalConfigPanel from './components/GlobalConfigPanel.vue'
export default {
  name: 'Config',
  inheritAttrs: false,
  customOptions: {}
} 
</script>
<script setup>
const props = defineProps({
  mode: {
    type: String,
    default: 'editor'
  }
})
const {
  state,
  isSelectAnyElement,
  isSelectField,
  isSelectRoot,
  setSelection,
  type,
  checkTypeBySelected,
  target,
  isSelectGrid,
  isSelectTabs,
  isSelectCollapse,
  isSelectTable
} = hooks.useTarget()
const ER = inject('Everright')
const {
  t
} = hooks.useI18n()
const activeName0 = ref('props')
const isShow = computed(() => {
  return !_.isEmpty(state.selected) && state.selected.type !== 'grid'
})
const ns = hooks.useNamespace('Config')
const form = ref()
const handleChangePanel = (panel) => {
  // activeName0.value = panel
}
const validator = (rule, value, callback) => {
  const newValue = value.trim()
  const fn = (type) => {
    switch (type) {
      case 0:
        callback(new Error(t('er.validateMsg.required')))
        break
      case 1:
        callback()
        break
      case 2:
        callback(new Error(t('er.validateMsg.idUnique')))
        break
    }
  }
  if (props.mode === 'editor') {
    state.validator(target.value, fn)
  } else {
    if (utils.isNull(newValue)) {
      fn(0)
    } else {
      fn(1)
    }
  }

  // if (newValue === '' || newValue === null || newValue === undefined) {
  //   callback(new Error('必填'))
  //   return false
  // } else {
  //   state.validator(newValue, (valid) => {
  //     if (valid) {
  //       callback()
  //     } else {
  //       callback(new Error('重复'))
  //     }
  //   })
  //
  // }
}
onMounted(() => {
  form.value.validate()
})
const rules = reactive({
  key: [
    {
      required: true,
      trigger: 'blur',
      validator
    }
  ]
})
const bars = computed(() => {
  let nodes = ['root']
  let result = []
  // if (!_.isEmpty(target.value)) {
  //   result = result.concat(target.value.context.parents)
  // }
  if (!isSelectRoot.value) {
    nodes = nodes.concat(target.value.context.parents.filter(e => !/^(inline|tr)$/.test(e.type)))
  }
  if (nodes.length > 4) {
    result.push(nodes[0])
    result.push({
      value: 'placeholder'
    })
    result.push(nodes[nodes.length - 2])
    result.push(nodes[nodes.length - 1])
  } else {
    result = nodes
  }
  return result.map(node => {
    const result = {
      // eslint-disable-next-line
      node: node,
      label: ''
    }
    if (node === 'root') {
      result.label = t('er.panels.config')
    } else if (node.value !== 'placeholder') {
      if (/^(col|collapseCol|tabsCol|td)$/.test(node.type)) {
        result.label = t(`er.layout.${node.type}`)
      } else {
        result.label = utils.fieldLabel(t, node)
      }
    }
    return result
  })
})
const handleBreadcrumbClick = (item) => {
  if (item !== 'root') {
    setSelection(item)
  } else {
    setSelection('root')
  }
}
watch(target, () => {
  if (isSelectRoot.value) {
    activeName0.value = 'root'
  } else {
    activeName0.value = 'props'
  }
}, {
  immediate: true
})
</script>
<template>
  <el-aside :class="[ns.b()]" :width="ER.props.configPanelWidth">
    <el-breadcrumb :class="[ns.e('breadcrumb')]" :separator-icon="() => (
      h('svg', {
        viewBox: '0 0 1024 1024',
        xmlns: 'http://www.w3.org/2000/svg'
      },
        h('path', {
          fill: 'currentColor',
          d: 'M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z'
        })
      )
    )" v-bind="utils.addTestId('configPanel:breadcrumb')">
      <el-breadcrumb-item
        @click="(index !== bars.length - 1 && item.node.value !== 'placeholder') && handleBreadcrumbClick(item.node)"
        v-for="(item, index) in bars" :key="index">
        {{ item.node.value === 'placeholder' ? '...' : item.label }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="target" :rules="rules" label-width="120px" label-position="top">
      <el-scrollbar>
        <div :class="[ns.e('wrap')]">
          <div v-if="isSelectAnyElement">
            <PanelsConfigComponentsPropsPanel :key="target.id" />
          </div>
          <div v-if="isSelectRoot">
            <GlobalConfigPanel></GlobalConfigPanel>
          </div>
        </div>
      </el-scrollbar>
    </el-form>
  </el-aside>
</template>
