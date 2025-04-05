import { defineComponent, withDirectives } from 'vue';
import {
  ClickOutside as vClickOutside,
  ElMessage,
  ElDialog,
  ElScrollbar,
  ElContainer,
  ElHeader,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElButton,
} from 'element-plus';
import {
  defineProps,
  defineEmits,
  ref,
  reactive,
  computed,
  provide,
  getCurrentInstance,
  nextTick,
  onMounted,
  watch,
  defineExpose,
} from 'vue';
import fieldMenu from '@/menu/fieldCom';
import CanvesPanel from '@ER/formEditor/components/Panels/Canves';//
import ConfigPanel from '@ER/formEditor/components/Panels/Config/configPanel';
import DeviceSwitch from '@ER/formEditor/components/DeviceSwitch.vue';
import Icon from '@ER/icon';
import hooks from '@ER/hooks';
import utils from '@ER/utils'; 
import _ from 'lodash';
import defaultProps from '@ER/formEditor/defaultProps';
import generatorData from '@ER/formEditor/generatorData';
import { validate } from 'uuid';  
import { Form } from '@ER/form';
import fieldCom from '@/menu/fieldCom';
import { PageDesign } from './pageDesign';
export default defineComponent({
  directives: {
    vClickOutside,
  },
  components: {
    fieldMenu,
    fieldCom,
  },
  name: 'Everright-form-editor',
  props: {
    itemSpan: {
      type: Number,
      default: 6,
    },//
    fieldsPanelWidth: {
      type: String,
      default: '220px',
    },
    fieldsPanelDefaultOpeneds: {
      type: Array,
      default: () => ['defaultField', 'field', 'container'],
    },
    delHandle: {
      type: Function,
      default: () => { },
    },
    copyHandle: {
      type: Function,
      default: () => { },
    },
    inlineMax: {
      type: Number,
      default: 4,
    },
    isShowClear: {
      type: Boolean,
      default: true,
    },
    isShowI18n: {
      type: Boolean,
      default: true,
    },
    dragMode: {
      type: String,
      default: 'icon',
      validator: (value: any) => ['full', 'icon'].includes(value),
    },
    checkFieldsForNewBadge: {
      type: Function,
      default: () => { },
    },
    formIns: {
      type: Object,
    },
    ...defaultProps,
    isDesign: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: () => {
        return {}
       }
    },
  },
  emits: ['listener'],
  setup(props: any, { attrs, slots, emit, expose }) {

    const form = ref('');
    const previewPlatform = ref('pc');
    const previewLoading = ref(true);
    //
    let formIns: PageDesign = props.formIns as any;//
    if (formIns == null) { 
      formIns = new PageDesign(props);//
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
        data: props.data,
        validateStates: [],
        fields: [],
        Namespace: 'formEditor',
        logic: {},
        othersFiles: {},
        fieldsLogicState: new Map(),
      });
      formIns.setState(state);
    }//
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

    };//
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
    watch(() => props.data, (val) => {
      formIns.setData(val);//
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
    const addFieldData = formIns.addFieldData.bind(formIns);//
    const wrapElement = formIns.wrapElement.bind(formIns);
    const syncLayout = formIns.syncLayout.bind(formIns);
    const getLayoutDataByplatform = formIns.getLayoutDataByplatform.bind(formIns);
    const switchPlatform = formIns.switchPlatform.bind(formIns);
    const canvesScrollRef = ref('');//
    const fireEvent = (type, data) => {
      emit('listener', {
        type,//
        data,
      });
    };
    // const getData2 = formIns.getLayoutData.bind(formIns);
    const setData2 = formIns.setLayoutData.bind(formIns);
    // const clearData = formIns.clearData.bind(formIns);//
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
          // setTimeout(() => {
          //   EReditorPreviewRef.value.setData(getData());
          //   nextTick(() => {
          //     previewLoading.value = false;
          //   });
          // }, 500);
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
      () =>{return  state.fields.map((e) => e.id)},
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
    const setPreviewRef=(ref: any) => {
      EReditorPreviewRef.value = ref
    }
    return () => {
      let nextForm = formIns.nextForm; //
      let dialogCom = <ElDialog
        destroyOnClose
        fullscreen
        class='previewDialog'
        v-model={state.previewVisible}
        onClosed={() => (previewPlatform.value = 'pc')}
      >
        {{
          header: () => (
            <DeviceSwitch
              modelValue={previewPlatform.value}
              onUpdate:modelValue={(val) => handleOperation(7, val)}
            />
          ),
          default: () => (
            <ElScrollbar>
              
            </ElScrollbar>
          ),
        }}
      </ElDialog>
      let com = (
        <div class='h-full w-full'>
          {dialogCom}
          <ElContainer class='container' direction='vertical'>
            <ElContainer>
              {isFoldFields.value && <fieldCom></fieldCom>}
              <ElContainer class='container'>
              {isFoldFields.value&&  <ElHeader class='operation' style='display: flex;flex-derection: row;justify-content: space-between;'>
                  <div>
                    <Icon class='icon' icon='save' onClick={() => handleOperation(4)} />
                    {props.isShowClear && <Icon class='icon' icon='clear0' onClick={() => handleOperation(2)} />}
                    {slots['operation-left'] && slots['operation-left']()}
                  </div>
                  <div>
                    <DeviceSwitch modelValue={state.platform} onUpdate:modelValue={switchPlatform} />
                    <ElButton
                      onClick={() => {
                        formIns.runTestMethod()//
                      }}
                    >
                      测试
                    </ElButton>
                  </div>
                  <div>
                    {slots['operation-right'] && slots['operation-right']()}
                    {props.isShowI18n && (
                      <ElDropdown onCommand={(command) => fireEvent('lang', command)}>
                        <Icon class='icon' icon='language' />
                        {{
                          dropdown: () => (//
                            <ElDropdownMenu>
                              <ElDropdownItem command='zh-cn' disabled={lang.value === 'zh-cn'}>
                                中文
                              </ElDropdownItem>
                              <ElDropdownItem command='en' disabled={lang.value === 'en'}>
                                English
                              </ElDropdownItem>
                            </ElDropdownMenu>
                          ),
                        }}
                      </ElDropdown>
                    )}
                    <Icon class='icon' icon='preview' onClick={() => handleOperation(3)} />
                  </div>
                </ElHeader>}
                {isShow.value && withDirectives(<CanvesPanel data={state.store} />, [[vClickOutside, onClickOutside]])}
              </ElContainer>
              {isFoldConfig.value && <ConfigPanel />}
            </ElContainer>
          </ElContainer>
          {/* <Everright-form-editor></Everright-form-editor> */}
        </div>
      );
      if (nextForm != null) {
        com = <Everright-form-editor formIns={nextForm}></Everright-form-editor>;
      } //
      return com; //
    };
  },
});
