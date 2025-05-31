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
import { VxeCheckbox, VxePager } from 'vxe-pc-ui'
import checkboxCom from '@/checkbox/checkboxCom'
import { getDFConfig } from '@/table/colFConfig'
import uploadCom from '@/input/uploadCom'
import SearchDialog from '@/dialog/_dialogCom/searchDialog'
import inputCom from '@/input/inputCom'
import { tFConfig } from '@ER/formEditor/testData'
import selectCom from '@/select/selectCom'
import pVue from '@/printTemplate/App.vue'
export default defineComponent({
  components: {
    pVue,
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
      await system.confirmMessageBox('报错了', 'error') //
    }
    // let p = new PageDesign(getDefaultPageProps())
    let _data1 = Array(10000)
      .fill(null)
      .map((row) => {
        return {} //
      }) // //
    let d1 = reactive({ editType: 'date' })
    let show = ref(true)
    let pd = null
    // system.createPageDesign('permissions').then((res) => {
    //   pd = res
    //   show.value = true
    // }) //
    let bind = ref('')
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
            {...tableConfig}
            // showRowSeriesNumber={false} //
            // {...menuTConfig} ////
            // treeConfig={null}
            columns={[
              {
                field: 'id',
                title: 'ID',
                width: 250,
                calculateType: 'sum', //合计
                // editType: 'boolean',
                // required: true,
              },
              {
                field: 'email1',
                title: 'email',
                width: 250,
                sort: false,
                editType: 'baseinfo', //
                baseinfoConfig: {
                  tableName: 't_Item',
                  bindColumns: [
                    {
                      targetKey: 'cInvCode', //
                    },
                  ],
                  searchFields: ['cInvCode'], //
                },
              },
            ]}
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
            ]} //
            showGlobalSearch={true}
            enableDragColumn={true} //
            showHeaderButtons={true}
            enableDragRow={true} //
            dragRowFn={(config) => {
              return true //
            }}
            // showControllerButtons={true}
            // tableState="edit"
          ></tableCom>
        </div>
      ) //
      // com = null
      let _fConfig = getDFConfig(reactive({}), {
        editType: 'date',
      }) ////
      let _fConfig1 = tFConfig
      // com = ( //
      //   <div class="w-full h-500">
      //     <formCom
      //       ref={_reg3}
      //       isDesign={false} //
      //       // {..._fConfig}
      //       {...{
      //         items: [
      //           {
      //             field: 'height',
      //             label: '邮箱', //
      //             type: 'baseinfo', //
      //             span: 24,
      //             options: {
      //               tableName: 'permissions',
      //               bindColumns: [
      //                 {
      //                   field: 'id',
      //                 }, //
      //               ],
      //             },
      //             tabTitle: '权限',
      //           },
      //           {
      //             field: 'width',
      //             label: '密码',
      //             span: 24,
      //           },
      //         ],
      //       }}
      //       // {..._fConfig1} //
      //       data={d1} //
      //     ></formCom>
      //   </div>
      // )
      // com = null //
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
      // com = (
      //   <tabCom
      //     items={[{ label: 'tab1' }, { label: 'tab2' }]}
      //     v-slots={{
      //       default: (item) => {
      //         return <div>{'测试123123'}</div> //
      //       },
      //     }}
      //   ></tabCom>
      // )
      // com = (
      //   <VxePager
      //     {...{
      //       pageSize: 100, //
      //       currentPage: 2,
      //       pageSizes: [
      //         {
      //           label: '10条每页',
      //           value: 10,
      //         },
      //         {
      //           label: '100条每页',
      //           value: 100,
      //         },
      //         {
      //           label: '500条每页',
      //           value: 500,
      //         },
      //         {
      //           label: '1000条每页',
      //           value: 1000,
      //         },
      //         {
      //           label: '5000条每页',
      //           value: 5000,
      //         },
      //         {
      //           label: '10000条每页',
      //           value: 10000,
      //         },
      //         {
      //           label: '全部',
      //           value: 0,
      //         }, //
      //       ],
      //     }}
      //   ></VxePager>
      // )
      // com = (
      //   <selectCom
      //     modelValue={bind.value}
      //     onChange={(value) => {
      //       console.log(value.value, 'testValue') //
      //       bind.value = value.value //
      //     }}
      //     multiple={true} //
      //     options={[
      //       {
      //         label: '123',
      //         value: '123',
      //       },
      //       {
      //         label: 'sfs',
      //         value: 'sfs', //
      //       },
      //       {
      //         label: 'sfs1',
      //         value: 'sfs1', //
      //       },
      //       {
      //         label: 'sfs2',
      //         value: 'sfs2', //
      //       },
      //     ]}
      //   ></selectCom>
      // )
      com = <pVue></pVue>
      let _com = (
        <div
          class='h-full'
          style={{
            overflow: 'hidden', //
          }}
        >
          {com0}
          <div class="h-full w-full" style={{}}>
            {com}
          </div>
        </div>
      )
      return _com
    }
  },
})
