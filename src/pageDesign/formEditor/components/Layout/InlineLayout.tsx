import { defineComponent, resolveComponent, watch, useAttrs, defineAsyncComponent, unref, nextTick, inject } from 'vue'
import Selection from '@DESIGN/formEditor/components/Selection/selectElement'
import LayoutDragGable, { dragGableWrap } from './DragGable'
import hooks from '@DESIGN/hooks'
import utils from '@DESIGN/utils'
import { FormEditorContext } from '@DESIGN/type'
export default defineComponent({
  name: 'InlineLayout',
  props: {
    data: Object,
    parent: Array
  },

  setup(props) {
    const ER: FormEditorContext = inject('Everright')
    const ns = hooks.useNamespace('InlineLayout')
    watch(() => props.data.columns.length, (newVal, oldVal) => {
      if (!newVal) {
        props.data.context.delete()
      }
      if (newVal !== oldVal) {
        utils.syncWidthByPlatform(props.data.columns, ER.state.platform, ER.props.layoutType === 1)
      }
    })
    const dragOptions = {
      direction: 'horizontal'
    }
    return () => {
      return (
        <div
          class={[ns.b()]}>
          <LayoutDragGable
            data-layout-type={'inline'}
            class={''}
            type={'inline'}
            {...dragOptions}
            data={props.data.columns}
            parent={props.parent} />
        </div>
      )
    }
  }
})
