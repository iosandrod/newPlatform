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
  import utils from '@ER/utils'
  import DragGable from '@ER/vueDraggable/vuedraggable'
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
export default  defineComponent({
    inheritAttrs: false,
    name: 'customDragGable',
    customOptions: {},
    components: {
      DragGable,
    },
    setup(props) {
      const { isEditModel } = hooks.useTarget()
      return () => {
        const attrs: any = useAttrs()
        let node = ''
        if (unref(isEditModel)) {
          node = <dragGable {...attrs}>{useSlots()}</dragGable>
        } else {
          const tag = isHTMLTag(attrs.tag)
            ? attrs.tag
            : resolveComponent(attrs.tag)
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