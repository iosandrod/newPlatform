import { defineComponent, reactive, ref, withDirectives } from 'vue'
import { erFormEditor } from '@ER/formEditor'
import buttonCom from '@/buttonGroup/buttonCom'
import tabCom from '@/buttonGroup/tabCom'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
import tableCom from '@/table/tableCom'
import { menuTConfig, menuTConfig1, tableConfig } from '@/table/tableData' //
import dropdownCom from '@/menu/dropdownCom'
import fieldCom from '@/menu/fieldCom'
import menuCom from '@/menu/menuCom'
import { dayjs, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
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
import selectCom from '@/select/selectCom'
import pVue from '@/printTemplate/print.vue'
// import auditVue from '@/audit/App.vue' //
import WangToolbar from '@/printTemplate/components/PageComponents/WangEditorVue/WangToolbar.vue'
import WangEditor from '@/printTemplate/components/PageComponents/WangEditorVue/WangEditor.vue'
import {
  toolBarConfig,
  editorConfig as _editorConfig,
  mode,
} from '@/printTemplate/components/config/editorConfig'
import wangCom from '@/wangEditor/wangCom'
import { Table } from '@/table/table'
import { PageDesignItem } from '@ER/pageItem'
import { getDesignTableConfig } from '@/table/tabFConfig'
import { MainPageDesign } from '@ER/mainPageDesign'
import * as VTableGantt from '@visactor/vtable-gantt' //
import {
  permissionTConfig,
  xeTableColumns,
  xeTableData,
} from '@/table/tableData1'
import ganttCom from '@/gantt/ganttCom'
import FlowCom from '@/logic/flowCom'
export default defineComponent({
  components: {
    pVue,
    // auditVue,
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
    wangCom,
    ganttCom,
  },
  setup(props) {
    let str = `2025-01-01 00:00`
    let d = dayjs(str, 'YYYY-MM-DD HH:mm', false) //
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
    let _item = new MainPageDesign({
      items: [
        {
          label: '123',
          field: '123',
          type: 'input',
        },
      ],
    })
    let _item1 = _item.items[0]
    // console.log(_item, 'testItem')
    let _config123 = getDesignTableConfig(_item1)
    let tConfig = {
      columns: xeTableColumns,
      data: xeTableData,
      tableState: 'edit',
      treeConfig: {
        id: 'id',
        parentId: 'pid', //
        root: '0',
      },
    } //
    return () => {
      if (show.value == false) {
        return null
      }
      let com0 = null //
      let com = null //
      com = <pageCom></pageCom> //
      let _fConfig = getDFConfig(reactive({}), {
        editType: 'date',
      }) ////

      com = (
        <div class="er-h-400 er-w-600">
          <erXeTable {...permissionTConfig}></erXeTable>
        </div>
      )
      com = (
        <selectCom
          options={[{ label: '123', value: '123' }]}
          allowCreate={true}
        ></selectCom>
      )

      com = (
        <div class="er-w-500">
          <ganttCom></ganttCom>
        </div>
      )
      com = <FlowCom></FlowCom>
      // com = <inputCom></inputCom>
      // com = (
      //   <erXeTable
      //     showGlobalSearch={true}
      //     {...tConfig}
      //     enableDragRow={true}
      //     treeConfig={null}
      //   ></erXeTable>
      // ) //
      let _com = (
        <div
          class="h-full"
          style={{
            overflow: 'hidden', //
          }}
        >
          {com0}
          <div
            class="h-full w-full flex justify-center"
            style={
              {
                // padding: '100px',
              }
            }
          >
            {com}
          </div>
        </div>
      )
      return _com
    }
  },
})
