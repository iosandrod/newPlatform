// /*
//  * @Author: ROYIANS
//  * @Date: 2022/11/22 15:32
//  * @Description: 输入表格数据，自动生成分页表格
//  * @sign:
//  * ╦═╗╔═╗╦ ╦╦╔═╗╔╗╔╔═╗
//  * ╠╦╝║ ║╚╦╝║╠═╣║║║╚═╗
//  * ╩╚═╚═╝ ╩ ╩╩ ╩╝╚╝╚═╝
//  */
// import { StyledSimpleText, StyledText } from '@/printTemplate/components/PageComponents/style'
// import Vue from 'vue'
// import { RenderUtil } from '@/printTemplate/components/Viewer/render-util'

// export class AutoTable {
//   constructor({ type, propValue, dataSet, dataSource }) {
//     this.type = type
//     this.propValue = propValue
//     this.dataSet = dataSet
//     this.dataSource = dataSource
//   }

//   getPagedTable() {
//     return [this.getOriginTableItem()]
//   }

//   getOriginTableItem() {
//     switch (this.type) {
//       case 'RoySimpleTable':
//         return this.generateSimpleTable()
//       case 'RoyComplexTable':
//         return this.generateComplexTable()
//     }
//   }

//   generateSimpleTable() {
//     const { tableConfig, tableData } = this.propValue
//     const { rows, cols } = tableConfig
//     const hiddenTdMap = this.getHiddenTd()
//     const tableHeadStart = '<table>'
//     const tableHeadEnd = '</table>'
//     const tableBodyStart = '<tbody>'
//     const tableBodyEnd = '</tbody>'
//     const trHtml = Array.apply(null, Array(rows))
//       .map((_, rI) => {
//         const rowIndex = rI + 1
//         const tdHtml = Array.apply(null, Array(cols))
//           .map((_, cI) => {
//             const colIndex = cI + 1
//             const notShowThisTd = hiddenTdMap[`${rI}_${cI}`]
//             const rowSpan = this.getItRowSpan(rowIndex, colIndex)
//             const colSpan = this.getItColSpan(rowIndex, colIndex)
//             const curTableData = tableData[`${rowIndex}-${colIndex}`]
//             let innerHtml = ''
//             switch (curTableData.component) {
//               case 'RoySimpleTextIn':
//                 innerHtml = this.generateSimpleText(curTableData)
//                 break
//               case 'RoyTextIn':
//                 innerHtml = this.generateRichText(curTableData)
//                 break
//             }
//             return `
//               <td
//                 style='
//                   ${notShowThisTd ? 'display: none;' : ''}
//                   ${
//                     curTableData.component !== 'RoyTextIn'
//                       ? `height: ${curTableData.height}px;`
//                       : ''
//                   }
//                   width: ${curTableData.width}px;
//                   padding: 0;
//                 '
//                 rowspan='${rowSpan}'
//                 colspan='${colSpan}'
//               >${innerHtml}</td>
//             `
//           })
//           .join('')
//         return `<tr class='roy-simple-table-row'>${tdHtml}</tr>`
//       })
//       .join('')
//     return `${tableHeadStart}${tableBodyStart} ${trHtml} ${tableBodyEnd}${tableHeadEnd}`
//   }

//   generateComplexTable() {
//     const { tableRowHeight, tableDataSource, tableCols, bodyTableWidth } = this.propValue
//     let tableRowHeightPx = `${tableRowHeight}px`
//     const tableData = this.dataSet[tableDataSource] || []
//     const tableHead = tableCols
//       .map((item) => {
//         return `<th style='width: ${item.width}px;'><div class="roy-complex-table-cell-in" style='justify-content: center;'>
//                     <div style='min-height: ${tableRowHeightPx};line-height: ${tableRowHeightPx};padding: 3px'>${item.title}</div>
//                 </div></th>`
//       })
//       .join('')
//     let widthList = tableCols.map((item) => {
//       return item.width
//     })
//     const tableBody = tableData
//       .map((row) => {
//         let tdEle = tableCols
//           .map((col, index) => {
//             const { field, formatter, align } = col
//             return `<td style="width: ${
//               widthList[index]
//             }px;"><div class="roy-complex-table-cell-in" style='justify-content: ${align}'>
//                         <div style='min-height: ${tableRowHeightPx};padding: 3px;display: flex;align-items: center'>${RenderUtil.getDataWithTypeConvertedByDataSource(
//               row[field],
//               formatter
//             )}</div>
//             </div></td>`
//           })
//           .join('')
//         return `<tr class="roy-complex-table-row">${tdEle}</tr>`
//       })
//       .join('')
//     return {
//       tableStart: `<table class="rendered-roy-complex-table__body" style="width: ${bodyTableWidth}px">`,
//       tableHead: `<thead class="roy-complex-table-thead">${tableHead}</thead>`,
//       tableBody: `<tbody>${tableBody}</tbody>`,
//       tableEnd: '</table>',
//       tableWidth: bodyTableWidth
//     }
//   }

