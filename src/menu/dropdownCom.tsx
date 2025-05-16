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
    popupClassName: [String, Function] as PropType<
      VxePulldownPropTypes.PopupClassName
    >,
    showPopupShadow: Boolean as PropType<VxePulldownPropTypes.ShowPopupShadow>,
    destroyOnClose: {
      type: Boolean as PropType<VxePulldownPropTypes.DestroyOnClose>,
      // default: getConfig().pulldown.destroyOnClose,
      default: true, //
    },
    transfer: {
      type: Boolean as PropType<VxePulldownPropTypes.Transfer>,
      default: null,
    },
    hiddenBefore: {
      type: Function,
    },
    dropMode: {
      type: String,
    },
  },
  setup(props, { slots, emit, attrs, expose }) {
    const drop = new Dropdown(props)
    expose({ _instance: drop })
    return () => {
      let com = (
        <Pulldown
          {...props}
          transfer={true}
          ref={(e) => drop.registerRef('dropdown', e)}
          destroyOnClose={props.destroyOnClose}
          modelValue={drop.getModelValue()} //
          v-slots={{
            default: () => {
              let dc = slots?.default({ dropdown: drop }) || null
              let com = null
              if (props.dropMode == 'hover') {
                com = (
                  <div
                    onMouseenter={(e) => {
                      drop.dropdownout = false
                      drop.showDropdown() //
                    }}
                  >
                    {dc}
                  </div>
                )
              }
              if (props.dropMode == 'click') {
                com = <div class='w-full'>{dc}</div>
              }
              if (props.dropMode == null) {
                com = <div class='w-full'>{dc}</div>
              }
              return com
            },
            dropdown: () => {
              let com = slots?.dropdown({ dropdown: drop }) || null
              let com1 = null
              if (props.dropMode == 'hover') {
                com1 = (
                  <div
                    onMouseleave={(e) => {
                      drop.dropdownout = true
                      setTimeout(() => {
                        if (drop.dropdownout == true) {
                          drop.closeDropdown() //
                        }
                      }, 100)
                    }}
                  >
                    {com}
                  </div>
                )
              }
              if (props.dropMode != 'hover') {
                com1 = <div>{com}</div>
              }
              // return <div>{com}</div> //
              return com1 //
            },
          }} //
          onVisibleChange={(v) => drop.onVisibleChange(v)} //
        ></Pulldown>
      )
      return com //
    }
  },
})
