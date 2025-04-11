import { defineComponent, PropType, withDirectives } from 'vue'
import { Dropdown } from './dropdown'
import { dropdownProps, ElDropdown } from 'element-plus'
import Pulldown from './pulldownCom'
import { getConfig, VxePulldownProps, VxePulldownPropTypes } from 'vxe-pc-ui'
export default defineComponent({
  components: { Pulldown },
  name: 'dropdownCom',
  props: {
    modelValue: Boolean as PropType<VxePulldownPropTypes.ModelValue>,
    disabled: Boolean as PropType<VxePulldownPropTypes.Disabled>,
    placement: String as PropType<VxePulldownPropTypes.Placement>,
    trigger: {
      type: String as PropType<VxePulldownPropTypes.Trigger>,
      default: getConfig().pulldown.trigger,
    },
    size: {
      type: String as PropType<VxePulldownPropTypes.Size>,
      default: () => getConfig().size,
    },
    options: Array as PropType<VxePulldownPropTypes.Options>,
    className: {
      type: [String, Function] as PropType<VxePulldownPropTypes.ClassName>,
      default: getConfig().pulldown.className,
    },
    popupClassName: [String, Function] as PropType<VxePulldownPropTypes.PopupClassName>,
    showPopupShadow: Boolean as PropType<VxePulldownPropTypes.ShowPopupShadow>,
    destroyOnClose: {
      type: Boolean as PropType<VxePulldownPropTypes.DestroyOnClose>,
      default: getConfig().pulldown.destroyOnClose,
    },
    transfer: {
      type: Boolean as PropType<VxePulldownPropTypes.Transfer>,
      default: null,
    },
    hiddenBefore: {
      type: Function,
    },
  },
  setup(props, { slots, emit, attrs, expose }) {
    const drop = new Dropdown(props)
    expose(drop)
    return () => {
      let com = (
        <Pulldown
          {...props}
          transfer={true}
          ref={(e) => drop.registerRef('dropdown', e)}
          destroyOnClose={true}
          modelValue={drop.getModelValue()} //
          v-slots={{
            default: () => {
              let com = slots.default({ dropdown: drop })
              return com
            },
            dropdown: () => {
              let com = slots?.dropdown({ dropdown: drop }) || null
              return com //
            },
          }} //
          onVisibleChange={(v) => drop.onVisibleChange(v)} //
        ></Pulldown>
      )
      return com //
    }
  },
})
