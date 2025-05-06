import { FormItem } from '@ER/formitem'
import { ElInput } from 'element-plus'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'InputPc',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: Object,
    params: Object,
  },
  setup(props) {
    const data = props.data
    const params = props.params
    const formitem: FormItem = params.formitem
    const _value = computed(() => {
      let config = formitem?.getBindConfig()
      return config
    })
    let registerRef = (el) => {
      formitem.registerRef('fieldCom', el) ////
    }
    return () => {
      let com = (
        <div class="h-full w-full flex items-center" style={{ minHeight: '36px' }}>
          <inputCom ref={registerRef} {..._value.value}></inputCom>
        </div>
      )
      return com //
    }
  },
})
