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
import { Form } from '@ER/form'
import _ from 'lodash'
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
    let formIns: Form = inject('formIns')
    let store = formIns.state.store
    let parent = props.parent
    let show = true
    if (store == parent) {
      // console.log(props.data, '根部的inline') //
      let columns = props.data.columns
      if (columns.length == 1 && columns[0].type != 'grid') {
        // debugger //
        let _d = _.cloneDeep(props.data) //
        let el1 = formIns.wrapElement(_d, false, false, false, true) //
        let span = props?.data?.columns?.[0]?.span
        if (typeof span == 'number') {
          if (el1?.columns?.[0]?.columns?.[0]?.options) {
            el1.columns[0].columns[0].options.span = span //
          }
        }
        if (formIns.isDesign == false) {
          if (el1?.columns?.[0]?.columns?.[0]?.options) {
            el1.columns[0].columns[0].options.span = 24 //
          }
        }
        let index = parent.indexOf(props.data)
        props.data.context.delete()
        parent.splice(index, 0, el1) //
        utils.addContext({ node: el1, parent: parent, form: formIns }) //
        show = false
      }
    }
    watch(
      () => props.data.columns.length,
      (newVal, oldVal) => {
        if (!newVal) {
          props.data.context.delete()
        }
        // if (newVal !== oldVal) {
        //   utils.syncWidthByPlatform(
        //     props.data.columns,
        //     ER.state.platform,
        //     ER.props.layoutType === 1,
        //   )
        // }
      },
    )
    const dragOptions = {
      direction: 'horizontal',
    } //
    return () => {
      if (show == false) {
        return null
      } //
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
        <div class={[ns.b(), ..._class1,'min-h-7']}>
          <LayoutDragGable
            data-layout-type={'inline'}
            type={'inline'}
            {...dragOptions}
            class={[..._class1,'min-h-7']}
            data={props.data.columns}
            parent={props.parent}
          />
        </div>
      )
    }
  },
})
