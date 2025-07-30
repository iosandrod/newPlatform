import inputCom from '@/input/inputCom'
import DropdownCom from '@/menu/dropdownCom'
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
      return _config
    })
    let registerRef = (el) => {
      formitem.registerRef('fieldCom', el) //
    }
    let tableName = formitem.getTableName() //
    let searchEnConfig = computed(() => {
      let sys = formitem.getSystem() //
      let d = sys.getTargetSearchEntity(tableName)
      return d
    }) //
    return () => {
      let com = ( //
        <div
          class="h-full w-full flex items-center"
          style={{ minHeight: '30px', height: '30px' }} //
        >
          <inputCom
            ref={registerRef}
            {..._value.value}
            isBaseinfo={true}
            baseinfoConfig={formitem.getBaseInfoConfig()}
            onConfirmTinyTable={async (config) => {
              let row = config.row
              await formitem.confirmTinyTableRow(row)
            }}
            v-slots={{
              buttons: () => {
                let com = (
                  <div
                    onClick={() => {
                      formitem.openBaseInfoDialog() //
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
      ) //
    
      let _com = com //
      return _com //
    }
  },
})
