import inputCom from '@/input/inputCom'
import { FormItem } from '@ER/formitem'
import { ElInput } from 'element-plus'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'InputPc',
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
    })
    let registerRef = (el) => {
      formitem.registerRef('fieldCom', el)
    }
    return () => {
      let com = (
        <div
          class="h-full w-full flex items-center"
          style={{ minHeight: '30px' }}
        >
          <inputCom
            ref={registerRef}
            {..._value.value}
            v-slots={{
              buttons: () => {
                let com = (
                    <div
                      onClick={() => {
                        formitem.openCodeDialog() //
                      }}
                      class="h-full pointer"
                    >
                      <i class="vxe-icon-edit"></i>
                    </div>
                  )
                return com
              },
            }}
          ></inputCom>
        </div>
      )
      return com //
    }
  }, //
}) //
