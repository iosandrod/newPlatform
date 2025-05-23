import { BMenu, BMenuItem } from '@/buttonGroup/bMenu'
import { defineComponent, inject, PropType, watch } from 'vue' //
import Contextmenu from './Contextmenu'
import ContextmenuItem from './ContextmenuItem'
import ContextmenuSubmenu from './ContextmenuSubmenu'
import ContextmenuIcon from './ContextmenuIcon'
import ContextmenuGroup from './ContextmenuGroup'
import ContextmenuDivider from './ContextmenuDivider'
import { PageDesign } from '@ER/pageDesign'

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
        let visible = item.getVisible() //
        if (visible == false) {
          return null
        }
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
          <ContextmenuItem {...item.config}>
            {{
              default: () => {
                let _slot = slots.itemSlot
                let _com: any = null
                if (_slot) {
                  _com = _slot({ button: item.config.button })
                } else {
                  _com = <div>{item.getLabel()}</div>
                }
                //@ts-ignore
                let disabled = item.getDisabled()
                let _class = []
                if (disabled == true) {
                  _class.push('is-disabled')
                }
                return (
                  <div
                    class={[..._class, 'h-full w-full flex items-center ']}
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
        let visible = item.getVisible() //
        if (visible == false) {
          com = null
        }
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
    parent: {
      type: Object,
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
    beforeHidden: {
      type: Function,
    },
  },
  setup(props, { slots, attrs, emit, expose }) {
    let mIns = new BMenu(props) //
    watch(
      () => {
        return props.items
      },
      (newV) => {
        if (!Array.isArray(newV)) newV = [] //
        mIns.setItems(newV) //
      },
    )
    let mP: PageDesign = inject('mainPageDesign')//
    if (mP != null) {
      let tName = mP.getTableName()
      mIns.tableName = tName //
    }
    expose({ _instance: mIns })
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
          }} //
        ></Contextmenu>
      )
      return com //
    }
  }, //
})
