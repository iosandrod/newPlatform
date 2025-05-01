import { defineComponent, reactive, ref } from 'vue'
import { erFormEditor } from '@ER/formEditor'
import buttonCom from '@/buttonGroup/buttonCom'
import tabCom from '@/buttonGroup/tabCom'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
import d from '../home/d.vue'
import tableCom from '@/table/tableCom'
import { tableConfig } from '@/table/tableData' //
import dropdownCom from '@/menu/dropdownCom'
import fieldCom from '@/menu/fieldCom'
import menuCom from '@/menu/menuCom'
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import testCom from '../home/Simple'
import { ContextmenuItem } from '@/contextM'
import ContextmenuCom from '@/contextM/components/ContextmenuCom'
import formCom from '@ER/formCom'
import FConfigPanel from '@ER/formEditor/components/Panels/Config/components/fConfigPanel'
import { Simple } from '../home/index copy'
import pageCom, { getDefaultPageProps } from '@ER/pageCom'
import SelectCom from '@/select/selectCom'
import dialogCom from '@/dialog/dialogCom'
import { Dialog } from '@/dialog/dialog'
import { PageDesign } from '@ER/pageDesign'
import FormEditor from '@ER/formEditor/formEditor'
import { Button } from '@/buttonGroup/button'
import { system } from '@/system'
export default defineComponent({
  components: {
    buttonCom, //
    pageCom, //
    erFormEditor,
    tabCom,
    buttonGroupCom,
    d, //
    tableCom,
    dropdownCom,
    fieldCom,
    menuCom,
    testCom,
    ContextmenuItem,
    ContextmenuCom,
    formCom,
    FConfigPanel,
    Simple,
    SelectCom,
    dialogCom,
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
    let fn1 = () => {
      // system.confirmForm({
      //   ...formConfig,//
      // })
      let _ins = btn.getRef('page')
      console.log(_ins) //
      _ins.initDefaultDForm() //
    }
    // let p = new PageDesign(getDefaultPageProps())
    let _data1 = Array(10000)
      .fill(null)
      .map((row) => {
        return {}
      })
    return () => {
      let com0 = null //
      let com = null
      com = <pageCom></pageCom> //
      // let com2 = <buttonCom fn={fn1}></buttonCom> //
      // com = <dialogCom ref={_reg2}></dialogCom>
      let com2 = <button onClick={fn1}>123123</button>
      com = <pageCom ref={_reg3}></pageCom> //
      com = (
        <div style={{ height: `${_data.height}px`, width: `100%` }}>
          <tableCom {...tableConfig}></tableCom>
        </div>
      ) //
      // com = (
      //   <div style={{ width: '400px' }}>
      //     <formCom {...formConfig}></formCom>
      //   </div>
      // )
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
