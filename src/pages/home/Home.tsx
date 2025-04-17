import { defineComponent, provide } from 'vue'
import erForm from '@ER/formCom'
import erFormEditor from '@ER/formEditor/formEditor'
import tableEditor from '@/table/tableCom'
import { formConfig } from '@ER/formEditor/testData'
import menuCom from '@/menu/menuCom'
import fieldCom from '@/menu/fieldCom'
import { fieldsConfig } from '@ER/formEditor/componentsConfig'
import { system } from '@/system'
import tabCom from '@/buttonGroup/tabCom'
export default defineComponent({
  components: {
    erForm,
    erFormEditor,
    tableEditor,
    menuCom,
    fieldCom, //
    tabCom,
  },
  setup() {
    const systemIns = system //
    const registerMenu = (el) => {
      systemIns.registerRef('leftMenu', el) //
    }
    const ns = systemIns.hooks.useNamespace('Home')
    const fn = async () => {
      let menuData = await systemIns.getMenuData()
      let menuData1 = await systemIns.getMenuData() //
    }
    fn()
    provide('systemIns', systemIns) //
    return () => {
      let leftMenu = (
        <menuCom
          items={systemIns.getMenuItems()}
          ref={registerMenu}
          showSearch={true}
          searchFn={(config) => {
            let value = config.value
            let item = config.item
            let _config = item.config.navname //
            let reg = new RegExp(value, 'gi') //
            let bool = false
            let tableName = item.config.tableName
            if (reg.test(_config)) {
              bool = true
            }
            if (reg.test(tableName)) {
              bool = true
            }
            return bool //
          }}
          v-slots={{
            subItemTitle: (item) => {
              let config = item.config
              let navname = config.navname
              return <div>{navname}</div>
            },
            itemTitle: (item) => {
              let config = item.config
              let navname = config.navname
              let com = <div>{navname}</div> //
              return com
            },
          }}
        ></menuCom>
      )
      let tableTab = (
        <tabCom
          height={30}
          items={systemIns.getTabItems()}
          v-slots={{
            item: (item) => {
              return (
                <div class="home-tab-item">
                  <div class="home-tab-item-label">{item.getLabel()}</div>
                </div>
              ) //
            },
          }}
        ></tabCom>
      )
      return (
        <div
          class={ns.b()}
          style={{ display: 'flex', width: '100vw', height: '100vh' }}
        >
          <div style={{ width: '300px', height: '100%' }}>{leftMenu}</div>
          <div class="flex flex-col flex-1 h-full bg-red">
            <div class="w-full bg-white tab-line">{tableTab}</div>
          </div>
        </div>
      )
    }
  },
})
