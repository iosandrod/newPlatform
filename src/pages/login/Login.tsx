import { defineComponent } from 'vue'
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
export default defineComponent({
  components: {
    erFormEditor,
    buttonCom,
    tabCom,
    buttonGroupCom,
    d, //
    tableCom,
    dropdownCom,
    fieldCom,
    menuCom,
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
        children: [
          {
            label: '按钮5-111',
          },
        ],
      },
    ]
    return () => {
      let com = <buttonGroupCom items={btns.slice(0, 5)}></buttonGroupCom>
      // com = <erFormEditor isDesign={true} {...formConfig}></erFormEditor>
      // com = <d></d>
      // com = <tableCom {...tableConfig}></tableCom>
      // com = <menuCom mode="horizontal" items={btns} v-slots={{
      //   itemTitle: (item) => {
      //     return <div>123</div>
      //   },
      //   subItemTitle: (item) => {
      //     return <div>123456</div>
      //   }
      // }}></menuCom>
      com = (
        <ElMenu style={{}} mode="horizontal">
          <ElSubMenu 
            index="2"
            v-slots={{
              title: () => <span>待审核</span>,
              default: () => {
                let arr = [
                  <ElMenuItem index="1">处理中</ElMenuItem>,
                  <ElMenuItem index="2-1">选项1</ElMenuItem>,
                  <ElMenuItem index="2-2">选项2</ElMenuItem>,
                  <ElMenuItem index="2-3">选项3</ElMenuItem>,
                ]
                return arr
              },
            }}
          ></ElSubMenu>
        </ElMenu>
      )
      // let com1 = <d></d>
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
      let _com = (
        <div
          style={{
            marginTop: '100px',
            marginLeft: '100px',
            // height: '700px',
            // width: '700px',
            // overflow: '',
            // transform: 'translate(10px, 400px)',
          }}
        >
          {/* <erFormEditor isDesign={true} {...formConfig}></erFormEditor> */}
          {/* <buttonCom></buttonCom> */}
          {}
          {/* <tabCom>  </tabCom> */}
          {com}
          {com1}
        </div>
      )
      return _com
    }
  },
})
