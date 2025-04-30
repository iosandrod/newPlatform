import {
  nextTick,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  withDirectives,
  provide,
  watch,
} from 'vue'
import { Form } from './form'
export default defineComponent({
  components: {},
  props: {
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
  },
  setup(props, { slots, expose }) {
    let fIns = null
    if (props.formIns != null) {
      fIns = props.formIns
    } else {
      //
      fIns = new Form(props)
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
    onUnmounted(() => {
      fIns.onUnmounted() //
    }) //
    expose({ _instance: fIns }) //
    return () => {
      let com = <erForm formIns={fIns}></erForm>
      return <div class="w-full h-full bg-white">{com}</div>
    }
  },
})
