import { defineComponent, inject, ref, resolveComponent, unref } from 'vue'
import LayoutDragGable from '@ER/formEditor/components/Layout/DragGable'
import LayoutInlineLayout from '@ER/formEditor/components/Layout/InlineLayout'
import CompleteButton from '@ER/formEditor/components/CompleteButton'
import hooks from '@ER/hooks/index'
import _ from 'lodash'
import { ElMain } from 'element-plus'
import { Form } from '@ER/form'
import formBarBread from '@/bread/formBarBread'
export default defineComponent({
  name: 'Canves',
  inheritAttrs: false,
  customOptions: {},
  components: {
    formBarBread,
  },
  setup() {
    const ER: any = inject('Everright')
    const ns = hooks.useNamespace('Canves')
    const target = hooks.useTarget()
    const { state, setSelection, isEditModel, isPc } = target
    // console.log(target,'testTarget')//
    const handleClick = (e) => {
      ER.setSelection('root')
    }
    let formIns: Form = inject('formIns')
    const setFormRef = (ref: any) => {
      ER.form = ref
      formIns.registerRef('form', ref) //
    }
    return () => {
      let TagComponent: any = resolveComponent(
        unref(isPc) ? 'el-form' : 'van-form',
      )
      if (formIns.pageType !== 'form') {
        TagComponent = 'div' //
      } //
      const typeProps = hooks.useProps(state, state, unref(isPc), true)
      const Layout = (
        <LayoutDragGable
          data-layout-type={'root'}
          class={[unref(isEditModel) && ns.e('wrap'), 'h-full']}
          data={state.store}
          parent={state.store}
          isRoot
        ></LayoutDragGable>
      )
      let bar = null
      if (formIns.getShowFormBar()) {
        bar = (
          <div>
            <formBarBread></formBarBread>
          </div>
        )
      }
      let inCom = (
        <div class="h-full">
          {bar}
          <TagComponent
            class={['h-full']} //
            ref={setFormRef}
            onClick={unref(isEditModel) && handleClick}
            {...typeProps.value}
            model={formIns.data}
            rules={formIns.getValidateRules()}
          >
            {Layout}
          </TagComponent>
        </div>
      )
      let _inCom = (
        <div class={[ns.e('container')]}>
          <el-scrollbar ref={ER.canvesScrollRef}>
            <div class={[ns.e('subject')]}>{inCom}</div>
          </el-scrollbar>
        </div>
      )
      if (!isEditModel.value) {
        _inCom = inCom
      }
      let com = (
        <ElMain
          class={[
            ns.b(),
            isEditModel.value && ns.e('editModel'),
            !unref(isPc) && ns.e('mobile'),
            !unref(isPc) && ns.e(`mobile_layoutType${ER.props.layoutType}`),
          ]}
        >
          {_inCom}
        </ElMain>
      )
      return com //
    }
  },
})
