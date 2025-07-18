import utils from '@ER/utils'
import hooks from '@ER/hooks/index'
import {
  ref,
  computed,
  reactive,
  watch,
  onMounted,
  inject,
  h,
  defineComponent,
} from 'vue'
import _ from 'lodash'
// import PanelsConfigComponentsPropsPanel from '@ER/formEditor/components/Panels/Config/components/PropsPanel.vue'
// import GlobalConfigPanel from './components/GlobalConfigPanel.vue' //
import formBarBread from '@/bread/formBarBread'
import fConfigPanel from './components/fConfigPanel'
import {
  ElAside,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElForm,
  ElScrollbar,
} from 'element-plus'
import { Form } from '@ER/form'
import FormCom from '@ER/formCom'
export default defineComponent({
  name: 'Config',
  inheritAttrs: false,
  props: {
    mode: {
      type: String,
      default: 'editor',
    },
  },
  components: {
    fConfigPanel,
    // PanelsConfigComponentsPropsPanel,
    // GlobalConfigPanel,
    formBarBread,
  },
  setup(props, { emit, expose, slots }) {
    const {
      state,
      isSelectAnyElement,
      isSelectField,
      isSelectRoot,
      setSelection,
      type,
      checkTypeBySelected,
      target,
      isSelectGrid,
      isSelectTabs,
      isSelectCollapse,
      isSelectTable,
    } = hooks.useTarget()
    const ER: any = inject('Everright')
    const { t } = hooks.useI18n()
    const activeName0 = ref('props')
    const isShow = computed(() => {
      return !_.isEmpty(state.selected) && state.selected.type !== 'grid'
    })
    const ns = hooks.useNamespace('Config')
    const form = ref()
    const handleChangePanel = (panel) => {
      // activeName0.value = panel
    }
    let formIns: Form = inject('formIns') //
    formIns.initDefaultDForm()
    // let allFormMap=form
    const validator = (rule, value, callback) => {
      const newValue = value.trim()
      const fn = (type) => {
        switch (type) {
          case 0:
            callback(new Error(t('er.validateMsg.required')))
            break
          case 1:
            callback()
            break
          case 2:
            callback(new Error(t('er.validateMsg.idUnique')))
            break
        }
      }
      if (props.mode === 'editor') {
        state.validator(target.value, fn)
      } else {
        if (utils.isNull(newValue)) {
          fn(0)
        } else {
          fn(1)
        }
      }
    }
    onMounted(() => {
      // form.value.validate()
    })
    const rules = reactive({
      key: [
        {
          required: true,
          trigger: 'blur',
          validator,
        },
      ],
    })
    const bars = computed(() => {
      let nodes = ['root']
      let result = []
      if (!isSelectRoot.value) {
        nodes = nodes.concat(
          target.value.context.parents.filter(
            (e) => !/^(inline|tr)$/.test(e.type),
          ),
        )
      }
      if (nodes.length > 4) {
        result.push(nodes[0])
        result.push({
          value: 'placeholder',
        })
        result.push(nodes[nodes.length - 2])
        result.push(nodes[nodes.length - 1])
      } else {
        result = nodes
      }
      return result.map((node) => {
        const result = {
          // eslint-disable-next-line
          node: node,
          label: '',
        }
        if (node === 'root') {
          result.label = t('er.panels.config')
        } else if (node.value !== 'placeholder') {
          if (/^(col|collapseCol|tabsCol|td)$/.test(node.type)) {
            result.label = t(`er.layout.${node.type}`)
          } else {
            result.label = utils.fieldLabel(t, node)
          }
        }
        return result
      })
    })
    const handleBreadcrumbClick = (item) => {
      if (item !== 'root') {
        setSelection(item)
      } else {
        setSelection('root')
      }
    }
    watch(
      target,
      () => {
        if (isSelectRoot.value) {
          activeName0.value = 'root'
        } else {
          activeName0.value = 'props'
        }
      },
      {
        immediate: true,
      },
    )
    return () => {
      let lF = (
        <FormCom
          key={formIns?.curDForm?.id}
          formIns={formIns?.curDForm}
        ></FormCom>
      )
      if (formIns?.curDForm == null) {
        lF = null //
      }
      if (formIns?.curDForm?.id == null) {
        lF = null
      }
      let lF1 = (
        <FormCom
          key={formIns?.curSForm?.id}
          formIns={formIns?.curSForm}
        ></FormCom>
      )
      if (formIns?.curSForm?.id == null) {
        lF1 = null //
      }
      let com = (
        <ElAside class={[ns.b()]} width={ER.props.configPanelWidth}>
          <ElBreadcrumb
            class={[ns.e('breadcrumb')]}
            separator-icon={() => (
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
                />
              </svg>
            )}
            {...utils.addTestId('configPanel:breadcrumb')}
          >
            {bars.value.map((item, index) => (
              <ElBreadcrumbItem
                key={index}
                onClick={() => {
                  if (
                    index !== bars.value.length - 1 &&
                    item.node.value !== 'placeholder'
                  ) {
                    handleBreadcrumbClick(item.node)
                  }
                }}
              >
                {item.node.value === 'placeholder' ? '...' : item.label}
              </ElBreadcrumbItem>
            ))}
          </ElBreadcrumb>
          <ElForm
            ref="form"
            model={target}
            label-width="120px"
            label-position="top"
          >
            <ElScrollbar>
              <div class={[ns.e('wrap')]}>
                {/* {isSelectAnyElement.value && (
                  // <PanelsConfigComponentsPropsPanel key={target.value.id} />
                )} */}
                {/* {isSelectRoot.value && <GlobalConfigPanel />} */}
                {/* <fConfigPanel></fConfigPanel> */}
                {lF1}
                {lF}
              </div>
            </ElScrollbar>
          </ElForm>
        </ElAside>
      )
      return com
    }
  },
})
