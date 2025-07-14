import { shallowRef, toRaw } from 'vue'
import { getOptions } from './ganttTableFn'
import { Table } from './table'
import * as VTableGantt from '@visactor/vtable-gantt'
import { nextTick } from 'process'
export class GanttTable extends Table {
  ganttInstance: VTableGantt.Gantt
  createInstance(rootDiv) {
    let opt = this.getCreateInstanceOptions(rootDiv) as any
    let totalColWidth = this.templateProps.columns.reduce((pre, cur) => {
      return pre + cur.width
    }, 0) //
    let serWidth = opt.rowSeriesNumber.width //
    totalColWidth += serWidth
    opt = { ...opt, tableWidth: totalColWidth }
    //@ts-ignore
    let gantOptions: VTableGantt.GanttConstructorOptions = {
      ...getOptions(),
      taskBar: {
        startDateField: 'planStartCalendar',
        endDateField: 'planFinishCalendar',
        progressField: 'progress',
        resizable: true,
        moveable: true,
        scheduleCreatable: true,
        labelTextStyle: {
          fontFamily: 'Arial',
          fontSize: 14,
          textAlign: 'right',
          textOverflow: 'ellipsis',
          textBaseline: 'bottom',
        },
        barStyle: {
          width: 30,
          /** 任务条的圆角 */
          cornerRadius: 10,
          /** 任务条的边框 */
          borderLineWidth: 0,
          /** 边框颜色 */
          borderColor: 'black',
        },
        hoverBarStyle: {
          /** 任务条的颜色 */
          barOverlayColor: 'rgba(0,0,0,0.15)',
        },
        selectedBarStyle: {
          /** 任务条的颜色 */
          borderColor: '#000000',
          borderLineWidth: 0,
        },
        scheduleCreation: {
          maxWidth: 100,
          minWidth: 40,
        },
      },
      timelineHeader: {
        verticalLine: {
          lineColor: '#e1e4e8',
          lineWidth: 1,
          //   lineDash: [5, 5], //
        },
        horizontalLine: {
          lineColor: '#e1e4e8',
          lineWidth: 1,
          //    lineDash: [5, 5], //
        },
        backgroundColor: '#63a8ff',
        colWidth: 10,
        scales: [
          {
            unit: 'day',
            step: 1,
            startOfWeek: 'sunday',
            format(date) {
              const day = VTableGantt.tools.formatDate(
                new Date(date.startDate),
                'yyyy-mm-dd',
              )
              return day
            },
            style: {
              fontSize: 16,
              fontWeight: 'normal',
            },
          },
          {
            unit: 'minute',
            step: 60,
            visible: false,
            style: {
              fontSize: 14,
              fontWeight: 'normal',
            }, //
          },
          {
            unit: 'hour',
            step: 1,
            visible: false,
            style: {
              fontSize: 14,
              fontWeight: 'normal',
            },
          },
        ],
      },
      //   records: this.getShowData(),
      taskListTable: opt,
      rowSeriesNumber: opt.rowSeriesNumber,
      frame: {
        verticalSplitLineMoveable: false, //
        outerFrameStyle: {
          borderLineWidth: 2,
          //   borderColor: 'red',
          cornerRadius: 8,
        },
        verticalSplitLine: {
          lineWidth: 3,
          lineColor: '#e1e4e8',
        },
        verticalSplitLineHighlight: {
          lineColor: 'green',
          lineWidth: 3,
        },
      },
      scrollStyle: {
        visible: 'focus', //
      },
    }
    let gtInstance = new VTableGantt.Gantt(rootDiv, gantOptions) //
    let shaGt = shallowRef(gtInstance)
    this.ganttInstance = shaGt as any
    let tinstance = gtInstance.taskListTableInstance //
    let _ins = shallowRef(tinstance)
    this.instance = _ins as any
    /*
     */
    const emitEventArr = [
      'mouseleave_cell',
      'mouseenter_cell',
      'mousedown_cell',
      'resize_column',
      'icon_click', //
      'contextmenu_cell',
      'sort_click',
      'selected_cell',
      'scroll',
      'click_cell',
      'checkbox_state_change',
      'dblclick_cell',
      'resize_column_end',
    ]
    let table = tinstance //
    emitEventArr.forEach((item) => {
      //@ts-ignore//
      table.on(item, (config) => {
        this.emit(item, config)
      })
    })
    this.initEventListener() //
<<<<<<< HEAD
    this.loadColumns()
    this.loadData()
  }
  updateColumns() {
    super.updateColumns()//
    let gtIns = this.getGanttInstance()//
    gtIns.taskListTableInstance//
  }
  getGanttInstance(): VTableGantt.Gantt {
    let gtIns = this.ganttInstance
    //@ts-ignore
    let value = gtIns?.value
    if (value != null) {
    } else {
      value = gtIns
    }
    return value//
  }
} //
=======
    this.loadColumns() //
    this.loadData() //
  } //
  loadData() {
    super.loadData() //
    let ganttInstance = this.getGanttInstance()
    if (!ganttInstance) return
  }
  getGanttInstance(): VTableGantt.Gantt {
    let ins = this.ganttInstance //
    //@ts-ignore
    if (ins?.value) {
      //@ts-ignore
      return ins.value
    }
    return ins //
  }
}
>>>>>>> refs/remotes/origin/main