//   generateSimpleText(element) {
//     let StyledSimpleTextConstructor = Vue.extend(StyledSimpleText)
//     const { propValue, bindValue, style } = element
//     let afterPropValue = propValue
//     if (bindValue) {
//       const { field } = bindValue
//       afterPropValue = RenderUtil.getDataConvertedByDataSource(
//         this.dataSet[field],
//         field,
//         this.dataSource
//       )
//     }
//     const instance = new StyledSimpleTextConstructor({
//       propsData: style
//     })
//     instance.$mount()
//     const newElement = instance.$el
//     newElement.style.width = '100%'
//     newElement.style.height = `${element.height}px`
//     newElement.style.position = 'static'
//     newElement.innerHTML = `<div class="roy-simple-text-inner">${afterPropValue}</div>`
//     newElement.style.height = `${element.height}px`
//     const res = newElement.outerHTML
//     instance.$destroy()
//     return res
//   }

//   generateRichText(element) {
//     let StyledTextConstructor = Vue.extend(StyledText)
//     const { propValue, style } = element
//     const afterPropValue = RenderUtil.replaceTextWithDataSource(
//       propValue,
//       this.dataSet,
//       this.dataSource
//     )
//     const instance = new StyledTextConstructor({
//       propsData: style
//     })
//     instance.$mount()
//     const newElement = instance.$el
//     newElement.style.width = '100%'
//     newElement.style.position = 'static'
//     newElement.innerHTML = `<div class="roy-text-inner">${afterPropValue}</div>`
//     const res = newElement.outerHTML
//     instance.$destroy()
//     return res
//   }

//   getHiddenTd() {
//     let hiddenTdMaps = {}
//     let { tableConfig } = this.propValue
//     for (let i = 0; i < tableConfig.rows; i++) {
//       for (let j = 0; j < tableConfig.cols; j++) {
//         if (tableConfig.layoutDetail[i * tableConfig.cols + j]) {
//           let colInfo = tableConfig.layoutDetail[i * tableConfig.cols + j]
//           if (
//             (colInfo.colSpan && colInfo.colSpan > 1) ||
//             (colInfo.rowSpan && colInfo.rowSpan > 1)
//           ) {
//             for (let row = i; row < i + (colInfo.rowSpan || 1); row++) {
//               // col = (row === i ? j + 1 : j) 是为了避开自己
//               for (let col = row === i ? j + 1 : j; col < j + (colInfo.colSpan || 1); col++) {
//                 hiddenTdMaps[`${row}_${col}`] = true
//               }
//             }
//           }
//         }
//       }
//     }
//     return hiddenTdMaps
//   }

//   getItColSpan(row, col) {
//     let { tableConfig } = this.propValue
//     return (
//       tableConfig.layoutDetail[(row - 1) * tableConfig.cols + col - 1] &&
//       tableConfig.layoutDetail[(row - 1) * tableConfig.cols + col - 1].colSpan
//     )
//   }

//   getItRowSpan(row, col) {
//     let { tableConfig } = this.propValue
//     return (
//       tableConfig.layoutDetail[(row - 1) * tableConfig.cols + col - 1] &&
//       tableConfig.layoutDetail[(row - 1) * tableConfig.cols + col - 1].rowSpan
//     )
//   }
// }


/*
 * @Author: ROYIANS
 * @Date: 2022/11/22 15:32
 * @Description: 输入表格数据，自动生成分页表格
 * @sign:
 * ╦═╗╔═╗╦ ╦╦╔═╗╔╗╔╔═╗
 * ╠╦╝║ ║╚╦╝║╠═╣║║║╚═╗
 * ╩╚═╚═╝ ╩ ╩╩ ╩╝╚╝╚═╝
 */
import { createVNode, render } from 'vue'
import { StyledSimpleText, StyledText } from '@/printTemplate/components/PageComponents/style'
import { RenderUtil } from '@/printTemplate/components/Viewer/render-util'

export class AutoTable {
  constructor({ type, propValue, dataSet, dataSource }) {
    this.type = type
    this.propValue = propValue
    this.dataSet = dataSet
    this.dataSource = dataSource
  }

  getPagedTable() {
    return [this.getOriginTableItem()]
  }

  getOriginTableItem() {
    switch (this.type) {
      case 'RoySimpleTable':
        return this.generateSimpleTable()
      case 'RoyComplexTable':
        return this.generateComplexTable()
    }
  }

