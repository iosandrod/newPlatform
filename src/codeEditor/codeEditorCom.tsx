import { defineComponent, onMounted, onUnmounted } from 'vue'
import CodeEditor from './codeEditor'
import { system } from '@/system'
import tableCom from '@/table/tableCom'
import tabCom from '@/buttonGroup/tabCom'

export default defineComponent({
  name: 'CodeEditorCom',
  //
  components: {
    tabCom, //
  },
  props: {
    language: {
      type: String,
      default: 'javascript',
    },
    modelValue: {
      type: String,
      default: '',
    }, //
    tableName: {
      type: String, //
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    let editor = new CodeEditor(props) //
    const register = (el) => {
      editor.registerRef('root', el)
    }
    const registerOuter = (el) => {
      editor.registerRef('out', el)
    }
    onMounted(() => {
      //
      editor.render()
    })
    onUnmounted(() => {
      editor.unmounted()
    })
    expose({ _instance: editor })
    let sys = system
    let mainDesign = sys.getDesignByTableName(props.tableName)
    let allCols = mainDesign?.getColumnSelectTreeData()
    let allMethods = mainDesign?.getMergeMethodsSelect() //--
    let infoConfig = null
    if (allCols != null) {
      infoConfig = {
        treeConfig: {
          id: 'id',
          parentId: 'pid', //
          rootId: 0, //
        },
        showRowSeriesNumber: false,
        showCheckboxColumn: false,
        expandAll: true, //
        columns: [
          {
            field: 'field',
            title: '字段',
            width: 150,
            tree: true,
            sort: true,
            type: 'string',
          },
          {
            field: 'title',
            title: '标题',
            width: 150, //
            sort: true,
            type: 'string',
          }, //
        ],
        data: allCols,
      }
    }
    let methodConfig = {
      data: allMethods,
      showHeaderButtons: true, //
      showHeaderDefaultButtons: false, //
      showRowSeriesNumber: false,
      buttons: [
        {
          label: '查看方法', //
          fn: async () => {},
        },
        {
          label: '添加方法',
          fn: async () => {}, //
        },
        {
          label: '编辑方法',
          fn: async () => {},
        },
      ],
      showCheckboxColumn: false, //
      tableState: 'edit',
      columns: [
        {
          field: 'name', //
          title: '方法名称',
          width: 250, //
          type: 'string', //
          editType: 'code',
        },
        {
          title: '方法描述',
          field: 'desc',
          width: 150,
          type: 'string',
        },
      ],
    }
    let tabConfig = {
      items: [
        {
          label: '字段参照',
          tableConfig: infoConfig,
        },
        {
          label: '方法参照',
          tableConfig: methodConfig, //
        },
      ],
    }
    return () => {
      let tCom = null
      if (infoConfig != null) {
        // tCom = (
        //   <div class="w-410 overflow-hidden">
        //     <erTable {...infoConfig}></erTable>
        //   </div>
        // )
        tCom = (
          <tabCom
            v-slots={{
              default: (item) => {
                let tableConfig = item.config.tableConfig //
                return <erTable {...tableConfig}></erTable>
              },
            }}
            {...tabConfig}
          ></tabCom>
        )
      }
      let com = (
        <div
          class="w-full h-full"
          style={{ position: 'relative', border: '1px solid black' }}
          ref={register}
        ></div>
      )
      let outCom = (
        <div
          class="w-full h-full flex"
          style={{ position: 'relative', minHeight: '100px' }}
          ref={registerOuter}
        >
          {com}
          <div class="w-600 h-full overflow-hidden">{tCom}</div>
        </div> //
      ) //
      return outCom //
    }
  },
})
