import { itemGroup } from '@/buttonGroup/buttonGroup'
import { defineComponent, toRaw } from 'vue'
import tabCom from '@/buttonGroup/tabCom'
import {
  ElButton,
  ClickOutside,
  ElMenu,
  ElMenuItem,
  ElSubMenu,
} from 'element-plus'
import { Button } from './button'
import MenuCom from '@/menu/menuCom'
import dropdownCom from '@/menu/dropdownCom'
import { VxeTable } from 'vxe-table'

export default defineComponent({
  name: 'buttonGroupCom',
  components: {
    dropdownCom,
    tabCom,
    MenuCom,
  },
  directives: {
    ClickOutside,
  },
  props: {
    items: {
      default: () => [],
    },
    _class: {
      type: Function,
    },
    parent: {
      type: Object,
    },
  },
  setup(props, { attrs, slots, emit }) {
    let group = new itemGroup(props, props._class as any)
    const ns = group.hooks.useNamespace('buttonGroupCom')
    const btnG = group.hooks.useNamespace('buttonMenuCom')
    const runBtnFn = (el: Button) => {
      el.runFn({
        parent: props.parent,
        button: el,
      })
    }
    return () => {
      let com = (
        <tabCom
          {...group.getTabProps()}
          height={25}
          v-slots={{
            item: (el: Button) => {
              let btn = el.config.button
              let com = (
                <ElButton
                  onClick={() => {
                    runBtnFn(btn)
                  }}
                  class={ns.b()}
                >
                  {btn.getLabel()}
                </ElButton>
              )
              if (btn.buttons.length > 0) {
                // console.log('render 1312312')//
                // let btnD = [btn.getSubData()] //
                // let btnD = [{ button: btn }] //
                // com = (
                //   <MenuCom
                //     popperClass="btnGClass"
                //     mode="horizontal"
                //     popperOffset={0}
                //     items={btnD} //
                //     v-slots={
                //       {
                //         // subItemTitle: (item) => {
                //         //   // const btn = item.config.button
                //         //   // return <ElButton>{btn.getLabel()}</ElButton> //
                //         // },
                //         // itemTitle: (item) => {
                //         //   // const btn = item.config.button
                //         //   // return <ElButton>{btn.getLabel()}</ElButton>
                //         // },
                //       }
                //     }
                //   ></MenuCom> //
                // )
                com = (
                  <div>
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
                  </div>
                )
              }
              return com
            },
          }}
        ></tabCom>
      )
      return com
    }
  },
})
