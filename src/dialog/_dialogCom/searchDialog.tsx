import FormCom from '@ER/formCom'
import { PageDesign } from '@ER/pageDesign'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchDialog',
  props: {
    pageDesign: {
      type: Object,
    },
  },
  setup(props) {
    let pageDesign: PageDesign = props.pageDesign as any
    let dialogConfig = pageDesign.config.searchDialog
    return () => (
      <div class="h-full w-full">
        <div class="w-full">is tabCom</div>
        <div class="flex-1">
          <FormCom layoutData={dialogConfig.layoutData}></FormCom>
        </div>
      </div>
    )
  },
})
