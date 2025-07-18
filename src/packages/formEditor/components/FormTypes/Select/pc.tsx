import SelectCom from '@/select/selectCom'
import { FormItem } from '@ER/formitem'
import { ElInput, ElSelect } from 'element-plus'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'SelectPc',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: Object,
    params: Object,
  },
  setup(props) {
    const params = props.params
    const formitem: FormItem = params.formitem
    const bindConfig = computed(() => {
      let _config = formitem?.getBindConfig()
      return _config
    })
    return () => {
      let com = (
        <div class="w-full overflow-hidden h-full">
          <SelectCom {...bindConfig.value}></SelectCom>
        </div>
      )
      return com
    }
  },
})
