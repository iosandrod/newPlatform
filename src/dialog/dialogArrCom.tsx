import { defineComponent } from 'vue'
import dialogCom from './dialogCom'

export default defineComponent({
  name: 'dialogArrCom',
  components: {
    dialogCom,
  },//
  props: {
    dialogArr: {
      type: Array,
      default: () => [], //
    },
  },
  setup(props) {
    let dialogs = props.dialogArr
    return () => {
      let dArr = dialogs.map((d) => {
        return <dialogCom dialogIns={d}></dialogCom>
      })
      let com = <div>{dArr}</div>
      return com //
    }
  },
})
