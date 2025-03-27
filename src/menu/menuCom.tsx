import { defineComponent, provide } from 'vue'
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { Menu } from './menu'
import { fieldsConfig } from '@ER/formEditor/componentsConfig'
import { MenuItem } from './menuitem'
import {} from 'vue'
import { menuProps } from 'element-plus'
const subMenu = defineComponent({
  name: 'subMenu',
  components: {},
  props: {
    item: {},
    ...menuProps,
  },
  setup(props, { expose, slots, emit, attrs }) {
    const item: MenuItem = props.item as any
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
                  return <subMenu key={item.id} item={item} v-slots={slots}></subMenu> //
                })
                return items
              },
              title: () => {
                let itemSlots = slots.subItemTitle
                if (itemSlots != null) {
                  return itemSlots(item)
                } else {
                  return <div>1111</div>
                }
              },
            }}
          ></ElSubMenu>
        )
      }
      return _com //
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
  },
  setup(props, { expose, slots }) {
    const menuIns = new Menu(props) //
    provide('menuIns', menuIns)
    expose(menuIns) //
    return () => {
      const children = menuIns.menuitems //
      const items = children.map((item) => {
        return <subMenu key={item.id} item={item} v-slots={slots}></subMenu>
      })
      let com = (
        <ElMenu
          {...props}
          v-slots={{
            default: () => items,
          }}
        ></ElMenu>
      )
      return com
    }
  },
}) 
