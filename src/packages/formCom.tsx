import {
  nextTick,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  withDirectives,
  provide,
  watch,
  inject,
} from 'vue'
import { Form } from './form'
import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
import defaultProps from './formEditor/defaultProps'
import ContextmenuCom from '@/contextM/components/ContextmenuCom'
const getDefaultFormEditProps = () => {
  return {
    isTabForm: {
      type: Boolean,
      default: false,
    },
    itemSpan: {
      type: Number,
      default: 6,
    }, //
    fieldsPanelWidth: {
      type: String,
      default: '220px',
    },
    fieldsPanelDefaultOpeneds: {
      type: Array,
      default: () => ['defaultField', 'field', 'container'],
    }, //
    delHandle: {
      type: Function,
      default: () => () => {}, //
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
    isDesign: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    }, //
    tableName: {
      type: String,
    },
  } ///
}
export default defineComponent({
  components: {},
  props: {
    ...getDefaultFormEditProps(),
    buttons: {
      type: Array,
    },
    isDesign: {
      type: Boolean,
      default: false,
    },
    itemSpan: {
      type: Number,
      default: 6,
    },
    items: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object, //
      default: () => {},
    },
    formIns: {
      type: Object,
    },
    layoutData: {
      type: Object,
    },
    showContextMenu: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: Number,
      default: 50,
    },
  },
  setup(props, { slots, expose }) {
    let fIns: Form = null as any //
    if (props.formIns != null) {
      fIns = props.formIns as any
    } else {
      //
      fIns = new Form(props)
      if (props.layoutData != null) {
        fIns.setLayoutData(props.layoutData) //
      }
    }
    fIns.setCurrentDesign(false)
    if (props.isDesign == true) {
      fIns.setCurrentDesign(true) //
    }
    onMounted(() => {
      nextTick(() => {
        fIns.onMounted() //
      })
    })
    watch(
      () => {
        let arr = [props.items, props.items.length]
        return arr
      }, //
      ([items, len], [oldItems, oldLen]) => {
        if (props.layoutData != null) {
          return //
        }
        if (items != oldItems) {
          //
          fIns.setItems(items) ////
        } else {
          //@ts-ignore
          let additems = items.filter((item) => !oldItems.includes(item)) //
          //@ts-ignore
          let delitems = oldItems.filter((item) => !items.includes(item)) //
          if (additems.length > 0) {
            additems.forEach((item) => {
              fIns.addFormItem(item) //
            })
          }
          if (delitems.length > 0) {
            delitems.forEach((item) => {
              fIns.delFormItem(item) //
            })
          }
        }
      },
      {
        //
        // immediate: true,//
      },
    )
    let pageDesign: any = inject('pageDesign', {}) //
    let tableName = pageDesign?.tableName
    if (fIns.dTableName == null) {
      fIns.dTableName = tableName //
    }
    if (props.tableName != null) {
      fIns.dTableName = props.tableName //
    }
    onUnmounted(() => {
      fIns.onUnmounted() //
    }) ////
    expose({ _instance: fIns, validate: fIns.validate.bind(fIns) }) //
    const registerContext = (el) => {
      fIns.registerRef('contextMenu', el) //
    }
    return () => {
      let com = <erForm formIns={fIns}></erForm>
      let buttonG = null
      let hBtns = fIns.getHeaderButtons()
      if (hBtns.length > 0) {
        buttonG = <ButtonGroupCom buttons={hBtns}></ButtonGroupCom> //
      }
      let _context = null
      if (props.showContextMenu == true) {
        _context = <ContextmenuCom ref={registerContext}></ContextmenuCom>
      }

      let _com = (
        <div class="w-full h-full bg-white">
          {buttonG}
          {com}
          {_context}
        </div>
      )
      return _com
    }
  },
})
