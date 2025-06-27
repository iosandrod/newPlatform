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
import pVue from '@/printTemplate/print.vue'
import auditVue from '@/audit/App.vue' //
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
export default defineComponent({
  components: {
    pVue,
    auditVue,
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
    console.log(_config123)
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
            // data={menuTConfig.data.slice(0, 1)} //
            // treeConfig={null}
            // rowHeight={100} //
            // treeConfig={null}
            // columns={[
            //   {
            //     field: 'id',
            //     title: 'ID',
            //     width: 250,
            //     calculateType: 'sum', //合计
            //     // editType: 'boolean',
            //     // required: true,
            //   },
            //   {
            //     field: 'email1',
            //     title: 'email',
            //     width: 250,
            //     sort: false,
            //     editType: 'boolean', //
            //     enableSelect: true, //
            //     baseinfoConfig: {
            //       tableName: 't_Item',
            //       bindColumns: [
            //         {
            //           targetKey: 'cInvCode', //
            //         },
            //       ],
            //       searchFields: ['cInvCode'], //
            //     },
            //   },
            // ]}
            contextItems={[
              {
                label: '添加菜单',
                fn: async (config) => {
                  // console.log('添加菜单') //
                  // console.log(config, 'testConfig') //
                  let p: Table = config.parent //
                  let curContextRow = p.curContextRow
                  let pid = curContextRow?.pid
                  if (pid == null) {
                    return
                  }
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
            treeConfig={null}
            // showControllerButtons={true}
            tableState="edit"
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
      //     <er-form
      //       platform="pc"
      //       // platform="pc"
      //       ref={_reg3}
      //       isDesign={true} //
      //       {...{
      //         items: [
      //           {
      //             field: 'height',
      //             label: '邮箱', //
      //             // type: 'dform', //
      //             type: 'string', //
      //             span: 24,
      //             options: {
      //               tableName: 'permissions',
      //               bindColumns: [
      //                 {
      //                   field: 'id',
      //                 },
      //               ],
      //               searchColumns: ['subject'], //
      //             },
      //             tabTitle: '权限',
      //           },
      //         ],
      //       }}
      //       // {..._fConfig1} //
      //       data={d1} //
      //     ></er-form>
      //   </div>
      // ) //
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
      // com = <pVue></pVue>
      // com = (
      //   <wangCom
      //     ref={(el) => {
      //       _reg2.value = el._instance//
      //     }}
      //   ></wangCom>
      // )
      // com = (
      //   <button
      //     onClick={() => {
      //       system.openWangEditorDialog({
      //         confirmFn: (dialog) => {
      //           console.log(dialog, 'testDialog') //
      //           console.log('confirmFn') //
      //         },
      //       }) //
      //     }}
      //   >
      //     123132
      //   </button>
      // )
      // com=<auditVue></auditVue>

      // let _fConfig11 = getDesignTableConfig(_item1)
      // com = <erForm {..._config123}></erForm> //
      com = withDirectives(
        <div
          class=""
          style={{
            height: '500px',
            width: '100%',
          }}
        ></div>,
        [
          [
            {
              mounted: (el) => {
                // import * as VTableGantt from '@visactor/vtable-gantt';
                function formatDate(date) {
                  const year = date.getFullYear()
                  const month = ('0' + (date.getMonth() + 1)).slice(-2)
                  const day = ('0' + date.getDate()).slice(-2)
                  return year + '-' + month + '-' + day
                }

                function createPopup({ date, content }, position, callback) {
                  // 创建弹窗元素
                  const popup = document.createElement('div')
                  popup.className = 'popup'

                  // 设置定位参数
                  popup.style.top = `${position.top}px`
                  popup.style.left = `${position.left}px`
                  popup.style.position = 'absolute'
                  popup.style.background = '#ccc'
                  popup.style.padding = '10px'
                  popup.style.zIndex = '10000'

                  // 日期显示格式化
                  const dateString =
                    typeof date === 'string' ? date : formatDate(date)

                  // 弹窗内容
                  popup.innerHTML = `
      <span class="close-btn" onclick="this.parentElement.remove()">×</span>
      <div>日期：${dateString}</div>
      <input type="text" placeholder="输入内容"  class="popup-input" value="${content}" />
      <button class="confirm-btn">确定</button>
  `

                  const confirmBtn = popup.querySelector('.confirm-btn')
                  confirmBtn.addEventListener('click', () => {
                    //@ts-ignore
                    const inputValue = popup.querySelector('.popup-input').value
                    popup.remove()
                    if (typeof callback === 'function') {
                      callback(inputValue)
                    }
                  })

                  // 添加弹窗到容器
                }

                const records = [
                  {
                    id: 1,
                    title: 'Software Development',
                    developer: 'liufangfang.jane@bytedance.com',
                    progress: 31,
                    priority: 'P0',
                  },
                  {
                    id: 2,
                    title: 'Scope',
                    developer: 'liufangfang.jane@bytedance.com',
                    progress: 60,
                    priority: 'P0',
                  },
                  {
                    id: 3,
                    title: 'Determine project scope',
                    developer: 'liufangfang.jane@bytedance.com',
                    progress: 100,
                    priority: 'P1',
                  },
                  {
                    id: 1,
                    title: 'Software Development',
                    developer: 'liufangfang.jane@bytedance.com',
                    progress: 90,
                    priority: 'P0',
                  },
                  {
                    id: 2,
                    title: 'Scope',
                    developer: 'liufangfang.jane@bytedance.com',
                    start: '07/14/2024',
                    end: '07/24/2024',
                    progress: 60,
                    priority: 'P0',
                  },
                  {
                    id: 3,
                    title: 'Determine project scope',
                    developer: 'liufangfang.jane@bytedance.com',
                    start: '2024-07-10',
                    end: '2024-07-14',
                    progress: 100,
                    priority: 'P1',
                  },
                  {
                    id: 1,
                    title: 'Software Development',
                    developer: 'liufangfang.jane@bytedance.com',
                    start: '2024-07-24',
                    end: '2024-08-04',
                    progress: 31,
                    priority: 'P0',
                  },
                  {
                    id: 2,
                    title: 'Scope',
                    developer: 'liufangfang.jane@bytedance.com',
                    start: '2024.07.06',
                    end: '2024.07.08',
                    progress: 60,
                    priority: 'P0',
                  },
                  {
                    id: 3,
                    title: 'Determine project scope',
                    developer: 'liufangfang.jane@bytedance.com',
                    start: '2024/07/09',
                    end: '2024/07/11',
                    progress: 100,
                    priority: 'P1',
                  },
                  {
                    id: 1,
                    title: 'Software Development',
                    developer: 'liufangfang.jane@bytedance.com',
                    start: '07.24.2024',
                    end: '08.04.2024',
                    progress: 31,
                    priority: 'P0',
                  },
                ]

                const columns = [
             
                  {
                    field: 'title',
                    title: 'title',
                    width: 200,
                    sort: true,
                  },
                  {
                    field: 'start',
                    title: 'start',
                    width: 150,
                    sort: true,
                  },
                  {
                    field: 'end',
                    title: 'end',
                    width: 150,
                    sort: true,
                  },
                  {
                    field: 'priority',
                    title: 'priority',
                    width: 100,
                    sort: true,
                  },

                  {
                    field: 'progress',
                    title: 'progress',
                    width: 200,
                    sort: true,
                  },
                ]
                const option = {
                  records,
                  taskListTable: {
                    columns: columns,
                    tableWidth: 400,
                    minTableWidth: 100,
                    maxTableWidth: 600,
                  },
                  resizeLineStyle: {
                    lineColor: 'green',
                    lineWidth: 3,
                  },

                  frame: {
                    verticalSplitLineMoveable: true,
                    outerFrameStyle: {
                      borderLineWidth: 2,
                      borderColor: 'red',
                      cornerRadius: 8,
                    },
                    verticalSplitLine: {
                      lineWidth: 3,
                      lineColor: '#e1e4e8',
                    },
                    verticalSplitLineHighlight: {
                      lineColor: 'green',
                      lineWidth: 3,
                    },
                  },
                  grid: {
                    // backgroundColor: 'gray',
                    verticalLine: {
                      lineWidth: 1,
                      lineColor: '#e1e4e8',
                    },
                    horizontalLine: {
                      lineWidth: 1,
                      lineColor: '#e1e4e8',
                    },
                  },
                  defaultHeaderRowHeight: 60,
                  defaultRowHeight: 40,
                  timelineHeader: {
                    verticalLine: {
                      lineWidth: 1,
                      lineColor: '#e1e4e8',
                    },
                    horizontalLine: {
                      lineWidth: 1,
                      lineColor: '#e1e4e8',
                    },
                    backgroundColor: '#EEF1F5',
                    colWidth: 60,
                    scales: [
                      {
                        unit: 'week',
                        step: 1,
                        startOfWeek: 'sunday',
                        format(date) {
                          return `Week ${date.dateIndex}`
                        },
                        style: {
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: 'red',
                          backgroundColor: '#EEF1F5',
                        },
                      },
                      {
                        unit: 'day',
                        step: 1,
                        format(date) {
                          return date.dateIndex.toString()
                        },
                        style: {
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: 'red',
                          backgroundColor: '#EEF1F5',
                        },
                      },
                    ],
                  },
                  minDate: '2024-10-01',
                  maxDate: '2024-10-15',
                  markLine: [
                    {
                      date: '2024-10-06',
                      content: '我的啊啊得的',
                      contentStyle: {
                        color: '#fff',
                        // fontSize: 40
                      },
                      style: {
                        lineWidth: 1,
                        lineColor: 'red',
                      },
                    },
                    {
                      date: '2024-10-08 8:00:00',
                      content: 'mrkLine(date)',
                      position: 'date',
                      contentStyle: {
                        color: '#fff',
                        // fontSize: 40
                      },
                      style: {
                        lineWidth: 1,
                        lineColor: 'blue',
                      },
                    },
                  ],
                  scrollStyle: {
                    visible: 'scrolling',
                  },
                  overscrollBehavior: 'none',
                  markLineCreateOptions: {
                    markLineCreatable: true,
                    markLineCreationHoverToolTip: {
                      position: 'top',
                      tipContent: '创建里程碑',
                      style: {
                        contentStyle: {
                          fill: '#fff',
                        },
                        panelStyle: {
                          background: '#14161c',
                          cornerRadius: 4,
                        },
                      },
                    },
                    markLineCreationStyle: {
                      fill: '#ccc',
                      size: 30,
                      iconSize: 12,
                      svg:
                        '<svg t="1741145302032" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2861" width="200" height="200"><path d="M967.68 558.08v-89.6H542.72V43.52h-87.04v424.96H30.72v89.6h424.96v422.4h87.04V558.08z" fill="" p-id="2862"></path></svg>',
                    },
                  },
                }

                const ganttInstance = new VTableGantt.Gantt(
                  el, //
                  option as any,
                )
                ganttInstance.on(
                  'click_markline_create',
                  ({ data, position }) => {
                    createPopup(
                      { date: data.startDate, content: '' },
                      position,
                      (value) => {
                        ganttInstance.addMarkLine({
                          date: formatDate(data.startDate),
                          content: value,
                          contentStyle: {
                            color: '#fff',
                          },
                          style: {
                            lineWidth: 1,
                            lineColor: 'red',
                          },
                        })
                      },
                    )
                  },
                )
                ganttInstance.on(
                  'click_markline_content',
                  ({ data, position }) => {
                    createPopup(
                      { date: data.date, content: data.content },
                      position,
                      (value) => {
                        ganttInstance.updateCurrentMarkLine({
                          date: data.date,
                          content: value,
                        })
                      },
                    )
                  },
                )
              },
            },
          ],
        ],
      )
      let _com = (
        <div
          class="h-full"
          style={{
            overflow: 'hidden', //
          }}
        >
          {com0}
          <div
            class="h-full w-full "
            style={
              {
                // padding: '100px',
              }
            }
          >
            {/* <button
              onClick={() => {
                console.log(_reg2.value, 'testReg2') //
              }}
            >
              测试1
            </button> */}
            {com}
          </div>
        </div>
      )
      return _com
    }
  },
})
