import { defineComponent, inject } from 'vue';
import { defineProps, ref, reactive, computed, provide, getCurrentInstance, watch, nextTick, onMounted } from 'vue';
import CanvesPanel from '@ER/formEditor/components/Panels/Canves/index';
import hooks from '@ER/hooks';
import utils from '@ER/utils';
import _ from 'lodash';
import defaultProps from './defaultProps';
import { ElMessage } from 'element-plus';
import { showNotify } from 'vant';
import { defineExpose } from 'vue';
import { Form } from '@ER/form';
export default defineComponent({
  name: 'Everright-form-preview',
  props: {
    ...defaultProps, formIns: {
      type: Object
    }
  },
  setup(props: any, { emit, expose, slots }) {
    const form = ref('');
    const previewPlatform = ref('pc');
    const previewLoading = ref(true);

    let formIns: Form = props.formIns as any;
    // debugger//
    if (formIns == null) {
      formIns = new Form(props);
    } else {
    }
    provide('formIns', formIns);
    let layout = formIns.layout;
    let _state = formIns.state
    let state = _state
    if (_state == null) {
      state = reactive({
        validate: null as any,
        store: [],
        selected: {},
        mode: 'edit',
        platform: 'pc',
        children: [],
        //@ts-ignore
        config: props.globalConfig,
        previewVisible: false,
        widthScaleLock: false,
        data: {},
        validateStates: [],
        fields: [],
        Namespace: 'formEditor',
        logic: {},
        othersFiles: {},
        fieldsLogicState: new Map(),
      });
      formIns.setState(state);
    }
    const isFoldFields = computed({
      get: () => {
        return formIns.isDesign;
      },
      set: (val) => {
        formIns.setCurrentDesign(val);
      },
    });
    const isFoldConfig = computed({
      get: () => {
        return formIns.isDesign;
      },
      set: (val) => {
        formIns.setCurrentDesign(val);
      },
    });
    //@ts-ignore 
    state.validator = (target, fn) => {

    };
    const { t, lang } = hooks.useI18n(props);
    formIns.lang = lang
    formIns.t = t
    const EReditorPreviewRef = ref<any>('');
    const isShow = computed({
      get: () => {
        return formIns.isShow
      },
      set: (val) => {
        formIns.isShow = val
      },
    })
    const isShowConfig = computed({
      get: () => {
        return formIns.isShowConfig
      },
      set: (val) => {
        formIns.isShowConfig = val
      },
    });
    let setSelection = formIns.setSelection.bind(formIns);//
    setSelection(state.config);
    const addField = formIns.addField.bind(formIns);
    const delField = formIns.delField.bind(formIns);
    const addFieldData = formIns.addFieldData.bind(formIns);
    /* 
     
    */
    const wrapElement = formIns.wrapElement.bind(formIns);
    // setTimeout(() => {
    //   setData2(JSON.parse(JSON.stringify(testData1))); //
    // }, 100); 
    const syncLayout = formIns.syncLayout.bind(formIns);
    const getLayoutDataByplatform = formIns.getLayoutDataByplatform.bind(formIns);
    const switchPlatform = formIns.switchPlatform.bind(formIns);
    const canvesScrollRef = ref('');
    const fireEvent = (type, data) => {
      emit('listener', {
        type,
        data,
      });
    };
    const getData2 = formIns.getLayoutData.bind(formIns);
    const setData2 = formIns.setLayoutData.bind(formIns);
    const clearData = formIns.clearData.bind(formIns);
    const getData = formIns.getLayoutData.bind(formIns)
    const setData = setData2;
    expose({
      form,
      switchPlatform(platform) {
        switchPlatform(platform);
      },
      setData,
      getData,
    });
    const handleOperation = (type, val?: any) => {
      switch (type) {
        case 1:
          break;
        case 2:
          // state.store = []
          layout.pc = [];
          layout.mobile = [];
          state.fields.splice(0);
          state.store.splice(0);
          state.data = {};
          setSelection('root');
          break;
        case 3:
          state.previewVisible = true;
          previewLoading.value = true;
          nextTick(() => {
            EReditorPreviewRef.value.setData(getData());
            nextTick(() => {
              previewLoading.value = false;
            });
          });
          break;
        case 4:
          fireEvent('save', getData());
          break;
        case 7: 
          previewLoading.value = true;
          previewPlatform.value = val;

          EReditorPreviewRef.value.switchPlatform(val);
          EReditorPreviewRef.value.setData(getData());
          nextTick(() => {
            nextTick(() => {
              previewLoading.value = false;
            });
          });
          break;
      }
    };
    watch(
      () => state.fields.map((e) => e.id),
      (newV, old) => {
        const deleteFields = old.filter((item) => !newV.includes(item));
        const addFields = newV.filter((item) => !old.includes(item));
        for (const delField of deleteFields) {
          //
          formIns.delFormItem(delField);
        }
        for (const addField of addFields) {
          let field = state.fields.find((e) => e.id === addField);
          formIns.addFormItem(field); //
        }
      }
    );
    watch(
      () => state.selected,
      (newVal) => {
        fireEvent('changeParams', _.cloneDeep(newVal));
      },
      {
        deep: true,
        immediate: true,
      }
    );
    const onClickOutside = () => { };
    watch(
      () => {
        return state.store;
      },
      (newValue) => { },
      {
        deep: true,
      }
    );
    const eve = {
      formIns: formIns,
      state,
      setSelection,
      props,
      wrapElement,
      delField,
      addField, //
      switchPlatform,
      addFieldData,
      canvesScrollRef,
      fireEvent,
      getData,
      form,
    }; //
    provide('Everright', eve);
    expose(formIns);//
    return () => {
      if (state.store.length === 0) return null
      return <CanvesPanel ></CanvesPanel>;
    };
  },
});
