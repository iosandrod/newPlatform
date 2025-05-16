import { defineComponent, watch } from 'vue'
import { ElTabPane, ElTabs, tabPaneProps, tabsProps } from 'element-plus'
import { Tab } from './tab'
import { erFormEditor } from '@ER/formEditor'
import DragGable from '@ER/vueDraggable/vuedraggable'
import { TransitionGroup } from 'vue'
import ContextmenuCom from '@/contextM/components/ContextmenuCom'
export default defineComponent({
  name: 'tabCom', //
  props: {
    ...tabsProps,
    height: {
      type: Number,
    },
    items: {
      type: Array,
      default: (): any[] => [],
    },
    isDesign: {
      type: Boolean,
      default: false,
    },
    showContextMenu: {
      type: Boolean,
      default: false,
    },
    contextItems: {
      type: Array,
      default: (): any[] => [],
    },
    useDefaultClass: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    // erFormEditor,
    DragGable,
    TransitionGroup,
  },
  setup(props, { emit, slots, attrs }) {
    const tabIns = new Tab(props)
    watch(
      () => [props.items as any, props.items?.length],
      ([newValue, length], [oldValue, oldLength]) => {
        //引用相同//
        if (tabIns.config.items == newValue) {
          // let s = newValue[0] === oldValue[0] //
          let addItems = newValue.filter((el) => {
            return !oldValue.includes(el)
          })
          if (addItems.length > 0) {
            addItems.forEach((el) => {
              tabIns.addItem(el)
            })
          }
          let removeItems = oldValue.filter((el) => {
            return !newValue.includes(el)
          })
          if (removeItems.length > 0) {
            removeItems.forEach((el) => {
              tabIns.delItem(el)
            })
          }
        } else {
          tabIns.setItems(newValue) //
        }
      },
    )
    watch(
      //
      () => props.isDesign,
      (newValue) => {
        tabIns.setIsDesign(newValue)
      },
      {
        immediate: true,
      },
    )
    let ns = tabIns.hooks.useNamespace('tabCom')
    const register = (el) => {
      if (el) {
        tabIns.registerRef('root', el)
      } else {
        tabIns.unregisterRef('root')
      }
    }
    const registerContext = (el) => {
      tabIns.registerRef('contextMenu', el) //
    }
    return () => {
      const item = slots.item
      let context = null
      if (props.showContextMenu == true) {
        //
        context = (
          <ContextmenuCom
            ref={registerContext}
            items={tabIns.getContextItems()}
          ></ContextmenuCom>
        )
      }
      let _class = ns.b()
      if (props.useDefaultClass == true) {
        //@ts-ignore
        _class = [] ////
      }
      const tabCom = (
        <div ref={register}>
          {context}
          <ElTabs
            style={{ height: `${tabIns.getTabHeight()}` }}
            class={_class}
            {...tabIns.getBindConfig()}
            v-slots={{
              default: () => {
                let comArr = tabIns.tabitems.map((el, index) => {
                  let _slots = {
                    label: (_el) => {
                      let mCom = null
                      let dCom = null
                      if (tabIns.isDesign) {
                        mCom = (
                          <div
                            style={{
                              height: '100%',
                              width: '100%',
                              position: 'absolute',
                              // zIndex: 2,
                              background: 'rgba(0, 0, 0, 0.0)',
                            }}
                          ></div>
                        )
                        dCom = (
                          <div
                            onMousedown={(e) => {
                              el.startDrag(e)
                            }}
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '20px',
                              height: '20px',
                              position: 'absolute',
                              zIndex: 3,
                              background: 'rgba(0, 0, 0,0.2 )',
                              cursor: 'move',
                            }}
                          >
                            ☰
                          </div>
                        )
                      }
                      let _itemCom = null
                      if (item != null) {
                        _itemCom = item(el)
                      } else {
                        let label = (
                          <div
                            style={{
                              // margin: '3px',
                              boxSizing: 'border-box',
                            }}
                            class="cursor-pointer flex items-center h-30 px-3 bg-white text-blue-600 font-medium leading-none
         box-border rounded-md shadow-sm border border-blue-300
         hover:bg-blue-50 transition"
                          >
                            {el.getLabel()}
                          </div>
                        )
                        _itemCom = label //
                      }
                      let dragCom = (
                        <div
                          key={el.id}
                          class={'move'}
                          ref={(el1) => {
                            el.registerRef('root', el1)
                          }}
                          style={{
                            position: 'relative',
                            height: '100%',
                            width: `${
                              el.dragConfig.rootWidth
                                ? `${el.dragConfig.rootWidth}px`
                                : ''
                            }`,
                          }}
                        >
                          <div
                            onContextmenu={(e) => {
                              e.preventDefault()
                              tabIns.openContextMenu(e, el)
                            }}
                            class={'no-select'}
                            style={el.getSlotItemStyle()}
                          >
                            {dCom}
                            {mCom}
                            {_itemCom}
                          </div>
                        </div>
                      )
                      return dragCom
                    }, //
                    default: () => {
                      return <div></div>
                    },
                  }
                  let com = null
                  com = (
                    <div>
                      <ElTabPane v-slots={_slots}></ElTabPane>
                    </div>
                  )
                  return com
                })

                return comArr
              },
            }}
          ></ElTabs>
        </div>
      )
      return tabCom
    }
  },
})
