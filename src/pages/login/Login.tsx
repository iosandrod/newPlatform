import { defineComponent, reactive, ref } from 'vue'
import { erFormEditor } from '@ER/formEditor'
import buttonCom from '@/buttonGroup/buttonCom'
import tabCom from '@/buttonGroup/tabCom'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
import tableCom from '@/table/tableCom'
import { menuTConfig, menuTConfig1, tableConfig } from '@/table/tableData' //
import dropdownCom from '@/menu/dropdownCom'
import fieldCom from '@/menu/fieldCom'
import menuCom from '@/menu/menuCom'
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { ContextmenuItem } from '@/contextM'
import ContextmenuCom from '@/contextM/components/ContextmenuCom'
import formCom from '@ER/formCom'
import FConfigPanel from '@ER/formEditor/components/Panels/Config/components/fConfigPanel'
import pageCom, { getDefaultPageProps } from '@ER/pageCom'
import SelectCom from '@/select/selectCom'
import dialogCom from '@/dialog/dialogCom'
import { Dialog } from '@/dialog/dialog'
import { PageDesign } from '@ER/pageDesign'
import FormEditor from '@ER/formEditor/formEditor'
import { Button } from '@/buttonGroup/button'
import { system } from '@/system'
import codeEditorCom from '@/codeEditor/codeEditorCom'
import { VxeCheckbox } from 'vxe-pc-ui'
import checkboxCom from '@/checkbox/checkboxCom'
import { getDFConfig } from '@/table/colFConfig'
import uploadCom from '@/input/uploadCom'
import SearchDialog from '@/dialog/_dialogCom/searchDialog'
import inputCom from '@/input/inputCom'
import { tFConfig } from '@ER/formEditor/testData'
export default defineComponent({
  components: {
    inputCom, //
    uploadCom,
    codeEditorCom,
    buttonCom, //
    pageCom, //
    erFormEditor,
    tabCom,
    buttonGroupCom,
    tableCom,
    dropdownCom,
    fieldCom,
    menuCom,
    ContextmenuItem,
    ContextmenuCom,
    formCom,
    FConfigPanel,
    SelectCom,
    dialogCom,
    VxeCheckbox,
    checkboxCom,
  },
  setup(props) {
    const formConfig = {
      itemSpan: 12,
      items: [
        {
          field: 'email',
          label: '邮箱',
          required: true,
        },
        {
          field: 'password',
          label: '密码',
          required: true,
          password: true,
        },
        {
          field: 'test',
          type: 'stable',
          label: '表格', //
          span: 24, //
          options: {
            // showTable: true,
            tableConfig: {
              columns: [
                {
                  field: 'name',
                  title: '姓名',
                  editType: 'string', //
                }, //
                {
                  field: 'age',
                  title: '年龄',
                  editType: 'string', //
                },
              ],
            },
          },
        },
        {
          field: 'test1',
          type: 'select', //
          label: 'test1',
          options: {
            options: [
              {
                label: 'test1',
                value: 'test2',
              },
              {
                label: 'test13',
                value: 'test22',
              },
              {
                label: 'test4',
                value: 'test24',
              },
            ],
          },
        },
      ],
    }
    let style = { width: '400px', margin: '0 auto' }

    const formConfig1 = {
      items: [
        {
          field: 'height',
          label: '邮箱',
          required: true,
        },
        {
          field: 'width',
          label: '密码',
          required: true,
        },
      ],
    }
    let _data = reactive({
      height: 600,
      width: 300,
    }) //
    let _reg1 = ref('')
    let _reg2 = ref('')
    let _ins = null
    let tIns = ref()
    let testObj = { ins: null }
    let btn = new Button({})
    let _reg3 = (el) => {
      btn.registerRef('page', el)
    }
    let fn1 = async () => {
      // system.confirmForm({
      //   ...formConfig,//
      // })
      // let _ins: PageDesign = btn.getRef('page')
      // _ins
      //   .validate()
      //   .then(() => {})
      //   .catch(() => {
      //     console.log('报错了') //
      //   })
      let _d = await system.confirmTable({
        requiredValidate: true,
        validateFn: async (config) => {
          return '校验失败'
        },
        columns: [],
        data: [
          {
            a: 1,
          },
        ],
      }) //
      console.log(_d, 'testD') //
    }
    // let p = new PageDesign(getDefaultPageProps())
    let _data1 = Array(10000)
      .fill(null)
      .map((row) => {
        return {}
      })
    let d1 = reactive({ editType: 'date' })
    let show = ref(false)
    let pd = null
    system.createPageDesign('permissions').then((res) => {
      pd = res
      show.value = true //
    })
    return () => {
      if (show.value == false) {
        return null
      }
      let com0 = null //
      let com = null //
      com = <pageCom></pageCom> //
      // let com2 = <buttonCom fn={fn1}></buttonCom> //
      let com2 = <button onClick={fn1}>123123</button>
      // com = <pageCom ref={_reg3} isDesign={true}></pageCom> //
      com = (
        <div style={{ height: `${_data.height}px`, width: `100%` }}>
          <tableCom
            // {...tableConfig}
            {...menuTConfig} ////
            // treeConfig={null}
            contextItems={[
              {
                label: '添加菜单',
                fn: async (config) => {
                  console.log('添加菜单') //
                  console.log(config, 'testConfig') //
                },
              },
              {
                label: '添加子菜单', //
                fn: async () => {
                  console.log('添加子菜单') //
                },
              },
            ]}
            showGlobalSearch={true}
            enableDragColumn={true} //
            showHeaderButtons={true}
            // showControllerButtons={true}
            // tableState="edit"
          ></tableCom>
        </div>
      ) //
      com = null
      let _fConfig = getDFConfig(reactive({}), {
        editType: 'date',
      }) ////
      let _fConfig1 = tFConfig
      com = ( //
        <div class="w-full h-500">
          <formCom
            ref={_reg3}
            isDesign={false}//
            // {..._fConfig}
            {...{
              items: [
                {
                  field: 'height',
                  label: '邮箱',
                  type: 'sform', //
                  span: 24,
                  options: {
                    itemSpan: 12,
                    items: [
                      {
                        field: 'height',
                        label: '邮箱', //
                      },
                    ],
                    columnSelect: true, //
                    tableName: 'permissions', //
                  },
                  tabTitle: '权限',
                },
                {
                  field: 'width',
                  label: '密码',
                  span: 24,
                },
              ],
            }}
            {..._fConfig1} //
            data={d1} //
          ></formCom>
        </div>
      )
      // com = <SearchDialog pageDesign={pd}></SearchDialog>
      // com = <uploadCom></uploadCom>
      // com = <dialogCom ref={_reg2}></dialogCom>
      // com = <codeEditorCom></codeEditorCom>
      // com = <VxeCheckbox
      //   modelValue={true}
      //   onChange={(value) => {
      //   }}
      // ></VxeCheckbox>
      // com = (
      //   <checkboxCom modelValue={true} onChange={(value) => {
      //   }}></checkboxCom>
      // )//
      // com = (
      //   <div class="h-30">
      //     <inputCom columnSelect={true}></inputCom>
      //   </div>
      // )
      // com=<input type="checkbox" class='vxe-checkbox--input' onChange={(value) => {
      // }}></input>
      let _com = (
        <div
          style={{
            padding: '100px', //
            overflow: 'hidden', //
          }}
        >
          {com2}
          {com0}
          <div
            style={{
              height: '500px',
              width: '100%', //
            }}
          >
            {com}
          </div>
        </div>
      )
      return _com
    }
  },
})
