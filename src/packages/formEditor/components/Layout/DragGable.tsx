import {
  defineComponent,
  resolveComponent,
  watch,
  useAttrs,
  useSlots,
  unref,
  nextTick,
  ref,
  inject,
  reactive,
} from 'vue'
import { isHTMLTag } from '@vue/shared'
// import DragGable from 'vuedraggable'
import DragGable from '@ER/vueDraggable/vuedraggable'
import utils from '@ER/utils'
import hooks from '@ER/hooks'
import _ from 'lodash'
import LayoutGridLayout from './GridLayout'
import LayoutTabsLayout from './TabsLayout'
import LayoutCollapseLayout from './CollapseLayout'
import LayoutTableLayout from './TableLayout'
import LayoutInlineLayout from './InlineLayout'
import LayoutSubformLayout from './SubformLayout'
import Selection from '@ER/formEditor/components/Selection/selectElement'
import ControlInsertionPlugin from './ControlInsertionPlugin'
import { typeMap } from '../FormTypes'
import { Form } from '@ER/form'
import { dName } from '@ER/vueDraggable/vuedraggable'
import Sortable from 'sortablejs'
import { FormItem } from '@ER/formitem'
import { PageDesign } from '@ER/pageDesign'
const dragGableWrap = defineComponent({
  inheritAttrs: false,
  name: 'customDragGable',
  customOptions: {},
  components: {
    DragGable, //
  },
  setup(props) {
    const { isEditModel } = hooks.useTarget()

    return () => {
      const attrs: any = useAttrs()
      let node = ''
      if (unref(isEditModel)) {
        node = (
          <dragGable
            {...attrs} //
          >
            {useSlots()}
          </dragGable>
        )
      } else {
        const _tag = isHTMLTag(attrs.tag)
          ? attrs.tag
          : resolveComponent(attrs.tag)
        // let { item } = useSlots()
        let obj = useSlots()
        let item = obj.item
        let _slots = {
          ...obj,
          default: () => {
            return attrs?.list
              ?.filter((e) => e != null)
              .map((e, i) => {
                let style = {
                  width: '100%', //
                  display: 'flex',
                  flexDirection: 'column', //
                }
                if (i == attrs.list.length - 1) {
                  //@ts-ignore
                  style.flex = 1
                }
                let _com = (
                  <div style={style}>
                    {item({
                      element: e,
                    })}
                  </div>
                )
                return _com
              })
          },
        }
        node = <_tag v-slots={_slots} {...attrs.componentData}></_tag>
      }
      return node
    }
  },
})
export { dragGableWrap }
export default defineComponent({
  name: 'DragGableLayout',
  components: {
    // DragGable
    dragGableWrap,
  },
  props: {
    isRoot: {
      type: Boolean,
      default: false,
    },
    data: Object,
    parent: Object,
    tag: {
      type: String,
      default: 'div',
    },
    type: {
      type: String,
    },
  },
  setup(props) {
    const ER = inject('Everright') as any
    const ns = hooks.useNamespace('DragGableLayout')
    const { state, isEditModel, isPc, setSelection } = hooks.useTarget()
    const handleMove = (e) => {
      return true
    }
    const formIns: Form = inject('formIns')
    let mainPage: PageDesign = inject('mainPageDesign', null)
    let tName = null
    if (mainPage) {
      let tableName = mainPage.getTableName()
      if (tableName) {
        tName = tableName
      }
    }
    //@ts-ignore
    const id = formIns.id
    let pluginName = formIns.getPluginName()
    const dragOptions = {
      swapThreshold: 1,
      group: {
        name: `er-Canves-${id}`,
      },
      parent: props.parent, //
      plugins: [ControlInsertionPlugin(ER)], //
      // ControlInsertion: true,
      [pluginName]: true,
    }
    try {
    } catch (error) {}
    const loadComponent = () => {
      //
      let componentMap = {}
      watch(
        () => state.platform,
        () => {
          componentMap = {}
        },
      )
      return {
        findComponent(type, element) {
          let info = componentMap[type + element]
          if (!info) {
            componentMap[type + element] =
              typeMap[element?.toLowerCase()]?.[state.platform]
            if (!componentMap[type + element]) {
              console.log(Object.keys(typeMap), 'typeMap') ////
              console.error(element, '找不到组件') //
            }
            info = componentMap[type + element] //
          }
          return info
        },
      }
    }
    const load = loadComponent()
    let oldSlots = useSlots()
    const slots = {
      item: (_config) => {
        let element: any = _config.element
        if (element == null) {
          return null
        } //
        let node = ''
        let allLayoutType = ['grid', 'table', 'tabs', 'collapse', 'inline']
        let _style: any = {}
        if (allLayoutType.includes(element.type)) {
          let context = element.context
          let parent = context.parent
          if (!Array.isArray(parent)) {
            parent = [parent]
          }
          if (parent.includes(element)) {
            let index = parent.indexOf(element)
            if (index == parent.length - 1) {
              _style.flex = 1
            }
          }
        }
        switch (element.type) {
          //这些都是布局控件
          case 'grid':
            node = (
              <LayoutGridLayout
                style={_style}
                key={element.id}
                data={element}
                parent={props.data}
              ></LayoutGridLayout>
            )
            break
          case 'table':
            node = (
              <LayoutTableLayout
                style={_style}
                key={element.id}
                data={element}
                parent={props.data}
              ></LayoutTableLayout>
            )
            break
          case 'tabs':
            node = (
              <LayoutTabsLayout
                style={_style}
                key={element.id}
                data={element}
                parent={props.data}
              ></LayoutTabsLayout>
            )
            break
          case 'collapse':
            node = (
              <LayoutCollapseLayout
                key={element.id}
                style={_style}
                data={element}
                parent={props.data}
              ></LayoutCollapseLayout>
            )
            break
          case 'inline':
            node = (
              <LayoutInlineLayout
                key={element.id}
                style={_style}
                data={element}
                parent={props.data}
              ></LayoutInlineLayout>
            )
            break
          default:
            let formitem = formIns.items.find((item) => item.id === element.id)
            if (formitem == null) {
              return null //
            }
            if (formitem.config != element) {
              formitem.config = element
            }
            if (formitem == null) {
              return null
            }
            //@ts-ignore
            formitem.tableName = tName
            let typeProps = {} //
            try {
              typeProps = formitem?.getFormItemProps(element) || {} //
            } catch (error) {
              setTimeout(() => {
                console.error('没有找到formitem', formIns) //////
              }, 100)
            }
            let TypeComponent = ''
            if (
              unref(isEditModel) ||
              _.get(
                state.fieldsLogicState.get(element),
                'visible',
                undefined,
              ) !== 0
            ) {
              // if(element.type=='buttongroup'){
              // }
              TypeComponent = load.findComponent('FormTypes', element.type)

              const params = {
                data: element,
                parent: props.data,
                key: element.id,
              }
              if (unref(isPc)) {
                //@ts-ignore
                const formitem: FormItem = typeProps?.formitem //
                const prop = formitem?.getField()
                let innerCom = null //
                //@ts-ignore
                if (formIns.pageType == 'pageDesign') {
                  let tCom = (
                    <div class="pl-10 h-30 flex align-center">
                      {formitem.getTitle()}
                    </div>
                  )
                  if (formitem.isShowTitle() == false) {
                    tCom = null //
                  }
                  innerCom = (
                    <div class="flex flex-row h-full ">
                      {/* {tCom} */}
                      <TypeComponent
                        item={formitem}
                        key={`${element.id}__${element.type}`}
                        data={element}
                        params={typeProps}
                      ></TypeComponent>
                    </div>
                  )
                } else {
                  let style = formitem.getStyle()
                  innerCom = (
                    <div style={style} class="flex flex-row h-full">
                      <div class="flex-1 pl-5">
                        <vxe-form-item
                          field={formitem.getField()}
                          style={{
                            height: '100%', //
                          }}
                          v-slots={{
                            default: () => {
                              return (
                                <TypeComponent
                                  item={formitem}
                                  key={`${element.id}__${element.type}`}
                                  data={element}
                                  params={typeProps}
                                  isFormInput={true}
                                  style={{}}
                                ></TypeComponent>
                              )
                            },
                            title: () => {
                              let ht = formitem.isHiddenTitle()
                              if (ht == true) {
                                return null //
                              }
                              let tCom = (
                                <div class="flex align-center">
                                  {element?.['label']}
                                </div>
                              )
                              let requireDiv = null
                              let required = element.required
                              if (required == true) {
                                requireDiv = <div class="color-red">*</div>
                              }
                              let label = formitem.getLabelWidth()
                              return (
                                <div
                                  style={{ minWidth: label }} //
                                  class="flex flex-row"
                                  onContextmenu={(e: MouseEvent) => {
                                    if (mainPage) {
                                      mainPage.curDForm
                                      //@ts-ignore
                                      mainPage.currentContextItem = {
                                        //@ts-ignore
                                        config: {
                                          type: 'dform',
                                        },
                                      }
                                      let _config = formitem.config
                                      mainPage.currentFItemConfig = _config
                                      //@ts-ignore
                                    }
                                    e.preventDefault()
                                    formitem.openMainMenu(e, {
                                      config: {
                                        type: 'dform',
                                        formIns: formIns,
                                      }, //
                                    })
                                  }}
                                >
                                  {requireDiv}
                                  {tCom}
                                </div>
                              )
                            },
                          }}
                        ></vxe-form-item>
                      </div>
                    </div>
                  )
                }
                node = (
                  //@ts-ignore
                  <Selection
                    hasWidthScale
                    hasCopy
                    hasDel
                    hasDrag
                    hasMask
                    {...params}
                  >
                    {element.type !== 'divider' ? (
                      innerCom
                    ) : (
                      <TypeComponent
                        key={element.id}
                        data={element}
                        params={typeProps}
                      ></TypeComponent>
                    )}
                  </Selection>
                )
              } else {
                node = (
                  //@ts-ignore
                  <Selection
                    hasWidthScale
                    hasCopy
                    hasDel
                    hasDrag
                    hasMask
                    {...params}
                  >
                    <TypeComponent
                      item={formitem}
                      key={element.id}
                      data={element}
                      params={typeProps}
                    ></TypeComponent>
                  </Selection>
                )
              }
            }
            break
        }
        return node
      },
      footer() {
        let node = ''
        if (_.isEmpty(props.data)) {
          if (!props.isRoot) {
            node = <div class={ns.e('dropHere')}>drop here</div>
          }
        }
        return node
      },
      ...oldSlots,
    }
    return () => {
      let _class = []
      if (!unref(isEditModel)) {
        _class.push('flex flex-col')
      }
      return (
        <dragGableWrap
          list={props.data.filter((v) => v != null)} //isArray
          handle=".ER-handle"
          class={[ns.b(), unref(isEditModel) && ns.e('edit'), ..._class]}
          tag={props.tag}
          item-key="id"
          move={handleMove}
          {...dragOptions}
          componentData={useAttrs()}
          v-slots={slots}
        ></dragGableWrap>
      )
    }
  },
})
