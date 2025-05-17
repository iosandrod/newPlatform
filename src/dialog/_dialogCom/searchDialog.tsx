import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
import TabCom from '@/buttonGroup/tabCom'
import { system } from '@/system'
import FormCom from '@ER/formCom'
import { PageDesign } from '@ER/pageDesign'
import _ from 'lodash'
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
    let dialogConfig = pageDesign?.config?.searchDialog || {}
    let d = pageDesign?.getSearchBindData() || {}
    let sPlan = dialogConfig.searchPlan
    if (sPlan == null) {
      dialogConfig.searchPlan = [
        {
          label: '默认方案', //
          data: d, //
        },
      ]
    }
    let allTabPlan = computed(() => {
      let searchPlan = dialogConfig.searchPlan
      if (!Array.isArray(searchPlan)) {
        return []
      }
      let _s = searchPlan.map((s) => {
        return s
      }) //
      return _s
    }) //
    return () => (
      <div class="h-full w-full ">
        <div class="w-full flex flex-col justify-between">
          <div class="mt-4 mb-4">
            <ButtonGroupCom
              items={[
                {
                  label: '另存方案',
                  fn: async () => {
                    let fConfig = {
                      itemSpan: 24, //
                      title: '方案名称',
                      height: 200,
                      width: 300, //
                      items: [
                        {
                          type: 'input',
                          label: '方案名称',
                          field: 'label', //
                        },
                      ],
                    }
                    let res: any = await system.confirmForm(fConfig) //
                    let label = res.label //
                    let _data = d
                    let newObj = {
                      label: label,
                      data: _data, //
                    }
                    newObj = _.cloneDeep(newObj) //
                    sPlan.push(newObj) ////
                    await system.updateCurrentPageDesign(pageDesign.config) //
                  },
                },
                {
                  label: '删除方案',
                  fn: () => {},
                },
                {
                  label: '设为默认方案',
                  fn: () => {},
                },
                {
                  label: '设计表单',
                  fn: async () => {
                    await pageDesign.designSearchForm() //
                  },
                },
              ]}
            ></ButtonGroupCom>
          </div>
          <div class="mt-4 mb-4">
            <TabCom
              items={allTabPlan.value} //
            ></TabCom>
          </div>
        </div>
        <div class="flex-1">
          <FormCom
            tableName={pageDesign.getRealTableName()}
            layoutData={dialogConfig}
            data={d}
          ></FormCom>
        </div>
      </div>
    )
  },
})
