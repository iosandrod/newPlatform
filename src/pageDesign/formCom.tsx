import { nextTick, defineComponent, onMounted, onUnmounted, ref, withDirectives, provide } from 'vue';
import preview from '@DESIGN/formEditor/preview';
import editor from '@DESIGN/formEditor/pageDesign';
import { Form } from './form';
import {} from 'process';
export default defineComponent({
  components: {
    preview,
    editor,
  },
  props: {
    formConfig: {
      type: Object,
    },
  },
  setup(props, { slots }) {
    //子表单
    let fIns = new Form(props.formConfig);
    const registerForm = (el) => {
      if (el == null) {
        fIns.unregisterRef('form');
      } else {
        fIns.registerRef('form', el);
      }
    }; //
    onMounted(() => {
      nextTick(() => {
        fIns.onMounted(); //
      });
    });
    provide('formIns', fIns);
    onUnmounted(() => {
      fIns.onUnmounted(); //
    });
    return () => {
      //   let com = <preview isShowCompleteButton={false} ref={registerForm} formIns={fIns}></preview>;
      let com = <editor></editor>;
      return com;
    };
  },
});
