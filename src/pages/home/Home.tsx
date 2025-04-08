import { defineComponent } from 'vue';
import erForm from '@ER/formCom';
import erFormEditor from '@ER/formEditor/formEditor';
import tableEditor from '@/table/tableCom';
import { formConfig } from '@ER/formEditor/testData';
import menuCom from '@/menu/menuCom';
import fieldCom from '@/menu/fieldCom';
import { fieldsConfig } from '@ER/formEditor/componentsConfig';
export default defineComponent({
  components: {
    erForm,
    erFormEditor,
    tableEditor,
    menuCom,
    fieldCom,
  },
  setup() {
    // let _config = JSON.parse(JSON.stringify(formConfig))
    return () => {
      // return <pageDesign></pageDesign>
      // let com = <erFormEditor></erFormEditor>;
      // return com;
      // return <tableEditor></tableEditor>;

      // return <erFormEditor></erFormEditor>;
      // return <menuCom></menuCom>
      // return <erForm formConfig={formConfig}></erForm>;
      // return <fieldCom></fieldCom>
      return <erFormEditor ></erFormEditor>;
    };
  },
});
