import { nextTick, defineComponent, onMounted, onUnmounted, ref, withDirectives, provide, watch } from 'vue'
import { Form } from './form'
import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
export default defineComponent({
  components: {},
  props: {
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
  },
  setup(props, { slots, expose }) {
    let fIns: Form = null as any
    if (props.formIns != null) {
      fIns = props.formIns as any
    } else {
      //
      fIns = new Form(props)
      if (props.layoutData != null) {
        fIns.setLayoutData(props.layoutData) //
      }
    }
    fIns.setCurrentDesign(false) //
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
      }
    )
    onUnmounted(() => {
      fIns.onUnmounted() //
    }) //
    expose({ _instance: fIns }) //
    return () => {
      let com = <erForm formIns={fIns}></erForm>
      let buttonG = null
      let hBtns = fIns.getHeaderButtons()
      if (hBtns.length > 0) {
        buttonG = <ButtonGroupCom buttons={hBtns}></ButtonGroupCom> //
      }
      return (
        <div class="w-full h-full bg-white">
          {buttonG}
          {com}
        </div>
      )
    }
  },
})
