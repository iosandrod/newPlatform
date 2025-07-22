import { defineComponent } from 'vue'
import dialogCom from './dialogCom'
import { Dialog } from './dialog'

export default defineComponent({
  name: 'dialogArrCom',
  components: {
    dialogCom,
  }, //
  props: {
    dialogArr: {
      type: Array,
      default: () => [], //
    },
  },
  setup(props) {
    let dialogs: Dialog[] = props.dialogArr || ([] as any) //
    return () => {
      let dArr = dialogs.map((d) => {
        return <dialogCom key={d.id} dialogIns={d}></dialogCom>
      })
      let com = <div>{dArr}</div>
      return com //
    }
  },
})
