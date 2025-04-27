import { defineComponent, isReactive, watchEffect, withDirectives } from 'vue'
import {
  ClickOutside as vClickOutside,
  ElMessage,
  ElDialog,
  ElScrollbar,
  ElContainer,
  ElHeader,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElButton,
} from 'element-plus'
import {
  defineProps,
  defineEmits,
  ref,
  reactive,
  computed,
  provide,
  getCurrentInstance,
  nextTick,
  onMounted,
  watch,
  defineExpose,
} from 'vue'
import fieldMenu from '@/menu/fieldCom'
import CanvesPanel from '@ER/formEditor/components/Panels/Canves' //
import ConfigPanel from '@ER/formEditor/components/Panels/Config/configPanel'
import DeviceSwitch from '@ER/formEditor/components/DeviceSwitch.vue'
import Icon from '@ER/icon'
import hooks from '@ER/hooks'
import utils from '@ER/utils'
import _ from 'lodash'
import { validate } from 'uuid'
import { Form } from '@ER/form'
import fieldCom from '@/menu/fieldCom'
import defaultProps from './formEditor/defaultProps'
import { PageDesign } from './pageDesign'
export const getDefaultPageProps = () => {
  return {
    itemSpan: {
      type: Number,
      default: 6,
    }, //
    items: {
      default: () => [],
    },
    fieldsPanelWidth: {
      type: String,
      default: '220px',
    },
    fieldsPanelDefaultOpeneds: {
      type: Array,
      default: () => ['defaultField', 'field', 'container'],
    },
    delHandle: {
      type: Function,
      default: () => {},
    },
    copyHandle: {
      type: Function,
      default: () => {},
    },
    inlineMax: {
      type: Number,
      default: 4,
    },
    isShowClear: {
      type: Boolean,
      default: true,
    },
    isShowI18n: {
      type: Boolean,
      default: true,
    },
    dragMode: {
      type: String,
      default: 'icon',
      validator: (value: any) => ['full', 'icon'].includes(value),
    },
    checkFieldsForNewBadge: {
      type: Function,
      default: () => {},
    },
    formIns: {
      type: Object,
    },
    ...defaultProps,
    isDesign: {
      type: Boolean,
      default: true, //
    },
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
  }
}
export default defineComponent({
  directives: {
    vClickOutside,
  },
  components: {
    fieldMenu,
    fieldCom,
  },
  name: 'Everright-form-editor',
  props: getDefaultPageProps(), //
  emits: ['listener'],
  setup(props: any, { attrs, slots, emit, expose }) {
    const form = ref('')
    const previewPlatform = ref('pc')
    const previewLoading = ref(true)
    //
    let formIns: PageDesign = props.formIns as any
    if (formIns == null) {
      formIns = reactive(new PageDesign(props))
    } else {
    } //
    let layout = formIns.layout
    let _state = formIns.state
    let state = _state
    if (_state == null) {
      state = reactive({
        validate: null as any,
        store: [],
        selected: {},
        mode: 'edit',
        platform: 'pc',
        children: [],
        //@ts-ignore
        config: props.globalConfig,
        previewVisible: false,
        widthScaleLock: false,
        data: props.data,
        validateStates: [],
        fields: [],
        Namespace: 'formEditor',
        logic: {},
        othersFiles: {},
        fieldsLogicState: new Map(),
      })
      formIns.setState(state)
    } //

    //@ts-ignore
    state.validator = (target, fn) => {} //
    const { t, lang } = hooks.useI18n(props)
    formIns.lang = lang
    formIns.t = t
    const EReditorPreviewRef = ref<any>('')
    const isShow = computed({
      get: () => {
        return formIns.isShow
      },
      set: (val) => {
        formIns.isShow = val
      },
    })
    watch(
      () => props.data,
      (val) => {
        formIns.setData(val) //
      },
    )
    provide('pageDesign', formIns) //
    provide('formIns', formIns) //
    const isShowConfig = computed({
      get: () => {
        return formIns.isShowConfig
      },
      set: (val) => {
        formIns.isShowConfig = val
      },
    })
    let setSelection = formIns.setSelection.bind(formIns) //
    setSelection(state.config)
    const syncLayout = formIns.syncLayout.bind(formIns)
    const getLayoutDataByplatform = formIns.getLayoutDataByplatform.bind(
      formIns,
    )
    const switchPlatform = formIns.switchPlatform.bind(formIns)
    const canvesScrollRef = ref('')
    const fireEvent = (type, data) => {
      emit('listener', {
        type,
        data,
      })
    }
    const setData2 = formIns.setLayoutData.bind(formIns)
    const getData = formIns.getLayoutData.bind(formIns)
    const setData = setData2
    const handleOperation = (type, val?: any) => {
      switch (type) {
        case 1:
          break
        case 2:
          // state.store = []
          layout.pc = []
          layout.mobile = []
          state.fields.splice(0)
          state.store.splice(0)
          state.data = {}
          setSelection('root')
          break
        case 3:
          state.previewVisible = true
          previewLoading.value = true
          break
        case 4:
          fireEvent('save', getData())
          break
        case 7:
          previewLoading.value = true
          previewPlatform.value = val

          EReditorPreviewRef.value.switchPlatform(val)
          EReditorPreviewRef.value.setData(getData())
          nextTick(() => {
            nextTick(() => {
              previewLoading.value = false
            })
          })
          break
      }
    }
    watch(
      () => state.fields.map((e) => e.id), //
      (newV = [], old = []) => {
        const deleteFields = old.filter((item) => !newV.includes(item))
        const addFields = newV.filter((item) => !old.includes(item))
        for (const delField of deleteFields) {
          //
          formIns.delFormItem(delField)
        }
        for (const addField of addFields) {
          let field = state.fields.find((e) => e.id === addField)
          formIns.addFormItem(field) //
        }
      },
      {
        immediate: true,
      },
    )
    watch(
      () => state.selected,
      (newVal) => {
        fireEvent('changeParams', _.cloneDeep(newVal))
      },
      {
        deep: true,
        immediate: true,
      },
    )
    const onClickOutside = () => {}
    watch(
      () => {
        return state.store
      },
      (newValue) => {},
      {
        deep: true,
      },
    )
    const eve = formIns //
    provide('Everright', eve)
    let hide = () => {
      formIns.isDesign = false
    }
    //@ts-ignore
    formIns.hide = hide
    expose({ _instance: formIns }) //
    return () => {
      let nextForm = formIns.nextForm //
      let _fieldCom = null
      let _ConfigCom = null
      if (formIns.isDesign == true) {
        _fieldCom = <fieldMenu></fieldMenu>
        _ConfigCom = <ConfigPanel></ConfigPanel>
      } //
      let com = (
        <div class="h-full w-full">
          <button onClick={() => (formIns.isDesign = false)}>测试</button>
          {/* {dialogCom} */}
          {/* <ElContainer class="container" direction="vertical">
            <ElContainer>
              {isFoldFields.value && <fieldCom></fieldCom>}
              <ElContainer class="container">
                {isShow.value && withDirectives(<CanvesPanel data={state.store} />, [[vClickOutside, onClickOutside]])}
              </ElContainer>
              {isFoldConfig.value && <ConfigPanel />}
            </ElContainer>
          </ElContainer> */}
          <div class="flex h-full w-full flex-row">
            {_fieldCom}
            {isShow.value &&
              withDirectives(<CanvesPanel data={state.store} />, [
                [vClickOutside, onClickOutside],
              ])}
            {_ConfigCom}
          </div>
          {/* <Everright-form-editor></Everright-form-editor> */}
        </div>
      )
      //如果是设计模式就使用面包屑
      if (nextForm != null && formIns.isDesign == true) {
        com = <Everright-form-editor formIns={nextForm}></Everright-form-editor>
      } //
      return com //
    }
  },
})