  generateSimpleTable() {
    const { tableConfig, tableData } = this.propValue
    const { rows, cols } = tableConfig
    const hiddenTdMap = this.getHiddenTd()
    const trHtml = Array.from({ length: rows }).map((_, rI) => {
      const rowIndex = rI + 1
      const tdHtml = Array.from({ length: cols }).map((_, cI) => {
        const colIndex = cI + 1
        const notShow = hiddenTdMap[`${rI}_${cI}`]
        const rowSpan = this.getItRowSpan(rowIndex, colIndex)
        const colSpan = this.getItColSpan(rowIndex, colIndex)
        const cell = tableData[`${rowIndex}-${colIndex}`]
        let inner = ''
        if (cell.component === 'RoySimpleTextIn') {
          inner = this.generateSimpleText(cell)
        } else if (cell.component === 'RoyTextIn') {
          inner = this.generateRichText(cell)
        }
        return `
          <td
            style="
              ${notShow ? 'display:none;' : ''}
              ${cell.component !== 'RoyTextIn' ? `height:${cell.height}px;` : ''}
              width:${cell.width}px;
              padding:0;
            "
            rowspan="${rowSpan}"
            colspan="${colSpan}"
          >${inner}</td>`
      }).join('')
      return `<tr class="roy-simple-table-row">${tdHtml}</tr>`
    }).join('')
    return `<table><tbody>${trHtml}</tbody></table>`
  }

  generateComplexTable() {
    const { tableRowHeight, tableDataSource, tableCols, bodyTableWidth } = this.propValue
    const tableData = this.dataSet[tableDataSource] || []
    const trHeight = `${tableRowHeight}px`
    const headHtml = tableCols.map(col => `
      <th style="width:${col.width}px">
        <div class="roy-complex-table-cell-in" style="justify-content:center">
          <div style="min-height:${trHeight};line-height:${trHeight};padding:3px">
            ${col.title}
          </div>
        </div>
      </th>
    `).join('')
    const bodyHtml = tableData.map(row => {
      const tds = tableCols.map((col, idx) => `
        <td style="width:${col.width}px">
          <div class="roy-complex-table-cell-in" style="justify-content:${col.align}">
            <div style="min-height:${trHeight};padding:3px;display:flex;align-items:center">
              ${RenderUtil.getDataWithTypeConvertedByDataSource(row[col.field], col.formatter)}
            </div>
          </div>
        </td>
      `).join('')
      return `<tr class="roy-complex-table-row">${tds}</tr>`
    }).join('')
    return {
      tableStart: `<table class="rendered-roy-complex-table__body" style="width:${bodyTableWidth}px">`,
      tableHead: `<thead class="roy-complex-table-thead">${headHtml}</thead>`,
      tableBody: `<tbody>${bodyHtml}</tbody>`,
      tableEnd: '</table>',
      tableWidth: bodyTableWidth
    }
  }

  generateSimpleText(element) {
    const { propValue, bindValue, style, height } = element
    let text = propValue
    if (bindValue) {
      text = RenderUtil.getDataConvertedByDataSource(
        this.dataSet[bindValue.field],
        bindValue.field,
        this.dataSource
      )
    }
    // 动态渲染 StyledSimpleText
    const container = document.createElement('div')
    const vnode = createVNode(StyledSimpleText, style)
    render(vnode, container)
    const el = container.firstElementChild
    el.style.width = '100%'
    el.style.height = `${height}px`
    el.style.position = 'static'
    el.innerHTML = `<div class="roy-simple-text-inner">${text}</div>`
    const html = el.outerHTML
    render(null, container) // 卸载
    return html
  }

  generateRichText(element) {
    const { propValue, style } = element
    const text = RenderUtil.replaceTextWithDataSource(
      propValue, this.dataSet, this.dataSource
    )
    const container = document.createElement('div')
    const vnode = createVNode(StyledText, style)
    render(vnode, container)
    const el = container.firstElementChild
    el.style.width = '100%'
    el.style.position = 'static'
    el.innerHTML = `<div class="roy-text-inner">${text}</div>`
    const html = el.outerHTML
    render(null, container)
    return html
  }

  getHiddenTd() {
    const { rows, cols, layoutDetail } = this.propValue.tableConfig
    const map = {}
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const info = layoutDetail[i * cols + j]
        if (info && (info.colSpan > 1 || info.rowSpan > 1)) {
          for (let r = i; r < i + (info.rowSpan || 1); r++) {
            for (let c = (r === i ? j + 1 : j); c < j + (info.colSpan || 1); c++) {
              map[`${r}_${c}`] = true
            }
          }
        }
      }
    }
    return map
  }

  getItColSpan(row, col) {
    const info = this.propValue.tableConfig.layoutDetail[(row-1)*this.propValue. tableConfig.cols + (col-1)]
    return info?.colSpan || 1
  }

  getItRowSpan(row, col) {
    const info = this.propValue.tableConfig.layoutDetail[(row-1)*this.propValue.tableConfig.cols + (col-1)]
    return info?.rowSpan || 1
  }
}
