import * as VTableGantt from '@visactor/vtable-gantt'
export const getGanttRecords = () => {
  //
  const records = [
    {
      key: '0',
      check: {
        checked: false,
        disable: true,
      },
      name: 'FA账期关闭',
      planStartCalendar: '2025-01-01',
      planFinishCalendar: '2025-01-03',
      hierarchyState: 'expand',
      keyNode: false,
      timeConflict: false,
      confirmed: false,
      children: [
        {
          key: '0,0',
          check: {
            checked: false,
            disable: true,
          },
          name: 'FA账期关闭',
          planStartCalendar: '2025-01-02 00:00:00',
        //   planFinishCalendar: '2025-01-02 23:59:59',
         planFinishCalendar: '2025-01-03 00:00:00',
          hierarchyState: 'expand',
          keyNode: true,
          timeConflict: false,
          confirmed: false,
        },
      ],
    },
    {
      key: '1',
      check: {
        checked: false,
        disable: true,
      },
      name: 'GL资金结账',
      planStartCalendar: '2025-01-01 10:00:00',
      planFinishCalendar: '2025-01-05 00:00:00',
      hierarchyState: 'expand',
      keyNode: false,
      timeConflict: false,
      confirmed: false,
      children: [
        {
          key: '1,0',
          check: {
            checked: false,
            disable: true,
          },
          name: '第三方提现中转核对',
          planStartCalendar: '2025-01-02 10:30',
          planFinishCalendar: '2025-01-03 12:00',
          hierarchyState: 'expand',
          keyNode: false,
          timeConflict: false,
          confirmed: false,
        
        },
        {
          key: '1,1',
          check: {
            checked: false,
            disable: true,
          },
          name: '红包提现流水入账',
          planStartCalendar: '2025-01-03 10:30',
          planFinishCalendar: '2025-01-03 12:00',
          hierarchyState: 'expand',
          keyNode: false,
          timeConflict: false,
          confirmed: false,
         
        },
        {
          key: '1,2',
          check: {
            checked: false,
            disable: true,
          },
          name: '资金中转对平',
          planStartCalendar: '2025-01-03 16:00',
          planFinishCalendar: '2025-01-03 19:00',
          hierarchyState: 'expand',
          keyNode: false,
          timeConflict: false,
          confirmed: false,
        },
        {
          key: '1,3',
          check: {
            checked: false,
            disable: true,
          },
          name: '投资组完成境内流水认款',
          planStartCalendar: '2025-01-03 10:00',
          planFinishCalendar: '2025-01-03 19:00',
          hierarchyState: 'expand',
          keyNode: false,
          timeConflict: false,
          confirmed: false,
        },
      ],
    },
  ]
  return records
}

export const getGanttColumns = () => {
  let cols = [
    {
      field: 'name',
      title: '任务',
      width: 220,
      tree: true,
      icon: ({ table, col, row }) => {
        const record = table.getCellOriginRecord(col, row)
        if (record.keyNode) {
          return 'flag'
        }
      },
      style: ({ table, col, row }) => {
        const record = table.getCellOriginRecord(col, row)
        return {
          // - 已确认-绿底；未确认-白底
          bgColor: record?.timeConflict
            ? '#f0943a'
            : record.confirmed
            ? '#63bb5c'
            : undefined,
        }
      },
    },
    {
      field: 'planStartCalendar',
      title: '计划开始',
      width: 'auto',
    },
    {
      field: 'planFinishCalendar',
      title: '计划完成',
      width: 'auto',
    },
  ]
  return cols
}

export const getOptions = () => {
  let options: VTableGantt.GanttConstructorOptions = {
    groupBy: true,
    tasksShowMode: VTableGantt.TYPES.TasksShowMode.Sub_Tasks_Arrange,
    frame: {//
      outerFrameStyle: {
        borderLineWidth: 1,
        borderColor: '#e1e4e8',
        cornerRadius: 8,
      },
      verticalSplitLineMoveable: false,
    },
    grid: {
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8',
      },
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8',
      },
    },
    headerRowHeight: 60,
    rowHeight: 40,

    dependency: {
      linkCreatable: true,
      links: []//
      // [
      //   {
      //     type: VTableGantt.TYPES.DependencyType.StartToStart,
      //     linkedFromTaskKey: 1,
      //     linkedToTaskKey: 2,
      //   },
      //   {
      //     type: VTableGantt.TYPES.DependencyType.FinishToStart,
      //     linkedFromTaskKey: 2,
      //     linkedToTaskKey: 3,
      //   },
      //   {
      //     type: VTableGantt.TYPES.DependencyType.StartToStart,
      //     linkedFromTaskKey: 3,
      //     linkedToTaskKey: 5,
      //   },
      //   {
      //     type: VTableGantt.TYPES.DependencyType.FinishToFinish,
      //     linkedFromTaskKey: 5,
      //     linkedToTaskKey: 4,
      //   },
      //   {
      //     type: VTableGantt.TYPES.DependencyType.StartToStart,
      //     linkedFromTaskKey: 8,
      //     linkedToTaskKey: 9,
      //   },
      //   {
      //     type: VTableGantt.TYPES.DependencyType.FinishToStart,
      //     linkedFromTaskKey: 9,
      //     linkedToTaskKey: 10,
      //   },
      // ],
    },
    timelineHeader: {
      verticalLine: {
        lineColor: '#e1e4e8',
        lineWidth: 1,
      },
      horizontalLine: {
        lineColor: '#e1e4e8',
        lineWidth: 1,
      },
      backgroundColor: '#63a8ff',
      scales: [
        {
          unit: 'day',
          step: 1,
          format(date) {
            return date.dateIndex.toString()
          },
          style: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
          },
        },
      ],
    },
    minDate: '2024-11-14',
    maxDate: '2024-12-31',
    scrollStyle: {
      scrollRailColor: 'RGBA(246,246,246,0.5)',
      visible: 'none',
      width: 6,
      scrollSliderCornerRadius: 2,
      scrollSliderColor: '#5cb85c',
    },
  }
  return options
}
