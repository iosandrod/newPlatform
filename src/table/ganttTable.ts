import { shallowRef } from 'vue'
import { getOptions } from './ganttTableFn'
import { Table } from './table'
import * as VTableGantt from '@visactor/vtable-gantt'
export class GanttTable extends Table {
  ganttInstance: VTableGantt.Gantt
  createInstance(rootDiv) {
    let opt = this.getCreateInstanceOptions(rootDiv) as any
    //@ts-ignore
    let gantOptions: VTableGantt.GanttConstructorOptions = {
      ...getOptions(),
      records: this.getShowData(),
      taskListTable: opt,
      rowSeriesNumber: opt.rowSeriesNumber,
    }
    let gtInstance = new VTableGantt.Gantt(rootDiv, gantOptions) //
    let shaGt = shallowRef(gtInstance)
    this.ganttInstance = shaGt as any
    let tinstance = gtInstance.taskListTableInstance //
    let _ins = shallowRef(tinstance)
    this.instance = _ins as any //
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
    // table.on('')
    emitEventArr.forEach((item) => {
      //@ts-ignore//
      table.on(item, (config) => {
        this.emit(item, config)
      })
    })
    this.initEventListener() //
    this.loadColumns()
    this.loadData() //
  } //
} //
