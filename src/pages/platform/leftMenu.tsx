import menuCom from '@/menu/menuCom'
import { System } from '@/system'
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'LeftMenu',
  components: {
    menuCom,
  },
  setup() {
    let systemIns: System = inject('systemIns')
    let registerMenu = (el) => {
      systemIns.registerRef('leftMenu', el) //
    } //
    systemIns.getHttp().registerEvent('navs changed', () => {
      systemIns.refreshMenuData() //
      //
    })
    return () => {
      let leftMenu = (
        <menuCom
          onContextmenu={(config) => {
            let event = config.event
            systemIns.openContextMenu(event)
          }}
          onItemClick={(item) => {
            systemIns.onMenuItemClick(item)
          }}
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
              let com = (
                <div
                // onClick={(config) => {
                //   console.log('我点击了这个东西') //
                // }}
                >
                  {navname}
                </div>
              ) //
              return com
            },
          }}
        ></menuCom>
      )
      return leftMenu
    }
  },
})
