import { itemGroup } from '@/buttonGroup/buttonGroup'
import { defineComponent, inject, toRaw, watch } from 'vue'
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
import { PageDesign } from '@ER/pageDesign'
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
    tableName: {
      type: String, //
    },
    buttonWidth: {
      type: Number,
      default: 50, //
    },
    items: {
      type: Array,
      default: () => [],
    },
    _class: {
      type: Function,
    },
    parent: {
      type: Object,
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    let group = new itemGroup(props, props._class as any)
    expose({
      _instance: group,
    }) //
    const ns = group.hooks.useNamespace('buttonGroupCom')
    const btnG = group.hooks.useNamespace('buttonMenuCom')
    let currentMainPage = inject('pageDesign', {}) //
    watch(
      () => {
        let items = props.items
        let len = items.length
        return [items, len]
      },
      ([items, len], [oldItems, oldLen]) => {
        //
        if (items !== oldItems) {
          group.setItems(items)
          return
        } //
        let _items: any[] = items as any
        let _oldItems: any[] = group.items.map((row) => row.config) as any
        let addItems = _items.filter((item) => {
          return _oldItems.indexOf(item) === -1
        })
        let delItems = _oldItems.filter((item) => {
          //
          return _items.indexOf(item) === -1
        })
        for (const item of addItems) {
          group.addItem(item)
        }
        for (const item of delItems) {
          group.delItem(item)
        }
      },
    )
    let mainPage: PageDesign = inject('mainPageDesign', null)
    if (mainPage != null) {
      let tName = mainPage.getTableName()
      group.tableName = tName
    }
    const runBtnFn = (el: Button) => {
      //
      el.runFn({
        parent: props.parent,
        button: el,
        page: currentMainPage,
      })
    }
    return () => {
      let com = (
        <tabCom
          useDefaultClass={false}
          class={`${ns.b()}`} //
          isDesign={group.isDesign}
          {...group.getTabProps()}
          height={40}
          v-slots={{
            item: (el: Button) => {
              let btn = el.config.button //
              let disabled = btn.getDisabled()
              let _class = [
                // 'v-contextmenu',
                'h-35',
                'items-center',
                'flex',
              ]
              let _class1 = [
                'h-full w-full pl-10 pr-10  rounded-md bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition',
              ]
              let maskCom = null
              if (disabled == true) {
                // _class.push('is-disabled') //
                _class.push('') //
                _class1.push('is-disabled cursor-not-allowed')
                maskCom = (
                  <div
                    class="absolute top-0 left-0 w-full h-full  cursor-not-allowed opacity-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault() //
                    }}
                  ></div>
                )
              } else {
                _class1.push('cursor-pointer')
              }
              let com = (
                <div
                  class={[..._class, 'pt-2 pb-2 pl-1 pr-1 relative']}
                  style={{
                    minWidth: `${btn.getButtonWidth()}px`,
                    position: 'relative',
                    zIndex: 0,
                  }}
                  onClick={() => {
                    runBtnFn(btn)
                  }}
                >
                  {/* <ContextmenuItem>
                    <div class="h-full flex items-center">
                      {btn?.getLabel()}
                    </div>
                  </ContextmenuItem> */}
                  <div
                    class={[
                      ..._class1,
                      'flex justify-center items-center h-full w-full',
                    ]}
                  >
                    <button class={[]}>{btn?.getLabel()}</button>
                  </div>
                  {maskCom}
                </div>
              )
              let com1 = null
              if (btn?.buttons?.length > 0) {
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
                            class="v-contextmenu flex items-center"
                            style={{
                              minWidth: `${btn.getButtonWidth()}px`,
                              position: 'relative',
                            }}
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
