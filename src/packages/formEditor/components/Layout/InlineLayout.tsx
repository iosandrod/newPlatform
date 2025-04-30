import {
  defineComponent,
  resolveComponent,
  watch,
  useAttrs,
  unref,
  nextTick,
  inject,
} from 'vue'
import Selection from '@ER/formEditor/components/Selection/selectElement'
import LayoutDragGable, { dragGableWrap } from './DragGable'
import hooks from '@ER/hooks'
import utils from '@ER/utils'
import { FormEditorContext } from '@ER/type'
export default defineComponent({
  name: 'InlineLayout',
  props: {
    data: Object,
    parent: Array,
  },

  setup(props) {
    const { state, isPc, isEditModel } = hooks.useTarget()
    const ER: FormEditorContext = inject('Everright')
    const ns = hooks.useNamespace('InlineLayout') //
    watch(
      () => props.data.columns.length,
      (newVal, oldVal) => {
        if (!newVal) {
          props.data.context.delete()
        }
        if (newVal !== oldVal) {
          utils.syncWidthByPlatform(
            props.data.columns,
            ER.state.platform,
            ER.props.layoutType === 1,
          )
        }
      },
    )
    const dragOptions = {
      direction: 'horizontal',
    } //
    return () => {
      let _class = []
      let _class1 = []
      if (!unref(isEditModel)) {
        _class.push('flex flex-col')
        _class1.push('flex flex-col')
        let _parent = props.data.context.parent
        if (Array.isArray(_parent)) {
          let _index = _parent.findIndex((item) => item.id === props.data.id)
          if (_index == _parent.length - 1) {
            _class.push('flex-1')
            _class1.push('flex-1') //
          }
        } else {
          if (_parent?.type == 'tabsCol') {
            let list = _parent.list
            let _index = list.findIndex((item) => item.id === props.data.id)
            if (_index == list.length - 1) {
              _class.push('flex-1')
              _class1.push('flex-1') //
            }
          }
          if (_parent?.type == 'col') {
            let list = _parent.list
            let _index = list.findIndex((item) => item.id === props.data.id)
            if (_index == list.length - 1) {
              _class.push('flex-1')
              _class1.push('flex-1') //
            }
          }
        }
      }
      return (
        <div class={[ns.b(), ..._class1]}>
          <LayoutDragGable
            data-layout-type={'inline'}
            type={'inline'}
            {...dragOptions}
            class={[..._class1]}
            data={props.data.columns}
            parent={props.parent}
          />
        </div>
      )
    }
  },
})
