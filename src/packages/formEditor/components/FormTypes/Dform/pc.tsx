import inputCom from '@/input/inputCom'
import FormCom from '@ER/formCom'
import { FormItem } from '@ER/formitem'
import { PageDesign } from '@ER/pageDesign'
import { PageDesignItem } from '@ER/pageItem'
import { ElInput } from 'element-plus'
import { computed, defineComponent, inject, onMounted } from 'vue'

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
    let tableName = null //
    if (mainPage != null) {
      tableName = mainPage.getTableName() //
    }
    let itemTName = formitem.getOptions().tableName
    onMounted(() => {
      let outCom :HTMLDivElement= formitem.getRef('fieldOutCom')
      if(outCom == null) return
      // console.log(outCom, 'outCom')
      // let bound = outCom.getBoundingClientRect()
      // console.log(bound, 'bound')//
    })
    return () => {
      let _com = (
        <div
          class="h-full w-full"
          ref={(el) => {
            formitem.registerRef('fieldOutCom', el)
          }}
          style={{ minHeight: '36px' }}
        >
          <FormCom
            ref={registerRef}
            {...fConfig.value}
            disabled={formitem.getFormDisabled({
              tableName,
            })}
            disabledFn={(config) => {
              let field = config.field
              if (itemTName == tableName) {
                //主页面表单
                if (mainPage != null) {
                  let cols = mainPage.getTableConfig().columns || []
                  let col = cols.find((col) => col.field == field)
                  let addDisabled = col?.addDisabled
                  let editDisabled = col?.editDisabled
                  let pageEditState = mainPage.tableState
                  if (pageEditState == 'add') {
                    if (addDisabled == 1) {
                      return true
                    }
                  } else if (pageEditState == 'edit') {
                    if (editDisabled == 1) {
                      return true
                    }
                  }
                }
              }
            }} //
            data={data.value}
          ></FormCom>
        </div>
      )
      return _com
    }
  },
}) //
