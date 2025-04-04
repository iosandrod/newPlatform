import { itemGroup } from '@/buttonGroup/buttonGroup'
import { defineComponent, toRaw } from 'vue'
import tabCom from '@/buttonGroup/tabCom'
import {
  ElButton,
  ClickOutside,
  ElMenu,
  ElMenuItem,
  ElSubMenu,
} from 'element-plus'
import { Button } from './button'
import MenuCom from '@/menu/menuCom'
import dropdownCom from '@/menu/dropdownCom'
import { VxeTable } from 'vxe-table'
import { Contextmenu, ContextmenuItem } from '@/contextM'
import ContextmenuCom from '@/contextM/components/ContextmenuCom'
export default defineComponent({
  name: 'buttonGroupCom',
  components: {
    dropdownCom,
    tabCom,
    MenuCom,
    ContextmenuItem,
    ContextmenuCom,
  },
  directives: {
    ClickOutside,
  },
  props: {
    items: {
      default: () => [],
    },
    _class: {
      type: Function,
    },
    parent: {
      type: Object,
    },
  },
  setup(props, { attrs, slots, emit }) {
    let group = new itemGroup(props, props._class as any)
    const ns = group.hooks.useNamespace('buttonGroupCom')
    const btnG = group.hooks.useNamespace('buttonMenuCom')
    const runBtnFn = (el: Button) => {
      el.runFn({
        parent: props.parent,
        button: el,
      })
    }
    return () => {
      let com = (
        <tabCom
          class={`${ns.b()}`} //
          isDesign={group.isDesign}
          {...group.getTabProps()}
          height={27}
          v-slots={{
            item: (el: Button) => {
              let btn = el.config.button
              let com = (
                <div
                  class="v-contextmenu"
                  style={{ width: '100px', position: 'relative', zIndex: 0 }}
                  onClick={() => {
                    runBtnFn(btn)
                  }}
                >
                  <ContextmenuItem>{btn?.getLabel()}</ContextmenuItem>
                </div>
              )
              let com1 = null
              if (btn.buttons.length > 0) {
                com = (
                  <dropdownCom
                    ref={(el) => btn.registerRef('dropdown', el)}
                    v-slots={{
                      default: (config) => {
                        const dropdown = config.dropdown
                        let _com1 = (
                          <div
                            onClick={() => {
                              dropdown.showDropdown() //
                            }}
                            onMouseleave={() => {}}
                            class="v-contextmenu"
                            style={{ width: '100px', position: 'relative' }}
                          >
                            <ContextmenuItem>{btn?.getLabel()}</ContextmenuItem>
                          </div>
                        )
                        return _com1
                      },

                      dropdown: () => {
                        let _items: Button = btn.getSubData()
                        let menu = (
                          <ContextmenuCom
                            ref={(el) => btn.registerRef('contextmenu', el)}
                            isTeleport={false}
                            items={_items} //
                            alwaysShow={true}
                            v-slots={{
                              itemSlot: (item) => {
                                const btn = item.button
                                let disabled = btn.getDisabled()
                                return (
                                  <div
                                    class={[{ 'is-disabled': disabled }]}
                                    style={{ width: '100%' }}
                                    onClick={() => runBtnFn(btn)}
                                  >
                                    {btn.getLabel()}
                                  </div>
                                ) //
                              },
                              subItemSlot: (item) => {
                                //
                                const btn = item.button
                                return <div class={{}}>{btn.getLabel()}</div>
                              },
                            }}
                          ></ContextmenuCom>
                        )
                        return menu
                      },
                    }} //
                  ></dropdownCom>
                )
              } //
              return (
                <div>
                  {com}
                  {/* {com1} */}
                </div>
              )
            },
          }}
        ></tabCom>
      )
      return com
    }
  },
})
