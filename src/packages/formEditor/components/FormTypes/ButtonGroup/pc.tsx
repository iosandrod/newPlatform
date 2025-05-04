import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
import { FormItem } from '@ER/formitem'
import { ElInput } from 'element-plus'
import { computed, defineComponent } from 'vue' //
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
    return () => {
      let com = (
        <div class="w-full h-full bg-white" style={{ minHeight: '30px' }}>
          <ButtonGroupCom {..._value.value}></ButtonGroupCom>
        </div>
      )
      return com
    }
  }, //
}) //
