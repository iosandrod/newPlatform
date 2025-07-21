import { defineComponent } from 'vue'
import { GGanttChart, GGanttRow } from './hy-vue-gantt' //
import ganttCom1 from './ganttCom1.vue'
export default defineComponent({
  name: 'GanttCom',
  components: { GGanttChart, GGanttRow, ganttCom1 },
  props: {},
  setup() {
    const chartStart = '2024-01-01'
    const chartEnd = '2024-12-31'
    const precision = 'day'
    const barStart = 'start'
    const barEnd = 'end'
    const dateFormat = 'YYYY-MM-DD'

    const rows = [
      {
        label: 'Task 1',
        bars: [
          {
            start: '2024-01-01',
            end: '2024-01-15',
            ganttBarConfig: {
              id: '1',
              label: 'Task 1',
              style: { background: '#42b883' },
            },
          },
        ],
      },
    ]
    return () => {
      //   let items = rows.map((item) => {
      //     return (
      //       <GGanttRow
      //         key={item.label}
      //         label={item.label}
      //         bars={item.bars}
      //       ></GGanttRow>
      //     )
      //   })
      //   let com = (
      //     <div class="er-h-400 er-w-800">
      //       <GGanttChart
      //         chartStart={chartStart}
      //         chartEnd={chartEnd}
      //         precision={precision}
      //         barStart={barStart}
      //         barEnd={barEnd}
      //         dateFormat={dateFormat}
      //         v-slots={{
      //           default: () => {
      //             return items
      //           },
      //         }}
      //       ></GGanttChart>
      //     </div>
      //   )
      //   return com //
      let com = (
        <div class="w-full h-full">
          <ganttCom1></ganttCom1>
        </div>
      )
      return com //
    }
  },
})
