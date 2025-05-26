import inputCom from '@/input/inputCom'
import selectCom from '@/select/selectCom'
import SelectCom from '@/select/selectCom'
import { FormItem } from '@ER/formitem'
import { ElInput } from 'element-plus'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'InputPc',
  inheritAttrs: false,
  customOptions: {},
  components: {
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
      console.log(_config, 'test_config132312') //
      return _config
    })
    let registerRef = (el) => {
      formitem.registerRef('fieldCom', el)
    }
    let isColumnSelect = computed(() => {
      let s = formitem.getIsColumnSelect()
      return s
    }) //
    return () => {
      let com = (
        <div
          class="h-full w-full flex items-center"
          style={{ minHeight: '36px', height: '36px' }} //
        >
          <inputCom ref={registerRef} {..._value.value}></inputCom>
        </div>
      ) //
      let _com = null
      if (isColumnSelect.value == true) {
        //
        _com = (
          <SelectCom
            {..._value.value}
            options={formitem.getColumnSelectOptions()}
            onChange={(config) => {
              // debugger//
              let value = config.value
              formitem.updateBindData({ value }) //
            }}
          ></SelectCom>
        )
      } else {
        _com = com
      }
      return _com //
    }
  },
})
