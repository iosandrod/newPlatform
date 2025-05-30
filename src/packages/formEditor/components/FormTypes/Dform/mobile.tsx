import { FormItem } from '@ER/formitem';
import { ElInput } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputPc',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: Object,
    params: Object,
  },
  setup(props) {
    //
    const params = props.params;
    const formitem: FormItem = params.formitem;
    const bindConfig = formitem.getBindConfig();
    return () => {
      return <ElInput {...bindConfig.value}></ElInput>;
    };
  },
});
