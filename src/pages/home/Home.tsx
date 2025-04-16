import { defineComponent } from 'vue'
import erForm from '@ER/formCom'
import erFormEditor from '@ER/formEditor/formEditor'
import tableEditor from '@/table/tableCom'
import { formConfig } from '@ER/formEditor/testData'
import menuCom from '@/menu/menuCom'
import fieldCom from '@/menu/fieldCom'
import { fieldsConfig } from '@ER/formEditor/componentsConfig'
import { system } from '@/system'
export default defineComponent({
  components: {
    erForm,
    erFormEditor,
    tableEditor,
    menuCom,
    fieldCom,
  },
  setup() {
    const systemIns = system //
    const registerMenu = (el) => {
      systemIns.registerRef('leftMenu', el) //
    }
    console.log('系统的页面') //
    return () => {
      let leftMenu = <menuCom items={[]} ref={registerMenu}></menuCom>
      return <div class="">{leftMenu}</div>
    }
  },
})
