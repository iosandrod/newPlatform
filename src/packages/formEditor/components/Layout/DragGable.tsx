import { defineComponent, resolveComponent, watch, useAttrs, useSlots, defineAsyncComponent, unref, nextTick, ref, inject, reactive } from 'vue'
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
import { VxeForm } from 'vxe-pc-ui'
const dragGableWrap = defineComponent({
  inheritAttrs: false,
  name: 'customDragGable',
  customOptions: {},
  components: {
    DragGable,
  }, //
  setup(props) {
    const { isEditModel } = hooks.useTarget()
    return () => {
      const attrs: any = useAttrs()
      let node = ''
      if (unref(isEditModel)) {
        node = <dragGable {...attrs}>{useSlots()}</dragGable>
      } else {
        const tag = isHTMLTag(attrs.tag) ? attrs.tag : resolveComponent(attrs.tag)
        const { item } = useSlots()
        node = (
          <tag {...attrs.componentData}>
            {attrs.list.map((e) => {
              return item({
                element: e,
              })
            })}
          </tag>
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
    const formIns: any = inject('formIns')
    //@ts-ignore
    const id = formIns.id
    let pluginName = formIns.getPluginName()
    const dragOptions = {
      swapThreshold: 1,
      group: {
        name: `er-Canves-${id}`,
      },
      parent: props.parent,
      plugins: [ControlInsertionPlugin(ER)],
      // ControlInsertion: true,
      [pluginName]: true,
    }
    const loadComponent = () => {
      let componentMap = {}
      watch(
        () => state.platform,
        () => {
          componentMap = {}
        }
      )
      return {
        findComponent(type, element) {
          let info = componentMap[type + element]
          if (!info) {
            info = componentMap[type + element] = defineAsyncComponent(() => {
              let el = null
              let el1
              try {
                el = import(`../${type}/${_.startCase(element)}/${state.platform}.vue`)
                el1 = import(`../${type}/${_.startCase(element)}/${state.platform}.tsx`)
              } catch (error) {
                console.log('加载部分组件出错') //
              }
              return el1 || el //
            }) //
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
        switch (element.type) {
          case 'grid':
            node = <LayoutGridLayout key={element.id} data={element} parent={props.data}></LayoutGridLayout>
            break
          case 'table':
            node = <LayoutTableLayout key={element.id} data={element} parent={props.data}></LayoutTableLayout>
            break
          case 'tabs':
            node = <LayoutTabsLayout key={element.id} data={element} parent={props.data}></LayoutTabsLayout>
            break
          case 'collapse':
            node = <LayoutCollapseLayout key={element.id} data={element} parent={props.data}></LayoutCollapseLayout>
            break
          case 'inline':
            node = <LayoutInlineLayout key={element.id} data={element} parent={props.data}></LayoutInlineLayout>
            break
          case 'subform':
            if (unref(isEditModel) || _.get(state.fieldsLogicState.get(element), 'visible', undefined) !== 0) {
              node = <LayoutSubformLayout key={element.id} data={element} parent={props.data}></LayoutSubformLayout>
            }
            break
          default:
            let formitem = formIns.items.find((item) => item.id === element.id)
            let typeProps = {}
            try {
              typeProps = formitem.getFormItemProps(element) || {} //
            } catch (error) {
              console.error('没有找到formitem') //
            } //
            const rules = formitem?.getValidateRoles() || [] //
            let TypeComponent = ''
            if (unref(isEditModel) || _.get(state.fieldsLogicState.get(element), 'visible', undefined) !== 0) {
              TypeComponent = load.findComponent('FormTypes', element.type)
              const params = {
                data: element,
                parent: props.data,
                key: element.id,
              }
              if (process.env.NODE_ENV === 'test') {
                params['data-field-id'] = `${element.id}`
              }
              if (unref(isPc)) {
                const formitem = typeProps?.formitem //
                const prop = formitem?.getField()
                // console.log(typeProps.value,'testProps')
                node = (
                  //@ts-ignore
                  <Selection hasWidthScale hasCopy hasDel hasDrag hasMask {...params}>
                    {element.type !== 'divider' ? (
                      //@ts-ignore
                      <el-form-item {...typeProps} prop={prop}>
                        <TypeComponent data={element} params={typeProps}></TypeComponent>
                      </el-form-item>
                    ) : (
                      <TypeComponent data={element} params={typeProps}></TypeComponent>
                    )}
                  </Selection>
                )
              } else {
                node = (
                  //@ts-ignore
                  <Selection hasWidthScale hasCopy hasDel hasDrag hasMask {...params}>
                    <TypeComponent data={element} params={typeProps}></TypeComponent>
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
