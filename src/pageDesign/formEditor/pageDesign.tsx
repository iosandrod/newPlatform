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
import FieldsPanel from '@DESIGN/formEditor/components/Panels/Fields';
import CanvesPanel from '@DESIGN/formEditor/components/Panels/Canves';
import ConfigPanel from '@DESIGN/formEditor/components/Panels/Config/configPanel';
import DeviceSwitch from '@DESIGN/formEditor/components/DeviceSwitch.vue';
import ErFormPreview from './preview';
import Icon from '@DESIGN/icon';
import hooks from '@DESIGN/hooks';
import utils from '@DESIGN/utils';
import _ from 'lodash';
import defaultProps from './defaultProps';
import generatorData from './generatorData';
import { staticData, testData1 } from './testData';
import { validate } from 'uuid';
import { Form } from '@DESIGN/form';
export default defineComponent({
  directives: {
    vClickOutside,
  },
  name: 'Everright-form-editor',
  props: {
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
      default: () => {},
    },
    copyHandle: {
      type: Function,
      default: () => {},
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
      default: () => {},
    },
    formIns: {
      type: Object,
    },
    ...defaultProps,
  },
  emits: ['listener'],
  setup(props: any, { attrs, slots, emit, expose }) {
    const layout = {
      pc: [],
      mobile: [],
    };
    const form = ref('');
    const previewPlatform = ref('pc');
    const previewLoading = ref(true);

    let formIns = props.formIns;
    // debugger//
    if (formIns == null) {
      formIns = new Form({});
    } else {
    }
    provide('formIns', formIns);
    const state = reactive({
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
    });
    const isFoldFields = ref(true);
    const isFoldConfig = ref(true);
    //@ts-ignore
    state.validator = (target, fn) => {
      if (target) {
        const count = _.countBy(state.validateStates, 'data.key');
        const newValue = target.key.trim();
        if (utils.isNull(newValue)) {
          _.find(state.validateStates, { data: { key: target.key } }).isWarning = true;
          fn && fn(0);
          return false;
        }
        state.validateStates.forEach((e) => {
          if (count[e.data.key] > 1) {
            e.isWarning = true;
          } else {
            e.isWarning = false;
          }
        });
        if (fn) {
          fn(!(count[newValue] > 1) ? 1 : 2);
        }
      } else {
        fn(state.validateStates.every((e) => !e.isWarning));
      }
    };
    const { t, lang } = hooks.useI18n(props);
    const EReditorPreviewRef = ref<any>('');
    const isShow = ref(true);
    const isShowConfig = ref(true);
    const setSelection = (node) => {
      if (node == null) {
        node = 'root'; //
      }
      let result = '';
      if (node === 'root') {
        result = state.config;
      } else {
        if (node.type === 'inline') {
          result = node.columns[0];
        } else {
          result = node;
        }
      }
      isShowConfig.value = state.selected === result;
      state.selected = result;
      nextTick(() => {
        // isShowConfig.value = true;
      });
    };
    setSelection(state.config);
    const addField = (node) => {
      if (utils.checkIsField(node)) {
        const findIndex = _.findIndex(state.fields, {
          id: node.id,
        });
        if (findIndex === -1) {
          state.fields.push(node);
        } else {
          state.fields.splice(findIndex, 1, node);
        }
      }
    };
    const delField = (node) => {
      const fieldIndex = _.findIndex(state.fields, {
        id: node.id,
      });
      if (fieldIndex !== -1) {
        if (utils.checkIdExistInLogic(node.id, state.logic)) {
          ElMessage({
            showClose: true,
            duration: 4000,
            message: t('er.logic.logicSuggests'),
            type: 'warning',
          });
          utils.removeLogicDataByid(node.id, state.logic);
        }
        state.fields.splice(fieldIndex, 1);
      }
    };
    const addFieldData = (node, isCopy = false) => {
      if (/^(radio|cascader|checkbox|select)$/.test(node.type)) {
        if (isCopy) {
          state.data[node.id] = _.cloneDeep(state.data[node.options.dataKey]);
          node.options.dataKey = node.id;
        } else {
          if (!state.data[node.id]) {
            node.options.dataKey = node.id;
            state.data[node.id] = {
              type: node.type,
              list: utils.generateOptions(3).map((e, i) => {
                e.label += i + 1;
                return e;
              }),
            };
          }
        }
      }
      if (/^(uploadfile|signature|html)$/.test(node.type)) {
        node.options.action = props.fileUploadURI;
      }
    };
    /* 
     
    */
    const wrapElement = (el, isWrap = true, isSetSelection = true, sourceBlock = true, resetWidth = true) => {
      let node: any = null; //
      if (sourceBlock) {
        // 如果 sourceBlock 为 true，则调用 generatorData 生成数据，并为节点添加字段数据和字段
        node = generatorData(el, isWrap, lang.value, sourceBlock, (node) => {
          addFieldData(node);
          addField(node);
        });
      } else if (isWrap) {
        // 如果 isWrap 为 true（但 sourceBlock 为 false），则将元素封装为一个 'inline' 类型的对象
        node = {
          type: 'inline',
          columns: [el], // 将元素作为 columns 数组的元素
        };
      } else {
        // 如果 sourceBlock 和 isWrap 都为 false，直接返回原始元素
        node = el;
      }
      if (!sourceBlock && resetWidth) {
        if (utils.checkIsField(el)) {
          if (state.platform === 'pc') {
            el.style.width.pc = '100%';
          } else {
            el.style.width.mobile = '100%';
          }
        } else {
          el.style.width = '100%';
        }
      }
      if (isSetSelection) {
      }
      return node;
    };
    setTimeout(() => {
      // setData2(testData1); //
      setData2(JSON.parse(JSON.stringify(testData1))); //
    }, 100);
    const syncLayout = (platform, fn) => {
      const isPc = platform === 'pc';
      const original = _.cloneDeep(state.store);
      utils.disassemblyData2(original);
      layout[isPc ? 'mobile' : 'pc'] = original;
      if (_.isEmpty(isPc ? layout.pc : layout.mobile)) {
        // const newData = _.cloneDeep(state.fields.map(e => wrapElement(e, true, false)))
        const newData = state.fields
          .filter((field) => !utils.checkIsInSubform(field))
          .map((e) => wrapElement(e, true, false, false, false));
        fn && fn(newData);
      } else {
        const layoutFields = utils.pickfields(isPc ? layout.pc : layout.mobile).map((e) => {
          return {
            id: e,
          }; //
        });
        const copyData = _.cloneDeep(isPc ? layout.pc : layout.mobile);
        const addFields = _.differenceBy(
          state.fields.filter((field) => !utils.checkIsInSubform(field)),
          layoutFields,
          'id'
        );
        const delFields = _.differenceBy(layoutFields, state.fields, 'id');
        utils.repairLayout(copyData, delFields);
        utils.combinationData2(copyData, state.fields);
        copyData.push(...addFields.map((e) => wrapElement(e, true, false, false, false)));
        fn && fn(copyData);
      }
    };
    const getLayoutDataByplatform = (platform) => {
      const isPc = platform === 'pc';
      if (_.isEmpty(isPc ? layout.pc : layout.mobile)) {
        if (platform === state.platform) {
          const original = _.cloneDeep(state.store);
          utils.disassemblyData2(original);
          return original;
        } else {
          const newData = _.cloneDeep(
            state.fields
              .filter((field) => !utils.checkIsInSubform(field))
              .map((e) => wrapElement(e, true, false, false, false))
          );
          utils.disassemblyData2(newData);
          return newData;
        }
      } else {
        if (platform === state.platform) {
          const original = _.cloneDeep(state.store);
          utils.disassemblyData2(original);
          layout[isPc ? 'pc' : 'mobile'] = original;
        }
        const layoutFields = utils.pickfields(isPc ? layout.pc : layout.mobile).map((e) => {
          return {
            id: e,
          };
        });
        const copyData = _.cloneDeep(isPc ? layout.pc : layout.mobile);
        const addFields = _.cloneDeep(
          _.differenceBy(
            state.fields.filter((field) => !utils.checkIsInSubform(field)),
            layoutFields,
            'id'
          ).map((e) => wrapElement(e, true, false, false, false))
        );
        const delFields = _.differenceBy(layoutFields, state.fields, 'id');
        utils.repairLayout(copyData, delFields);
        utils.disassemblyData2(addFields);
        copyData.push(...addFields);
        return copyData;
      }
    };
    const switchPlatform = (platform) => {
      if (state.platform === platform) {
        return false;
      }
      if (props.layoutType === 2) {
        syncLayout(platform, (newData) => {
          state.store = newData;
          // console.log(JSON.stringify(newData, '', 2))
          state.store.forEach((e) => {
            utils.addContext({ node: e, parent: state.store });
          });
        });
      }
      state.platform = platform;
    };
    const canvesScrollRef = ref('');
    const fireEvent = (type, data) => {
      emit('listener', {
        type,
        data,
      });
    };
    const ns = hooks.useNamespace('Main', state.Namespace);
    const getData1 = () => {
      return utils.disassemblyData1(
        _.cloneDeep({
          list: state.store,
          config: state.config,
          data: state.data,
          logic: state.logic,
        })
      );
    };
    const getData2 = () => {
      const fields = utils.processField(_.cloneDeep(state.store));
      layout.pc = getLayoutDataByplatform('pc');
      layout.mobile = getLayoutDataByplatform('mobile');
      return _.cloneDeep({
        layout,
        data: state.data,
        config: state.config,
        fields,
        logic: state.logic,
      });
    };
    const setData1 = (data) => {
      if (_.isEmpty(data)) return false;
      const newData = utils.combinationData1(_.cloneDeep(data));
      isShow.value = false;
      state.store = newData.list;
      state.config = newData.config;
      state.data = newData.data;
      state.fields = newData.fields;
      state.logic = newData.logic;
      setSelection(state.config);
      state.store.forEach((e) => {
        utils.addContext({ node: e, parent: state.store }); //
      });
      nextTick(() => {
        isShow.value = true;
      });
    };
    const setData2 = (data) => {
      if (_.isEmpty(data)) return false;
      const newData = _.cloneDeep(data);
      let fields = newData.fields; //
      formIns.setFields(fields); //
      layout.pc = newData.layout.pc;
      layout.mobile = newData.layout.mobile;
      isShow.value = false;
      state.store = newData.list;
      state.fields = newData.fields;
      const curLayout = _.cloneDeep(newData.layout[state.platform]);
      utils.combinationData2(curLayout, state.fields);
      state.store = curLayout;
      state.config = newData.config;
      state.data = newData.data;
      state.logic = newData.logic; //
      setSelection(state.config);
      state.store.forEach((e) => {
        utils.addContext({ node: e, parent: state.store });
      });
      nextTick(() => {
        isShow.value = true;
        // restart()
      });
    };
    const clearData = () => {
      // layout.pc = []
      // layout.mobile = []
      // state.fields.splice(0)
      // state.store.splice(0)
    };
    const getData = () => {
      if (!state.validateStates.every((e) => !e.isWarning)) {
        return {};
      } else {
        return (props.layoutType === 1 ? getData1 : getData2)();
      }
    };
    const setData = props.layoutType === 1 ? setData1 : setData2;
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
        case 5:
          isFoldFields.value = !isFoldFields.value;
          break;
        case 6:
          isFoldConfig.value = !isFoldConfig.value;
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
        // console.log(formIns, 'testInsField',props.formIns,'testIns')////
        for (const delField of deleteFields) {
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
    const onClickOutside = () => {};
    watch(
      () => {
        return state.store;
      },
      (newValue) => {},
      {
        deep: true,
      }
    );
    provide('Everright', {
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
    });
    return () => {
      let nextForm = formIns.nextForm; //
      let com = (
        <div class='h-full w-full'>
          <ElDialog
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
                  <div class={{ previewDialogWrap: true, mobilePreview: previewPlatform.value === 'mobile' }}>
                    <ErFormPreview {...props} ref={EReditorPreviewRef} />
                  </div>
                </ElScrollbar>
              ),
            }}
          </ElDialog>

          <ElContainer class='container' direction='vertical'>
            <ElContainer>
              {isFoldFields.value && <FieldsPanel />}
              <ElContainer class='container'>
                <ElHeader class='operation' style='display: flex;flex-derection: row;justify-content: space-between;'>
                  <div>
                    <Icon class='icon' icon='save' onClick={() => handleOperation(4)} />
                    {props.isShowClear && <Icon class='icon' icon='clear0' onClick={() => handleOperation(2)} />}
                    {slots['operation-left'] && slots['operation-left']()}
                  </div>
                  <div>
                    <DeviceSwitch modelValue={state.platform} onUpdate:modelValue={switchPlatform} />
                    <ElButton
                      onClick={() => {
                        formIns.validate();
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
                          dropdown: () => (
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
                </ElHeader>

                {isShow.value && withDirectives(<CanvesPanel data={state.store} />, [[vClickOutside, onClickOutside]])}
                <Icon
                  class={{ arrowLeft: true, close: !isFoldFields.value }}
                  icon='arrowLeft'
                  onClick={() => handleOperation(5)}
                />
                <Icon
                  class={{ arrowRight: true, close: !isFoldConfig.value }}
                  icon='arrowRight'
                  onClick={() => handleOperation(6)}
                />
              </ElContainer>
              {<ConfigPanel />}
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
