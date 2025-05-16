import TabCom from '@/buttonGroup/tabCom'
import FormCom from '@ER/formCom'
import { PageDesign } from '@ER/pageDesign'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchDialog',
  props: {
    pageDesign: {
      type: Object,
    },
  },
  setup(props) {
    let pageDesign: PageDesign = props.pageDesign as any
    let dialogConfig = pageDesign?.config?.searchDialog||{}
    let d = pageDesign?.getSearchBindData()||{}
    let allTabPlan = computed(() => {
      let arr = []
      return arr
    })
    return () => (
      //
      <div class="h-full w-full">
        <div class="w-full">
          <TabCom
            items={[
              {
                label: '默认方案',
                key: 'query',
              },
              {
                label: '方案1',
                key: 'result',
              },
            ]}
          ></TabCom>
        </div>
        <div class="flex-1">
          <FormCom layoutData={dialogConfig} data={d}></FormCom>
        </div>
      </div>
    )
  },
})
