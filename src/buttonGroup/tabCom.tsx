import { defineComponent, watch } from 'vue'
import { ElTabPane, ElTabs, tabPaneProps, tabsProps } from 'element-plus'
import { Tab } from './tab'
import { erFormEditor } from '@ER/formEditor'
import DragGable from '@ER/vueDraggable/vuedraggable'
import { TransitionGroup } from 'vue'
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
        //引用相同
        if (tabIns.config.items == newValue) {
          let addItems = newValue.filter((el) => {
            return !oldValue.includes(el)
          })
          if (addItems.length > 0) {
            tabIns.addItem(addItems)
          }
          let removeItems = oldValue.filter((el) => {
            return !newValue.includes(el)
          })
          if (removeItems.length > 0) {
            tabIns.delItem(removeItems)
          }
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
    const ns = tabIns.hooks.useNamespace('tabCom')
    const register = (el) => {
      if (el) {
        tabIns.registerRef('root', el)
      } else {
        tabIns.unregisterRef('root')
      }
    }
    return () => {
      const item = slots.item
      const tabCom = (
        <div ref={register}>
          <ElTabs
            style={{ height: `${tabIns.getTabHeight()}` }}
            class={ns.b()}
            {...tabIns.getBindConfig()}
            v-slots={{
              default: () => {
                let comArr = tabIns.tabitems
                  // .sort((el1, el2) => { return el1.index - el2.index })
                  .map((el, index) => {
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
                              class={'no-select'}
                              style={el.getSlotItemStyle()}
                            >
                              {dCom}
                              {mCom}
                              {item(el)}
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
