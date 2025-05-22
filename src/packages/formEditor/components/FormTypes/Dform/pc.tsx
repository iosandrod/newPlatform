import inputCom from '@/input/inputCom'
import FormCom from '@ER/formCom'
import { FormItem } from '@ER/formitem'
import { PageDesign } from '@ER/pageDesign'
import { PageDesignItem } from '@ER/pageItem'
import { ElInput } from 'element-plus'
import { computed, defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'DFormPc',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: Object,
    params: Object,
  },
  setup(props) {
    const params = props.params
    const formitem: PageDesignItem = params.formitem
    let fConfig = computed(() => {
      // debugger //
      let _config = formitem.getFormConfig() //
      return _config
    })
    //@ts-ignore
    let pageD: PageDesign = inject('pageDesign', {}) //
    let mainPage: PageDesign = inject('mainPageDesign', null) //
    const registerRef = (el) => {
      formitem.registerRef('fieldCom', el) //
    }
    const data = computed(() => {
      let _data = formitem.getdBindData()
      return _data
    })
    return () => {
      let _com = (
        <div class="h-full w-full" style={{ minHeight: '50px' }}>
          <FormCom ref={registerRef} {...fConfig.value} data={data.value}></FormCom>
        </div>
      )
      return _com
    }
  },
}) //
