// // import * as VTableGantt from '@visactor/vtable-gantt'

// export const createGantt = (el, opt = false) => {
//   let ganttInstance
//   const records = [
//     {
//       id: 1,
//       title: 'Project Task 1',
//       developer: 'bear.xiong',
//       avatar:
//         'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
//       start: '2024-07-24',
//       end: '2024-07-26',
//       progress: 31,
//       priority: 'P0',
//     },
//     {
//       id: 2,
//       title: 'Project Task 2',
//       developer: 'wolf.lang',
//       avatar:
//         'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg',
//       start: '07/25/2024',
//       end: '07/28/2024',
//       progress: 60,
//       priority: 'P0',
//     },
//     {
//       id: 3,
//       title: 'Project Task 3',
//       developer: 'rabbit.tu',
//       avatar:
//         'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg',
//       start: '2024-07-28',
//       end: '2024-08-01',
//       progress: 100,
//       priority: 'P1',
//     },
//     {
//       id: 1,
//       title: 'Project Task 4',
//       developer: 'cat.mao',
//       avatar:
//         'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg',
//       start: '2024-07-31',
//       end: '2024-08-03',
//       progress: 31,
//       priority: 'P0',
//     },
//     {
//       id: 2,
//       title: 'Project Task 5',
//       developer: 'bird.niao',
//       avatar:
//         'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bird.jpeg',
//       start: '2024-08-02',
//       end: '2024-08-04',
//       progress: 60,
//       priority: 'P0',
//     },
//     {
//       id: 3,
//       title: 'Project Task 6',
//       developer: 'flower.hua',
//       avatar:
//         'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg',
//       start: '2024-08-03',
//       end: '2024-08-10',
//       progress: 100,
//       priority: 'P1',
//     },
//   ]
//   const columns = [
//     {
//       field: 'title',
//       title: 'TASK',
//       width: '200', 
//       headerStyle: {
//         textAlign: 'center',
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: 'black',
//         bgColor: '#f0f0fb',
//       },
//       style: {
//         bgColor: '#f0f0fb',
//       },
//       customLayout: (args) => {
//         const { table, row, col, rect } = args
//         const taskRecord = table.getCellOriginRecord(col, row)
//         const { height, width } = rect ?? table.getCellRect(col, row)
//         const container = new VTableGantt.VRender.Group({
//           y: 0,
//           x: 0,
//           height: height,
//           width: width,
//           fill: 'white',
//           display: 'flex',
//           flexDirection: 'column',
//           cornerRadius: 30,
//         })
//         const developer = new VTableGantt.VRender.Text({
//           text: taskRecord.developer,
//           fontSize: 16,
//           fontFamily: 'sans-serif',
//           // fill: barColors[args.row],
//           fontWeight: 'bold',
//           maxLineWidth: width - 120,
//           boundsPadding: [10, 0, 0, 0],
//           alignSelf: 'center',
//         })
//         container.add(developer)

//         const days = new VTableGantt.VRender.Text({
//           text: `${VTableGantt.tools.formatDate(
//             new Date(taskRecord.start),
//             'mm/dd',
//           )}-${VTableGantt.tools.formatDate(
//             new Date(taskRecord.end),
//             'mm/dd',
//           )}`,
//           fontSize: 12,
//           fontFamily: 'sans-serif',
//           fontWeight: 'bold',
//           fill: 'black',
//           boundsPadding: [10, 0, 0, 0],
//           alignSelf: 'center',
//         })
//         container.add(days)

