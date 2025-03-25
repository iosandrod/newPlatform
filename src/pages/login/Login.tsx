import { defineComponent } from 'vue'
import { erFormEditor } from '@ER/formEditor'
import buttonCom from '@/buttonGroup/buttonCom'
import tabCom from '@/buttonGroup/tabCom'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
import d from '../home/d.vue'
import tableCom from '@/table/tableCom'
import { tableConfig } from '@/table/tableData' //
export default defineComponent({
  components: {
    erFormEditor,
    buttonCom,
    tabCom,
    buttonGroupCom,
    d, //
    tableCom,
  },
  setup(props) {
    const formConfig = {
      itemSpan: 24,
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
    return () => {
      let com = (
        <buttonGroupCom
          items={[
            {
              label: '按钮1',
            },
            {
              label: '按钮2',
            },
            {
              label: '按钮3',
            },
            {
              label: '按钮4',
            },
            {
              label: '按钮5',
            },
          ].slice(0, 5)}
        ></buttonGroupCom>
      )
      com = <erFormEditor isDesign={true} {...formConfig}></erFormEditor>
      // com=<buttonGroupCom></buttonGroupCom>
      com = <d></d>
      let com1 = <d></d>
      com = <tableCom {...tableConfig}></tableCom>
      let _com = (
        <div style={{ marginLeft: '100px', height: '70%', width: '80%', overflow: '' }} class="h-full w-full">
          {/* <erFormEditor isDesign={true} {...formConfig}></erFormEditor> */}
          {/* <buttonCom></buttonCom> */}
          {}
          {/* <tabCom>  </tabCom> */}
          {com}
          {/* {com1} */}
        </div>
      )
      return _com
    }
  },
})
