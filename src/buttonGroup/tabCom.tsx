import { computed, defineComponent, nextTick, watch } from 'vue'
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
    showConfigIcon: {
      type: Boolean,
      default: false,
    },
    onTabChange: {
      type: Function, //
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
    showCloseIcon: {
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
    onCloseClick: {
      type: Function,
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
    let modelValue = computed(() => {
      //
      return tabIns.getModelValue()
    })
    watch(
      () => modelValue.value,
      (newValue) => {
        nextTick(() => {
          tabIns.changeItemShow()
        })
      },
      {
        immediate: true, //
      },
    )
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
      } //
      let dCom = tabIns.tabitems.map((el, index) => {
        let _class = ['hidden', 'h-full','overflow-hidden']
        let _default = slots.default
        let _name = el.getTabName() //
        let com1 = null
        if (_default != null) {
          com1 = _default(el)
        }
        let _com = (
          <div
            ref={(e) => {
              el.registerRef('tabPaneCom', e)
            }} //
            class={_class}
            key={_name}
          >
            {com1}
          </div>
        )
        return _com //
      })
      const tabCom = (
        <div class="flex flex-col h-full overflow-hidden" ref={register}>
          {context}
          <ElTabs
            style={{ height: `${tabIns.getTabHeight()}` }}
            class={_class}
            {...tabIns.getBindConfig()}
            onTabChange={(el) => {
              tabIns.onTabChange(el)
            }}
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
                            class="cursor-pointer flex items-center er-h-30 px-3 bg-white text-blue-600 font-medium leading-none
         box-border rounded-md shadow-sm border border-blue-300
         hover:bg-blue-50 transition"
                          >
                            {el.getLabel()}
                          </div>
                        )
                        _itemCom = label //
                      }
                      let closeIcon = null
                      if (props.showCloseIcon == true) {
                        //
                        closeIcon = (
                          <div
                            ref={(el1) => {
                              el.registerRef('closeIcon', el1)
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              tabIns.hiddenItem(el)
                            }}
                            class="absolute hidden cursor-pointer h-full  justify-center items-center right-1"
                          >
                            <div>x</div>
                          </div>
                        )
                        if (el.config.closeable == false) {
                          closeIcon = null //
                        }
                      }
                      let height = el.tab.getTabHeight()
                      let mHeight = el.tab.getTabMinHeight()
                      let dragCom = (
                        <div
                          key={el.id}
                          class={['move flex flex-row items-center']}
                          ref={(el1) => {
                            el.registerRef('root', el1)
                          }}
                          style={{
                            position: 'relative', //
                            minHeight: mHeight, //
                            height: `${height}`,
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
                            onMouseenter={(e) => {
                              let icon = el.getRef('closeIcon')
                              if (icon) {
                                icon.style.display = 'flex'
                              }
                            }}
                            onMouseleave={(e) => {
                              let icon = el.getRef('closeIcon')
                              if (icon) {
                                icon.style.display = 'none'
                              }
                            }}
                            class={'no-select flex items-center h-full'}
                            style={el.getSlotItemStyle()}
                          >
                            {dCom}
                            {mCom}
                            {_itemCom}
                            {closeIcon}
                          </div>
                        </div>
                      ) //
                      return dragCom
                    }, //
                    default: () => {
                      // let _default = slots.default
                      let innerCom = null
                      // if (_default != null) {
                      //   innerCom = _default(el) //
                      // } //
                      return <div class='hidden'>{innerCom}</div>
                    },
                  }
                  let com = null
                  com = (
                    <div>
                      <ElTabPane
                        {...el.getItemProp()}
                        v-slots={_slots}
                      ></ElTabPane>
                    </div>
                  )
                  return com
                }) //
                return comArr
              },
            }}
          ></ElTabs>
          <div class="flex-1">{dCom}</div>
        </div>
      )
      return tabCom
    }
  },
})


