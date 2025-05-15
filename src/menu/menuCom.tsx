import { defineComponent, provide, watch } from 'vue'
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { Menu } from './menu'
import { fieldsConfig } from '@ER/formEditor/componentsConfig'
import { MenuItem } from './menuitem'
import {} from 'vue'
import { menuProps } from 'element-plus'
import { el } from 'element-plus/es/locale'
const subMenu = defineComponent({
  name: 'subMenu',
  components: {},
  props: {
    item: {},
    ...menuProps,
  },
  setup(props, { expose, slots, emit, attrs }) {
    const item: MenuItem = props.item as any
    const registerRoot = (el) => {
      item.registerRef('root', el) //
    }
    return () => {
      const _config = item?.getProps()
      let menuitems = item?.menuitems || []
      let _com: any = null
      if (menuitems.length == 0) {
        _com = (
          <ElMenuItem
            {..._config}
            teleported={true}
            v-slots={{
              title: () => {
                let itemSlots = slots.itemTitle
                if (itemSlots != null) {
                  return itemSlots(item)
                } else {
                  return <div></div>
                }
              },
              label: () => {
                return <div></div>
              },
              default: () => {
                let itemSlots = slots.item
                if (itemSlots != null) {
                  return itemSlots(item)
                } else {
                  return <div></div>
                }
              },
            }}
          ></ElMenuItem>
        )
      } else {
        _com = (
          <ElSubMenu
            {..._config}
            teleported={true}
            v-slots={{
              default: () => {
                if (slots.drag != null) {
                  return slots.drag(item)
                }
                let items = menuitems.map((item) => {
                  let dragSlot = slots.drag
                  if (dragSlot != null) {
                    let c = dragSlot(item)
                    return c
                  }
                  return (
                    <subMenu
                      key={item.id}
                      item={item}
                      v-slots={slots}
                    ></subMenu>
                  ) //
                })
                return items
              },
              title: () => {
                let subItemTitle = slots.subItemTitle
                if (subItemTitle != null) {
                  return subItemTitle(item)
                } else {
                  return <div></div>
                }
              },
            }}
          ></ElSubMenu>
        )
      }
      let _com1 = <div ref={registerRoot}>{_com}</div>
      return _com1 //
    }
  },
})
export default defineComponent({
  components: {
    subMenu,
  },
  props: {
    ...menuProps,
    defaultOpeneds: {},
    items: {
      type: Array,
      default: () => [], //
    },
    searchFn: {}, //
    isShowSearch: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { expose, slots }) {
    const menuIns = new Menu(props) //
    provide('menuIns', { _instance: menuIns })
    watch(
      () => props.items,
      (newValue, oldValue) => {
        menuIns.setMenuItems(newValue) //
      },
    )
    watch(
      () => menuIns.searchValue,
      (newValue, oldValue) => {
        menuIns.resetItemShow()
      },
    )
    let btns = [
      {
        type: 'search',
        label: '搜索',
        icon: 'Search',
        fn: () => {
          let items: MenuItem[] = menuIns.getLastMenuItems()

          items.forEach((item) => {
            item.resetCurrentShow()
          })
        },
      },
    ]
    const registerMenuRef = (el) => {
      menuIns.registerRef('menuRef', el) //
    }
    expose(menuIns) //
    return () => {
      const children = menuIns.menuitems //
      const items = children.map((item) => {
        return <subMenu key={item.id} item={item} v-slots={slots}></subMenu>
      })
      let com = (
        <div
          style={{
            width: '100%',
            height: '100%', //
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column', //
          }}
        >
          <div
            style={{
              top: '0px',
              width: '100%',
              paddingRight: '10px',
            }}
          >
            <vxe-input
              style={{ width: '100%' }}
              onChange={(e) => {
                let value = e.value
                menuIns.searchInputChange(value)
              }}
              modelValue={menuIns.searchValue}
            ></vxe-input>
            {/* <er-button-group items={btns}></er-button-group> */}
          </div>
          <div style={{ width: '100%', flex: 1, overflow: 'auto' }}>
            <ElMenu
              ref={registerMenuRef}
              {...props}
              defaultOpeneds={menuIns.getMenuDefaultOpeneds()} //
              v-slots={{
                default: () => items,
              }}
            ></ElMenu>
          </div>
        </div>
      )
      return com
    }
  },
})
