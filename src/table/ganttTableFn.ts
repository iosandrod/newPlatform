import * as VTableGantt from '@visactor/vtable-gantt'
export const getGanttRecords = () => {
  //
  let records = [
    {
      id: 0,
      name: 'Planning',
      start: '2024-11-15',
      end: '2024-11-21',
      children: [
        {
          id: 1,
          name: 'Michael Smith',
          start: '2024-11-15',
          end: '2024-11-17',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg',
        },
        {
          id: 2,
          name: 'Emily',
          start: '2024-11-17',
          end: '2024-11-18',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
        },
        {
          id: 3,
          name: 'Rramily',
          start: '2024-11-19',
          end: '2024-11-20',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
        },
        {
          id: 4,
          name: 'Lichael Join',
          start: '2024-11-18',
          end: '2024-11-19',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg',
        },
      ],
    },
    {
      id: 300,
      name: 'Research',
      start: '2024-11-18',
      end: '2024-11-21',
      children: [
        {
          id: 5,
          name: 'Ryan',
          start: '2024-11-18',
          end: '2024-11-21',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg',
        },
      ],
    },
    {
      name: 'Goal Setting',
      start: '2024-11-18',
      end: '2024-11-21',
      children: [
        {
          id: 6,
          name: 'Daniel Davis',
          start: '2024-11-21',
          end: '2024-11-22',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg',
        },
        {
          id: 7,
          name: 'Lauren',
          start: '2024-11-18',
          end: '2024-11-19',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg',
        },
      ],
    },

    {
      name: 'Strategy',
      start: '2024-11-20',
      end: '2024-11-25',
      children: [
        {
          id: 8,
          name: 'Tacarah Siller',
          start: '2024-11-20',
          end: '2024-11-21',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
        },
        {
          id: 9,
          name: 'Camentew Olision',
          start: '2024-11-25',
          end: '2024-11-26',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg',
        },
        {
          id: 10,
          name: 'Sarah Miller',
          start: '2024-11-17',
          end: '2024-11-18',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
        },
        {
          id: 11,
          name: 'Matthew Wilson',
          start: '2024-11-22',
          end: '2024-11-25',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg',
        },
        {
          id: 12,
          name: 'Grarah Poliller',
          start: '2024-11-23',
          end: '2024-11-24',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
        },
      ],
    },
    {
      name: 'Execution',
      start: '2024-11-22',
      end: '2024-11-25',
      children: [
        {
          id: 13,
          name: 'Ashley Taylor',
          start: '2024-11-22',
          end: '2024-11-25',

          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg',
        },
        {
          id: 14,
          name: 'Megan',
          start: '2024-11-27',
          end: '2024-11-30',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg',
        },
        {
          id: 15,
          name: 'David',
          start: '2024-12-10',
          end: '2024-12-18',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg',
        },
      ],
    },
    {
      name: 'Monitoring',
      start: '2024-12-02',
      end: '2024-12-25',
      children: [
        {
          id: 16,
          name: 'Hannah',
          start: '2024-11-20',
          end: '2024-11-30',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
        },
        {
          id: 17,
          name: 'Andrew',
          start: '2024-12-02',
          end: '2024-12-18',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg',
        },
      ],
    },
    {
      name: 'Reporting',
      start: '2024-12-22',
      end: '2024-12-28',
      children: [
        {
          id: 18,
          name: 'Joshua Anderson',
          start: '2024-12-22',
          end: '2024-12-28',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg',
        },
      ],
    },
    {
      name: 'Process review',
      start: '2024-11-25',
      end: '2024-11-30',
      children: [
        {
          id: 19,
          name: 'Christopher Moore',
          start: '2024-11-25',
          end: '2024-11-30',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg',
        },
        {
          id: 20,
          name: 'Emma',
          start: '2024-12-01',
          end: '2024-12-18',
          avatar:
            'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg',
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
      title: 'PROCESS',
      width: 150,
      tree: true,
    },
  ]
  return cols
}

export const getOptions = () => {
  let options = {
    groupBy: true,
    tasksShowMode: VTableGantt.TYPES.TasksShowMode.Sub_Tasks_Arrange,
    frame: {
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
    taskBar: {
      startDateField: 'start',
      endDateField: 'end',
      progressField: 'progress',
      labelText: '{name}',
      labelTextStyle: {
        fontFamily: 'Arial',
        fontSize: 14,
        textAlign: 'center',
        color: 'white',
      },
      barStyle: {
        width: 22,
        /** 任务条的颜色 */
        barColor: 'rgb(68 99 244)',
        /** 已完成部分任务条的颜色 */
        completedBarColor: '#91e8e0',
        /** 任务条的圆角 */
        cornerRadius: 15,
        borderColor: 'black',
        borderLineWidth: 1,
      },
    },
    dependency: {
      linkCreatable: true,
      links: [
        {
          type: VTableGantt.TYPES.DependencyType.StartToStart,
          linkedFromTaskKey: 1,
          linkedToTaskKey: 2,
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 2,
          linkedToTaskKey: 3,
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToStart,
          linkedFromTaskKey: 3,
          linkedToTaskKey: 5,
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToFinish,
          linkedFromTaskKey: 5,
          linkedToTaskKey: 4,
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToStart,
          linkedFromTaskKey: 8,
          linkedToTaskKey: 9,
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 9,
          linkedToTaskKey: 10,
        },
      ],
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
