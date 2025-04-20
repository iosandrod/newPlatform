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
import pageCom from '@ER/pageCom'
import SelectCom from '@/select/selectCom'
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
    let btns = [
      {
        label: '按钮1',
      },
      
      {
        label: '按钮5',
        children: [
          {
            label: '按钮5-111',
          },
        ],
        items: [
          {
            label: '按钮5-222',
          },
          {
            label: '按钮5-333',
            items: [
              {
                label: '按钮5-444',
                disabled: true,
              }, //
            ],
          },
        ],
      },
    ]
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
    })
    let _data1 = reactive({
      value: '',
    })
    let _reg1=ref('')
    return () => {
      // let com0 = <formCom data={_data} {...formConfig1}></formCom>
      let com0 = null
      let com = <buttonGroupCom items={btns}></buttonGroupCom>
      // com = <erFormEditor isDesign={true} {...formConfig}></erFormEditor>
      // com = <d></d>
      com = <tableCom {...tableConfig}></tableCom> //
      // com = <menuCom mode="horizontal" items={btns} v-slots={{
      //   itemTitle: (item) => {
      //     return <div>123</div>
      //   },
      //   subItemTitle: (item) => {
      //     return <div>123456</div>
      //   }
      // }}></menuCom>
      // com = <d></d>
      // com = <testCom></testCom>
      // com=<ContextmenuItem>testCom</ContextmenuItem>
      // let com1 = <d></d>
      // com = <ContextmenuCom items={btns}></ContextmenuCom>
      let com1 = <buttonGroupCom items={btns}></buttonGroupCom>
      // com = (
      //   <dropdownCom
      //     modelValue={true}
      //     v-slots={{
      //       default: () => {
      //         return <div>default</div>
      //       },
      //       dropdown: (value) => {
      //         console.log('渲染了', value) //
      //         return (
      //           <div
      //             style={{ background: 'red', height: '100px', width: '100px' }}
      //           >
      //             123
      //           </div>
      //         )
      //       },
      //     }}
      //   ></dropdownCom>
      // )
      com = (
        <formCom
          itemSpan={24}
          items={[
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
          ]} //
        ></formCom> //
      )
      // com = <FConfigPanel></FConfigPanel>
      // com = <erFormEditor isDesign={true}></erFormEditor>
      // com=<d></d>

      com = <pageCom isDesign={false}></pageCom> ////
      com = (
        <div style={{ height: `${_data.height}px`, width: `100%` }}>
          <tableCom {...tableConfig}></tableCom>
        </div>
      ) //
      let com2 = <buttonCom onClick={() => {
        let _reg11:any = _reg1.value
        _reg11.focus()//
      }}></buttonCom> //
      // com = (
      //   <SelectCom
      //     ref={_reg1}
      //     modelValue={_data1.value}
      //     onChange={(value) => {
      //       let _value = value.value
      //       _data1.value = _value //
      //     }} //
      //     options={[
      //       { label: '123', value: 'abc' },
      //       { label: '456', value: 'feg' },
      //     ]}
      //   ></SelectCom>
      // )
      let _com = (
        <div
          style={{
            padding: '100px', //
          }}
        >
          {com2}
          {com0}
          {/* <erFormEditor isDesign={true} {...formConfig}></erFormEditor> */}
          {/* <buttonCom></buttonCom> */}
          {}
          {/* <tabCom>  </tabCom> */}
          {com}
          {/* {com1} */}
          {}
        </div>
      )
      return _com
    }
  },
})
