import inputCom from '@/input/inputCom'
import tableCom from '@/table/tableCom'
import { FormItem } from '@ER/formitem'
import { ElInput } from 'element-plus'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'InputPc',
  inheritAttrs: false,
  customOptions: {},
  components: {
    inputCom,
    tableCom,
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
    let showTable = computed(() => {
      let stable = formitem.getShowTable()
      let b = Boolean(stable)
      return b
    })
    return () => {
      let com = (
        <div
          class="h-full w-full flex items-center"
          style={{ minHeight: '36px', height: '36px' }}
        >
          <inputCom
            ref={registerRef}
            {..._value.value}
            v-slots={{
              buttons: () => {
                let com = (
                  <div
                    onClick={() => {
                      //
                      formitem.openTableDialog() //
                    }}
                    class="h-full pointer"
                  >
                    <i class="vxe-icon-edit"></i>
                  </div>
                )
                return com //
              },
            }}
          ></inputCom>
        </div>
      )
      if (showTable.value == true) {
        let tableConfig = formitem.getTableConfig()
        com = (
          <div
            class="w-full "
            style={{
              minHeight: '200px',
            }}
          >
            <tableCom
              {...tableConfig}
              showHeaderButtons={true}
              data={formitem.getBindValue()}
            ></tableCom>
          </div>
        )
        // com = null //
      }
      return com //
    }
  }, //
}) //
