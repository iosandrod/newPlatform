// export const getDefaultGanttConfig = () => {
//   let obj = {
//     // taskListTable: {
//     //   tableWidth: 250,
//     //   minTableWidth: 100,
//     //   maxTableWidth: 600,
//     //   theme: {
//     //     headerStyle: {
//     //       borderColor: '#e1e4e8',
//     //       borderLineWidth: 1,
//     //       fontSize: 18,
//     //       fontWeight: 'bold',
//     //       color: 'red',
//     //       bgColor: '#EEF1F5',
//     //     },
//     //     bodyStyle: {
//     //       borderColor: '#e1e4e8',
//     //       borderLineWidth: [1, 0, 1, 0],
//     //       fontSize: 16,
//     //       color: '#4D4D4D',
//     //       bgColor: '#FFF',
//     //     },
//     //   },
//     // },
//     taskBar: {
//       startDateField: 'start',
//       endDateField: 'end',
//       progressField: 'progress',
//       resizable: true,
//       moveable: true,
//       // customLayout: (args) => {
//       //   return {
//       //     rootContainer: null,
//       //     renderDefault: true,
//       //   }
//       // },
//       // moveable: false,
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
//   }
//   return obj //
// }
