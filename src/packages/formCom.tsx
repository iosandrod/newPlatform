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
import preview from '@ER/formEditor/preview'
import editor from '@ER/formEditor/formEditor'
import { Form } from './form'
export default defineComponent({
  components: {
    preview,
  },
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
  },
  setup(props, { slots }) {
    //子表单
    let fIns = new Form(props)
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
        if (items != oldLen) {
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
    )
    provide('formIns', fIns)
    onUnmounted(() => {
      fIns.onUnmounted() //
    }) //
    return () => {
      let com = <erForm formIns={fIns}></erForm>
      return com
    }
  },
})
