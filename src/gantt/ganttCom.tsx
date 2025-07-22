import { defineComponent, watchEffect } from 'vue'
import { GGanttChart, GGanttRow } from './hy-vue-gantt' //
import ganttCom1 from './ganttCom1.vue'
import { Gantt } from './ganttClass'
export default defineComponent({
  name: 'GanttCom',
  components: { GGanttChart, GGanttRow, ganttCom1 },
  props: {
    bars: {
      type: Array,
      default: () => {
        return [
          {
            id: '3',
            start: '2025-01-01',
            end: '2025-01-15',
            ganttBarConfig: {
              id: '1',
              label: 'Task 1',
              style: { background: '#42b883' },
            },
          },
        ]
      },
    },
  },
  setup(props) {
    let ganttIns = new Gantt(props)
    watchEffect(() => {
      ganttIns.loadData()
    })
    return () => {
      let com = (
        <div class="gantt-container">
          <GGanttChart
            commands={true} //
            rowHeight={ganttIns.getRowHeight()} //
            {...ganttIns.getGanttBasicConfig()} //
            {...ganttIns.getGanttBaseEvents()} //
            v-slots={{
              default: () => {
                let items = ganttIns.getBars().map((row: any) => {
                  let com1 = (
                    <GGanttRow
                      {...ganttIns.getGanttRowProps(row)} //
                    />
                  )
                  return com1 //
                })
                return items //
              },
              leftTable: (config) => {
                let tCom = (
                  <div class="h-full w-full">
                    <erXeTable
                      headerHeight={ganttIns.getHeaderHeight()} //
                      showRowSeriesNumber={false} //
                      showCheckboxColumn={false} //
                      rowHeight={ganttIns.getRowHeight()} //
                      columns={ganttIns.getTableColumns()} //
                      data={ganttIns.getTableData()}
                    ></erXeTable>
                  </div>
                )
                return tCom
              },
            }}
          ></GGanttChart>
        </div>
      )
      return com //
    }
  },
})
