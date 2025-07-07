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
          return //
        }
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
      const getBtnCom = (el: Button) => {
        let btn = el?.config?.button || el //
        let disabled = btn.getDisabled()
        let _class = ['er-h-32', 'items-center', 'flex']
        let _class1 = [
          'h-full w-full er-pl-10 er-pr-10  rounded-md bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition',
        ]
        let dIcon = null
        if (btn?.buttons?.length > 0) {
          dIcon = (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="m12 15l-5-5h10z" />
            </svg>
          )
        }
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
            ></div> //
          )
        } else {
          _class1.push('cursor-pointer')
        }
        let com = (
          <div
            class={[..._class, 'pl-1 pr-1 relative']}
            style={{
              display: `${btn.getDisplay()}`, //
              minWidth: `${btn.getButtonWidth()}px`,
              position: 'relative',
              zIndex: 0,
            }}
            onClick={() => {
              runBtnFn(btn)
            }}
          >
            <div
              class={[
                ..._class1,
                'flex justify-center items-center h-full w-full',
              ]}
            >
              <button class={[]}>
                <div class="flex">
                  {btn?.getLabel()}
                  {dIcon}
                </div>
              </button>
            </div>
            {maskCom}
          </div>
        )
        return com
      }
      let com = (
        <tabCom
          useDefaultClass={false}
          class={[`${ns.b()}`, 'my-scope', 'er-mb-3', 'er-mt-3']} //
          isDesign={group.isDesign}
          {...group.getTabProps()}
          height={32}
          v-slots={{
            item: (el: Button) => {
              let btn = el.config?.button //
              let com = getBtnCom(el)
              let com1 = null
              if (btn?.buttons?.length > 0) {
                com = (
                  <dropdownCom
                    // dropMode="hover"
                    ref={(el) => btn.registerRef('dropdown', el)}
                    v-slots={{
                      default: (config) => {
                        let _com1 = getBtnCom(el)
                        return _com1
                      },

                      dropdown: () => {
                        let _items: Button = btn.getSubData()
                        let menu = <div class="er-h-100 er-w-100 bg-red"></div>
                        menu = (
                          <ContextmenuCom
                            ref={(el) => btn.registerRef('contextmenu', el)}
                            isTeleport={false}
                            items={_items} //
                            alwaysShow={true}
                            v-slots={{
                              itemSlot: (item) => {
                                // debugger //
                                const btn = item.button
                                let _com = getBtnCom(btn)
                                let com1 = <div class="er-h-32">{_com}</div>
                                return com1 //
                              },
                              subItemSlot: (item) => {
                                const btn = item.button
                                // return <div class={{}}>{btn.getLabel()}</div>
                                let _com = getBtnCom(btn)
                                return _com //
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
