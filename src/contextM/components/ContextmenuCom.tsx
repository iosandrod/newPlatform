import { BMenu, BMenuItem } from '@/buttonGroup/bMenu'
import { defineComponent, PropType } from 'vue'
import Contextmenu from './Contextmenu'
import ContextmenuItem from './ContextmenuItem'
import ContextmenuSubmenu from './ContextmenuSubmenu'
import ContextmenuIcon from './ContextmenuIcon'
import ContextmenuGroup from './ContextmenuGroup'
import ContextmenuDivider from './ContextmenuDivider'

export const itemCom = defineComponent({
  name: 'ContextmenuItemCom',
  props: {
    item: {
      type: Object,
    },
  },
  components: {
    ContextmenuItem,
    ContextmenuSubmenu,
    ContextmenuIcon,
    ContextmenuGroup,
    ContextmenuDivider,
  },
  setup(props, { slots, attrs, emit, expose }) {
    let item: BMenuItem = props.item as any
    return () => {
      let items = item.items
      let com = null
      if (items.length > 0) {
        com = (
          <ContextmenuSubmenu title="测试3">
            {{
              default: () => {
                let arr = items.map((item) => {
                  return <itemCom item={item} v-slots={slots}></itemCom>
                })
                return arr
              },
              title: (config) => {
                let subItemTitle = slots.subItemSlot
                const button = item?.config?.button
                if (subItemTitle) {
                  return subItemTitle({ button: button })
                }
                return <div>{item.getLabel()}</div>
              },
            }}
          </ContextmenuSubmenu>
        )
      } else {
        com = (
          <ContextmenuItem>
            {{
              default: () => {
                let _slot = slots.itemSlot
                let _com: any = null
                if (_slot) {
                  _com = _slot({ button: item.config.button })
                } else {
                  _com = <div>{item.getLabel()}</div>
                }
                return (
                  <div
                    onClick={() => {
                      item.onClick()
                    }}
                  >
                    {_com}
                  </div>
                )
              },
            }}
          </ContextmenuItem>
        )
      }
      return com
    }
  },
})

export default defineComponent({
  name: 'ContextmenuCom',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    autoAdjustPlacement: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    teleport: {
      type: [String, Object] as PropType<string | Element>,
      default: () => 'body',
    },
    preventContextmenu: {
      type: Boolean,
      default: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
    isTeleport: {
      type: Boolean,
      default: true,
    },
    alwaysShow: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots, attrs, emit, expose }) {
    let mIns = new BMenu(props) //
    expose(mIns)
    return () => {
      const comArr = mIns.items.map((item) => {
        return <itemCom item={item} v-slots={slots}></itemCom>
      })
      let com = (
        <Contextmenu
          ref={(el) => mIns.registerRef('contextmenu', el)}
          {...props}
          modelValue={mIns.getModelValue()} //
          {...{
            ['onUpdate:modelValue']: (val: boolean) => {
              //
              mIns.modelValue = val //
            },
          }}
          v-slots={{
            default: () => {
              return comArr //
            },
          }}
        ></Contextmenu>
      )
      return com //
    }
  },
})
