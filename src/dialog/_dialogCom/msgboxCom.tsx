import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
import TabCom from '@/buttonGroup/tabCom'
import { system } from '@/system'
import FormCom from '@ER/formCom'
import { PageDesign } from '@ER/pageDesign'
import _ from 'lodash'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'msgboxCom',
  props: {
    message: {
      type: Object,
    },
    type: {
      type: String,
    },
  },
  setup(props) {
    let type = props.type
    let color = ''
    if (type == 'error') {
      color = 'red'
    }
    if (type == 'warning') {
      color = 'yellow'
    }
    if (type == 'success') {
      color = 'green'
    }
    let style = {
      color: color,
    }
    return () => (
      <div class="h-full w-full flex justify-center items-center">
        <div style={style} class=" flex flex-col justify-between">
          {props.message}
        </div>
      </div>
    )
  },
})