//         return {
//           rootContainer: container,
//           expectedWidth: 160,
//           renderDefault: false,
//         }
//       },
//     },
//   ]
//   const option = {
//     overscrollBehavior: 'none',
//     records,
//     columns,
//     taskListTable: {
//       columns,
//       tableWidth: 250,
//       minTableWidth: 100,
//       maxTableWidth: 600,
//       theme: {
//         headerStyle: {
//           borderColor: '#e1e4e8',
//           borderLineWidth: 1,
//           fontSize: 18,
//           fontWeight: 'bold',
//           color: 'red',
//           bgColor: '#EEF1F5',
//         },
//         bodyStyle: {
//           borderColor: '#e1e4e8',
//           borderLineWidth: [1, 0, 1, 0],
//           fontSize: 16,
//           color: '#4D4D4D',
//           bgColor: '#FFF',
//         },
//       },
//     },
//     frame: {
//       outerFrameStyle: {
//         borderLineWidth: 2,
//         borderColor: '#e1e4e8',
//         cornerRadius: 8,
//       },
//       verticalSplitLineMoveable: true,
//       verticalSplitLine: {
//         lineColor: '#e1e4e8',
//         lineWidth: 3,
//       },
//       horizontalSplitLine: {
//         lineColor: '#e1e4e8',
//         lineWidth: 3,
//       },
//     },
//     grid: {
//       verticalLine: {
//         lineWidth: 1,
//         lineColor: '#e1e4e8',
//       },
//       horizontalLine: {
//         lineWidth: 1,
//         lineColor: '#e1e4e8',
//       },
//     },
//     headerRowHeight: 40,
//     rowHeight: 40,
//     taskBar: {
//       startDateField: 'start',
//       endDateField: 'end',
//       progressField: 'progress',
//       resizable: true,
//       // moveable: true,
//       moveable: false,
//       hoverBarStyle: {
//         barOverlayColor: 'rgba(99, 144, 0, 0.4)',
//       },
//       labelText: '{title} {progress}%',
//       labelTextStyle: {
//         // padding: 2,
//         fontFamily: 'Arial',
//         fontSize: 16,
//         textAlign: 'left',
//         textOverflow: 'ellipsis',
//       },
//       barStyle: {
//         width: 20,
//         /** 任务条的颜色 */
//         barColor: '#ee8800',
//         /** 已完成部分任务条的颜色 */
//         completedBarColor: '#91e8e0',
//         /** 任务条的圆角 */
//         cornerRadius: 8,
//         /** 任务条的边框 */
//         borderLineWidth: 1,
//         /** 边框颜色 */
//         borderColor: 'black',
//       },
//       scheduleCreation: {
//         buttonStyle: {
//           backgroundColor: '#f7f7f5',
//           lineColor: '#808080',
//           lineWidth: 1,
//           lineDash: [5, 5],
//         },
//       },
//     },
//     timelineHeader: {
//       colWidth: 100,
//       backgroundColor: '#EEF1F5',
//       horizontalLine: {
//         lineWidth: 1,
//         lineColor: '#e1e4e8',
//       },
//       verticalLine: {
//         lineWidth: 1,
//         lineColor: '#e1e4e8',
//       },
//       scales: [
//         {
//           unit: 'week',
//           step: 1,
//           startOfWeek: 'sunday',
//           format(date) {
//             return `Week ${date.dateIndex}`
//           },
//           style: {
//             fontSize: 20,
//             fontWeight: 'bold',
//             color: 'white',
//             strokeColor: 'black',
//             textAlign: 'right',
//             textBaseline: 'bottom',
//             backgroundColor: '#EEF1F5',
//             textStick: true,
//             // padding: [0, 30, 0, 20]
//           },
//         },
//         {
//           unit: 'day',
//           step: 1,
//           format(date) {
//             return date.dateIndex.toString()
//           },
//           style: {
//             fontSize: 20,
//             fontWeight: 'bold',
//             color: 'white',
//             strokeColor: 'black',
//             textAlign: 'right',
//             textBaseline: 'bottom',
//             backgroundColor: '#EEF1F5',
//           },
//         },
//       ],
//     },
//     markLine: [
//       {
//         date: '2024-07-28',
//         style: {
//           lineWidth: 1,
//           lineColor: 'blue',
//           lineDash: [8, 4],
//         },
//       },
//       {
//         date: '2024-08-17',
//         style: {
//           lineWidth: 2,
//           lineColor: 'red',
//           lineDash: [8, 4],
//         },
//       },
//     ],
//     rowSeriesNumber: {
//       title: '行号',
//       dragOrder: true,
//       headerStyle: {
//         bgColor: '#EEF1F5',
//         borderColor: '#e1e4e8',
//       },
//       style: {
//         borderColor: '#e1e4e8',
//       },
//     },
//     scrollStyle: {
//       scrollRailColor: 'RGBA(246,246,246,0.5)',
//       visible: 'scrolling',
//       width: 6,
//       scrollSliderCornerRadius: 2,
//       scrollSliderColor: '#5cb85c',
//     },
//   }
//   if (opt == true) {
//     return option
//   }
//   //@ts-ignore
//   ganttInstance = new window.VTableGantt.Gantt(
//     el,
//     //@ts-ignore
//     option,
//   )
//   ganttInstance.on('click_task_bar', (e) => {
//     console.log('click_task_bar', e)
//   })
//   ganttInstance.on('create_task_schedule', (e) => {
//     console.log('create_task_schedule', e)
//   })
// }
