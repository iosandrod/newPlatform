import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
import { FormItem } from '@ER/formitem'
import { PageDesign } from '@ER/pageDesign'
import { ElInput } from 'element-plus'
import { computed, defineComponent, inject } from 'vue' //
//
export default defineComponent({
  name: 'buttonGroupPc',
  inheritAttrs: false,
  customOptions: {},
  components: {
    ButtonGroupCom,
  },
  props: {
    data: Object,
    params: Object,
  },
  setup(props) {
    const data = props.data
    const params = props.params
    const formitem: FormItem = params.formitem
    let _value = computed(() => {
      let _config = formitem?.getPageButtonsProps()
      return _config
    })
    let mainPage: PageDesign = inject('mainPageDesign', null)
    let _context = (e) => {
      if (mainPage == null) {
        return
      } //
      mainPage.openContextMenu(e, formitem)
    }
    return () => {
      let com = (
        <div
          onContextmenu={_context}
          class="w-full h-full bg-white overflow-hidden flex items-center "
          style={{ minHeight: '30px' }}
        >
          <ButtonGroupCom {..._value.value}></ButtonGroupCom>
        </div>
      )
      // let com1=<div>mobile buttongroup</div>
      // return com1
      return com //
    }
  }, //
}) //
