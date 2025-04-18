import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InputCom',
  props: {},
  setup(props, context) {
    return () => {
      //
      let com = <div>input</div>
      return com
    }
  },
})
