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
        const { item } = useSlots()
        node = (
          <_tag {...attrs.componentData}>
            {attrs.list.map((e, i) => {
              let style = {
                height: '100%',
                width: '100%', //
              }
              if (i == attrs.list.length - 1) {
                //
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
            })}
          </_tag>
        )
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
    const ER = inject('Everright')
    const ns = hooks.useNamespace('DragGableLayout')
    const { state, isEditModel, isPc, setSelection } = hooks.useTarget()
    const handleMove = (e) => {
      return true
    }
    const formIns: Form = inject('formIns')
    //@ts-ignore
    const id = formIns.id
    let pluginName = formIns.getPluginName()
    const dragOptions = {
      swapThreshold: 1,
      group: {
        name: `er-Canves-${id}`,
      },
      parent: props.parent,
      plugins: [ControlInsertionPlugin(ER)], //
      // ControlInsertion: true,
      [pluginName]: true,
    }
    try {
    } catch (error) {}
    const loadComponent = () => {
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
              typeMap[element.toLowerCase()]?.[state.platform]
            if (!componentMap[type + element]) {
              // console.log(Object.keys(typeMap), 'typeMap') ////
              console.error(element, '找不到组件') //
            }
            info = componentMap[type + element] //
          }
          return info
        },
      }
    }
    const load = loadComponent()

    const slots = {
      item: ({ element }) => {
        // if(1==1){
        //   return <div>1233</div>
        // }
        let node = ''
        // console.log(element,'testEl')//
        switch (element.type) {
          case 'grid':
            node = (
              <LayoutGridLayout
                key={element.id}
                data={element}
                parent={props.data}
              ></LayoutGridLayout>
            )
            break
          case 'table':
            node = (
              <LayoutTableLayout
                key={element.id}
                data={element}
                parent={props.data}
              ></LayoutTableLayout>
            )
            break
          case 'tabs':
            node = (
              <LayoutTabsLayout
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
                data={element}
                parent={props.data}
              ></LayoutCollapseLayout>
            )
            break
          case 'inline':
            node = (
              <LayoutInlineLayout
                key={element.id}
                data={element}
                parent={props.data}
              ></LayoutInlineLayout>
            )
            break
          case 'subform':
            if (
              unref(isEditModel) ||
              _.get(
                state.fieldsLogicState.get(element),
                'visible',
                undefined,
              ) !== 0
            ) {
              node = (
                <LayoutSubformLayout
                  key={element.id}
                  data={element}
                  parent={props.data}
                ></LayoutSubformLayout>
              )
            }
            break
          default:
            let formitem = formIns.items.find((item) => item.id === element.id)
            let typeProps = {} //
            try {
              typeProps = formitem?.getFormItemProps(element) || {} //
            } catch (error) {
              setTimeout(() => {
                console.error('没有找到formitem', formIns) //////
              }, 100)
            }
            const rules = formitem?.getValidateRoles() || [] //
            let TypeComponent = ''
            if (
              unref(isEditModel) ||
              _.get(
                state.fieldsLogicState.get(element),
                'visible',
                undefined,
              ) !== 0
            ) {
              TypeComponent = load.findComponent('FormTypes', element.type)
              const params = {
                data: element,
                parent: props.data,
                key: element.id,
              }
              if (process?.env?.NODE_ENV === 'test') {
                params['data-field-id'] = `${element.id}`
              }
              if (unref(isPc)) {
                //@ts-ignore
                const formitem = typeProps?.formitem //
                const prop = formitem?.getField()
                let innerCom = null
                //@ts-ignore
                if (formIns.pageType == 'pageDesign') {
                  innerCom = (
                    <TypeComponent
                      key={element.id}
                      data={element}
                      params={typeProps}
                    ></TypeComponent>
                  )
                } else {
                  innerCom = (
                    <el-form-item {...typeProps} prop={prop}>
                      <TypeComponent
                        key={element.id}
                        data={element}
                        params={typeProps}
                      ></TypeComponent>
                    </el-form-item>
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
                      //@ts-ignore
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
    }
    return () => {
      return (
        <dragGableWrap
          list={props.data} //isArray
          handle=".ER-handle"
          class={[ns.b(), unref(isEditModel) && ns.e('edit')]}
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
