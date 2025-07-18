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
      // ER.form = ref
      formIns.registerRef('form', ref) //
    }
    return () => {
      let TagComponent: any = resolveComponent(
        unref(isPc) ? 'vxe-form' : 'van-form',
      )
      if (formIns.pageType !== 'form') {
        TagComponent = 'div' //
      } //

      // let typeProps = hooks.useProps(state, state, unref(isPc), true)
      //@ts-ignore
      /* 
         state: StateType,
    data,
    isPc = true,
    isRoot = false,
    specialHandling,
    t,
    ExtraParams,
      */
      let typeProps = hooks.useProps({
        isPc: unref(isPc),
        isEditModel: unref(isEditModel),
        isRoot: true,
        formIns: formIns,
        data: state,
        ExtraParams: {},
        state: state, //
      })
      let _class = []
      //如果是编辑
      if (!unref(isEditModel)) {
        _class.push('flex flex-col')
      }
      const Layout = (
        <LayoutDragGable
          data-layout-type={'root'}
          class={[unref(isEditModel) && ns.e('wrap'), 'h-full w-full overflow-x-hidden ', ..._class]}
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
      let rules = formIns.createFormRules()

      let inCom = (
        <div class="h-full w-full overflow-x-hidden overflow-y-auto">
          {/* {bar} */}
          <TagComponent
            customLayout={true}
            class={['h-full w-full flex flex-col']} //
            ref={setFormRef}
            onClick={unref(isEditModel) && handleClick}
            {...typeProps.value}
            model={formIns.data}
            rules={rules}
            data={formIns.getData()}
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
      let com = _inCom //
      return com //
    }
  },
})
