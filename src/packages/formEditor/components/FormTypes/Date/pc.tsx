import { FormItem } from '@ER/formitem';
import { ElDatePicker, ElInput } from 'element-plus';
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
    const params = props.params;
    const formitem: FormItem = params.formitem;
    const bindConfig = formitem?.getBindConfig();
    const ns = formitem.hooks.useNamespace('FormTypesDate_pc');
    return () => {
      return <ElDatePicker class={ns.b()} {...bindConfig?.value}></ElDatePicker>;
    };
  },
});
