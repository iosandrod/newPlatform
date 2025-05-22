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
  components: {
    inputCom,
    FormCom,
  }, //
  props: {
    data: Object,
    params: Object,
  },
  setup(props) {
    const params = props.params
    const formitem: PageDesignItem = params.formitem

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
    let _value = computed(() => {
      //
      // debugger //
      let _config = formitem?.getBindConfig()
      return _config
    }) //
    return () => {
      let _com = (
        <div class="h-full w-full" style={{ minHeight: '30px' }}>
          <inputCom
            v-slots={{
              buttons: () => {
                let com = (
                  <div
                    onClick={() => {
                      formitem.openSFormDialog()
                    }}
                    class="h-full pointer"
                  >
                    <i class="vxe-icon-edit"></i>
                  </div>
                )
                return com
              },
            }}
            ref={registerRef}
            {..._value.value}
          ></inputCom>
        </div>
      )
      return _com
    }
  },
}) //
