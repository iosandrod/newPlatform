import inputCom from '@/input/inputCom'
import selectCom from '@/select/selectCom'
import SelectCom from '@/select/selectCom'
import { FormItem } from '@ER/formitem'
import { ElInput } from 'element-plus'
import { computed, defineComponent } from 'vue'
import { VxeColorPicker } from 'vxe-pc-ui'

export default defineComponent({
  name: 'InputPc',
  inheritAttrs: false,
  customOptions: {},
  components: {
    VxeColorPicker,
    inputCom,
    selectCom,
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
      let _config = formitem?.getBindConfig()
      return _config
    })
    let registerRef = (el) => {
      formitem.registerRef('fieldCom', el)
    } //
    return () => {
      let com = (
        <div
          class="h-full w-full flex items-center"
          style={{ minHeight: '36px', height: '36px' }} //
        >
          <VxeColorPicker ref={registerRef} {..._value.value}></VxeColorPicker>
        </div>
      ) //
      return com //
    }
  },
})
//
