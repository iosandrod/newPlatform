import inputCom from '@/input/inputCom'
import UploadCom from '@/input/uploadCom'
import { FormItem } from '@ER/formitem'
import { ElInput } from 'element-plus'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'imagePc',
  inheritAttrs: false,
  customOptions: {},
  components: {
    inputCom,
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
    }) //
    let registerRef = (el) => {
      formitem.registerRef('fieldCom', el)
    }
    return () => {
      let com = (
        <div class="h-full w-full flex justify-center">
          <UploadCom
            {..._value.value}
            onChange={(config) => {
              formitem.updateBindData(config)
            }}
          ></UploadCom>
        </div>
      )
      return com //
    }
  }, //
}) //
