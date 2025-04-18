// import { defineComponent } from 'vue'
import { Select as _Select } from './selectClass'
import {
  defineComponent,
  h,
  Teleport,
  PropType,
  ref,
  Ref,
  inject,
  computed,
  provide,
  onUnmounted,
  reactive,
  nextTick,
  watch,
  onMounted,
} from 'vue'
import XEUtils from 'xe-utils'
import {
  getConfig,
  getIcon,
  getI18n,
  globalEvents,
  GLOBAL_EVENT_KEYS,
  createEvent,
  useSize,
  renderEmptyElement,
} from 'vxe-pc-ui' //
import {
  getEventTargetNode,
  getAbsolutePos,
} from 'vxe-pc-ui/packages/ui/src/dom'
import {
  getLastZIndex,
  nextZIndex,
  getFuncText,
} from 'vxe-pc-ui/packages/ui/src/utils'
import { getSlotVNs } from 'vxe-pc-ui/packages/ui/src/vn'
import VxeInputComponent from 'vxe-pc-ui/packages/input/index'

import type {
  VxeSelectPropTypes,
  VxeSelectConstructor,
  SelectInternalData,
  SelectReactData,
  VxeSelectDefines,
  ValueOf,
  VxeSelectEmits,
  VxeComponentSlotType,
  VxeInputConstructor,
  SelectMethods,
  SelectPrivateRef,
  VxeSelectMethods,
  VxeOptgroupProps,
  VxeOptionProps,
  VxeDrawerConstructor,
  VxeDrawerMethods,
  VxeFormDefines,
  VxeFormConstructor,
  VxeFormPrivateMethods,
  VxeModalConstructor,
  VxeModalMethods,
  VxeInputEvents,
} from 'vxe-pc-ui/types'
import type {
  VxeTableConstructor,
  VxeTablePrivateMethods,
} from 'vxe-pc-ui/types/components/table'
import Select from './select'
export default defineComponent({
  name: 'SelectCom',
  props: {
    modelValue: [String, Number, Boolean, Array] as PropType<
      VxeSelectPropTypes.ModelValue
    >,
    defaultConfig: Object as PropType<VxeSelectPropTypes.DefaultConfig>,
    clearable: Boolean as PropType<VxeSelectPropTypes.Clearable>,
    placeholder: String as PropType<VxeSelectPropTypes.Placeholder>,
    readonly: {
      type: Boolean as PropType<VxeSelectPropTypes.Readonly>,
      default: null,
    },
    loading: Boolean as PropType<VxeSelectPropTypes.Loading>,
    disabled: {
      type: Boolean as PropType<VxeSelectPropTypes.Disabled>,
      default: null,
    },
    multiple: Boolean as PropType<VxeSelectPropTypes.Multiple>,
    multiCharOverflow: {
      type: [Number, String] as PropType<VxeSelectPropTypes.MultiCharOverflow>,
      default: () => getConfig().select.multiCharOverflow,
    },
    prefixIcon: String as PropType<VxeSelectPropTypes.PrefixIcon>,
    allowCreate: {
      type: Boolean as PropType<VxeSelectPropTypes.AllowCreate>,
      default: () => getConfig().select.allowCreate,
    },
    placement: String as PropType<VxeSelectPropTypes.Placement>,
    options: Array as PropType<VxeSelectPropTypes.Options>,
    optionProps: Object as PropType<VxeSelectPropTypes.OptionProps>,
    optionGroups: Array as PropType<VxeSelectPropTypes.OptionGroups>,
    optionGroupProps: Object as PropType<VxeSelectPropTypes.OptionGroupProps>,
    optionConfig: Object as PropType<VxeSelectPropTypes.OptionConfig>,
    className: [String, Function] as PropType<VxeSelectPropTypes.ClassName>,
    popupClassName: [String, Function] as PropType<
      VxeSelectPropTypes.PopupClassName
    >,
    max: {
      type: [String, Number] as PropType<VxeSelectPropTypes.Max>,
      default: null,
    },
    size: {
      type: String as PropType<VxeSelectPropTypes.Size>,
      default: () => getConfig().select.size || getConfig().size,
    },
    filterable: Boolean as PropType<VxeSelectPropTypes.Filterable>,
    filterMethod: Function as PropType<VxeSelectPropTypes.FilterMethod>,
    remote: Boolean as PropType<VxeSelectPropTypes.Remote>,
    // 已废弃，被 remote-config.queryMethod 替换
    remoteMethod: Function as PropType<VxeSelectPropTypes.RemoteMethod>,
    remoteConfig: Object as PropType<VxeSelectPropTypes.RemoteConfig>,
    emptyText: String as PropType<VxeSelectPropTypes.EmptyText>,
    transfer: {
      type: Boolean as PropType<VxeSelectPropTypes.Transfer>,
      default: null,
    },
    virtualYConfig: Object as PropType<VxeSelectPropTypes.VirtualYConfig>,
    scrollY: Object as PropType<VxeSelectPropTypes.ScrollY>,

    // 已废弃，被 option-config.keyField 替换
    optionId: {
      type: String as PropType<VxeSelectPropTypes.OptionId>,
      default: () => getConfig().select.optionId,
    },
    // 已废弃，被 option-config.useKey 替换
    optionKey: Boolean as PropType<VxeSelectPropTypes.OptionKey>,
  },
  setup(props, { slots, emit, attrs, expose }) {
    let _select = new _Select(props)
    expose(_select)
    const registerRef = (ref) => {
      _select.registerRef('select', ref) ////
    } //
    return () => {
      let _com = <Select ref={registerRef} {...props}></Select>
      return _com //
    }
  },
})
