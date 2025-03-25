import { defineComponent, } from "vue";
import defaultProps from "./defaultProps";
import { defineProps, ref, reactive, computed, provide, getCurrentInstance, watch, nextTick, onMounted } from 'vue'
import ConfigPanel from '@DESIGN/formEditor/components/Panels/Config/index.vue'
import hooks from '@DESIGN/hooks'
import utils from '@DESIGN/utils'
import _ from 'lodash'
import { globalConfig } from './componentsConfig'
export default defineComponent({
  name: 'Everright-form-config',
  props: {
    field: {
      type: [Object, String],
      required: true 
    },
    fields: {
      type: Array, 
      default: () => ([])
    },
    ...defaultProps
  },
  emits: ['listener'],
  setup(props: any, { emit, expose, slots }) {
    const layout = {
      pc: [],
      mobile: []
    }
    const state = reactive({
      store: [],
      selected: {},
      config: globalConfig,
      platform: 'pc',
      Namespace: 'formEditor',
      validateStates: [],
      data: {},
      mode: 'config',
      fields: props.fields,
      logic: {}
    })
    const element = ref('')
    const ns = hooks.useNamespace('Main', state.Namespace)
    const loading = ref(false)
    const setSelection = (node) => {
      let result: any = ''
      if (node === 'root') {
        result = state.config
      } else {
        if (node.type === 'inline') {
          result = node.columns[0]
        } else {
          result = node
        }
      }
      state.selected = result
    }
    const switchPlatform = (platform) => {
      state.platform = platform
    }
    const fireEvent = (type, data) => {
      emit('listener', {
        type,
        data
      })
    }
    provide('Everright', {
      state,
      emit,
      props,
      setSelection,
      switchPlatform,
      fireEvent
    })
    watch(() => props.field, (newVal) => {
      if (newVal !== 'root') {
        state.store[0] = newVal
        utils.addContext({node:newVal,parent: state.store})
      }
      setSelection(newVal)
    }, {
      immediate: true
    })
    expose({
      switchPlatform(platform) {
        state.platform = platform
      }
    })
    watch(() => state.selected, (newVal) => {
      fireEvent('changeParams', _.cloneDeep(newVal))
    }, {
      deep: true,
      immediate: true
    })
    return () => {
      return (
        <ConfigPanel mode="config"></ConfigPanel>
      )
    }
  }
})