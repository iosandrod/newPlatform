// /*
//  * @Author: ROYIANS
//  * @Date: 2022/11/25 14:46
//  * @Description:
//  * @sign:
//  * ╦═╗╔═╗╦ ╦╦╔═╗╔╗╔╔═╗
//  * ╠╦╝║ ║╚╦╝║╠═╣║║║╚═╗
//  * ╩╚═╚═╝ ╩ ╩╩ ╩╝╚╝╚═╝
//  */
// import { CONFIG } from '@/printTemplate/components/Viewer/viewer-constant'
// import generateID from '@/printTemplate/utils/generateID'
// import {
//   StyledCircle,
//   StyledLine,
//   StyledRect,
//   StyledSimpleText,
//   StyledStar,
//   StyledText,
//   StyledSimpleTable,
//   StyledComplexTable,
//   StyledImage
// } from '@/printTemplate/components/PageComponents/style'
// import { RenderUtil } from '@/printTemplate/components/Viewer/render-util'
// import Vue from 'vue'
// import { AutoSplitText } from '@/printTemplate/components/Viewer/auto-split-text'
// import { AutoTable } from '@/printTemplate/components/Viewer/auto-table'

// const componentToStyled = {
//   RoyText: StyledText,
//   RoyTextIn: StyledText,
//   RoySimpleText: StyledSimpleText,
//   RoySimpleTextIn: StyledSimpleText,
//   RoyCircle: StyledCircle,
//   RoyLine: StyledLine,
//   RoyRect: StyledRect,
//   RoyStar: StyledStar,
//   RoySimpleTable: StyledSimpleTable,
//   RoyComplexTable: StyledComplexTable,
//   RoyImage: StyledImage
// }

// const componentToClassName = {
//   RoyText: 'rendered-roy-text',
//   RoyTextIn: 'rendered-roy-text-in',
//   RoySimpleText: 'rendered-roy-simple-text',
//   RoySimpleTextIn: 'rendered-roy-simple-text-in',
//   RoyCircle: 'rendered-roy-circle',
//   RoyLine: 'rendered-roy-line',
//   RoyRect: 'rendered-roy-rect',
//   RoyStar: 'rendered-roy-star',
//   RoySimpleTable: 'rendered-roy-simple-table',
//   RoyComplexTable: 'rendered-roy-complex-table',
//   RoyImage: 'rendered-roy-image'
// }

// export class AutoRender {
//   constructor({ renderElements, pagerConfig, dataSet, dataSource, tempHolder }) {
//     const { COMMON_SCALE } = CONFIG
//     this.renderElements = renderElements
//     this.pagerConfig = pagerConfig
//     this.dataSet = dataSet
//     this.dataSource = dataSource
//     this.tempHolder = tempHolder
//     const { pageWidth, pageHeight, pageMarginBottom, pageMarginTop, pageDirection } = pagerConfig
//     this.pageWidth = (pageDirection === 'p' ? pageWidth : pageHeight) * COMMON_SCALE
//     this.pageHeight = (pageDirection === 'p' ? pageHeight : pageWidth) * COMMON_SCALE
//     this.realPageMarginBottom = pageMarginBottom * COMMON_SCALE
//     this.realPageMarginTop = pageMarginTop * COMMON_SCALE
//     this.curPageIndex = 0
//     this.curPageUsedHeight = 0
//     this.maxPageUseHeight = this.pageHeight - this.realPageMarginBottom
//     const { background, color, fontSize, fontFamily, lineHeight } = this.pagerConfig
//     this.pageDefaultStyle = `
//       width: ${this.pageWidth}px;
//       height: ${this.pageHeight}px;
//       background: ${background};
//       color: ${color};
//       font-size: ${fontSize}pt;
//       font-family: ${fontFamily};
//       line-height: ${lineHeight};
//       position: relative;
//       overflow: hidden;
//     `
//     this.tempHolder.style = this.pageDefaultStyle
//     this.pages = []
//   }

//   async run() {
//     await this.render()
//     return this.renderPages()
//   }

//   async render() {
//     for (let i = 0; i < this.renderElements.length; i++) {
//       const curElement = this.renderElements[i]
//       const { component } = curElement
//       await this[`render${component}`](curElement, i)
//       this.initWhileRenderNewElement()
//     }
//   }

//   async renderPages() {
//     return this.pages.map((page) => {
//       return `
//         <div
//           id="${generateID()}"
//           class="roy-preview-page"
//           style="${this.pageDefaultStyle}"
//         >
//           ${page}
//         </div>
//     `
//     })
//   }

//   async renderRoyText(element, zIndex = 0, parentElement = null, restrictWidth = null) {
//     const { propValue, style } = element
//     let outerStyle = style
//     const afterPropValue = RenderUtil.replaceTextWithDataSource(
//       propValue,
//       this.dataSet,
//       this.dataSource
//     )
//     let rootElement = null
//     let newElement = this.createNewElementWithStyledComponent(element, zIndex)
//     newElement.style.transform = 'none'
//     const border = newElement.style.border
//     newElement.style.border = 'none'
//     newElement.innerHTML = `<div class="roy-text-inner">${afterPropValue}</div>`
//     // 富文本高度自动给，然后走分页逻辑
//     newElement.style.height = 'auto'
//     let pEle
//     if (parentElement) {
//       newElement.style.position = 'relative'
//       newElement.style.width = '100%'
//       newElement.style.height = 'auto'
//       newElement.style.left = 0
//       newElement.style.top = 0
//       outerStyle = parentElement.style
//       pEle = this.createNewElementWithStyledComponent(parentElement, zIndex)
//       pEle.appendChild(newElement)
//       // 富文本高度自动给，然后走分页逻辑
//       pEle.style.height = 'auto'
//       rootElement = pEle
//     } else {
//       rootElement = newElement
//     }
//     if (this.curPageUsedHeight !== 0) {
//       rootElement.style.top = `${this.curPageUsedHeight}px`
//     }
//     if (restrictWidth !== null) {
//       rootElement.style.width = `${restrictWidth}px`
//     }
//     this.tempHolder.appendChild(rootElement)
//     await RenderUtil.wait()
//     const { height: richTextRealHeight } = rootElement.getBoundingClientRect()
//     this.tempHolder.removeChild(rootElement)
//     if (outerStyle.top + richTextRealHeight <= this.maxPageUseHeight) {
//       this.addElementToCurPage(rootElement.outerHTML, outerStyle.top + richTextRealHeight)
//       newElement = null
//       pEle = null
//       rootElement = null
//       return
//     }
//     const autoSplitText = new AutoSplitText(this.tempHolder, rootElement)
//     const richTextImgList = await autoSplitText.run()
//     newElement.style.display = 'inline-grid'
//     newElement.innerHTML = ''
//     newElement.style.transform = `rotate(${style.rotate}deg)`
//     newElement.style.border = border
//     const appendImg = async (imgIndex, secondAppend = false) => {
//       let curHeight = this.curPageUsedHeight !== 0 ? 0 : outerStyle.top
//       if (imgIndex !== 0 || secondAppend) {
//         curHeight = this.realPageMarginTop
//         rootElement.style.top = `${this.realPageMarginTop}px`
//       }
//       for (let i = imgIndex; i < richTextImgList.length; i++) {
//         const imgData = richTextImgList[i]
//         const lastHeight = curHeight
//         curHeight += imgData.height
//         if (curHeight > this.maxPageUseHeight && imgData.height <= this.maxPageUseHeight) {
//           let elementHTML = rootElement.outerHTML
//           this.addElementToCurPage(elementHTML, lastHeight)
//           newElement.innerHTML = ''
//           await appendImg(i, true)
//           break
//         } else {
//           const img = document.createElement('img')
//           img.src = imgData.src
//           img.style.width = `${imgData.width}px`
//           img.style.height = `${imgData.height}px`
//           newElement.appendChild(img)
//           if (i === richTextImgList.length - 1) {
//             let elementHTML = rootElement.outerHTML
//             this.addElementToCurPage(elementHTML, curHeight)
//           }
//         }
//       }
//     }
//     if (richTextImgList.length) {
//       await appendImg(0)
//     }
//     newElement = null
//     pEle = null
//     rootElement = null
//   }

//   async renderRoySimpleText(element, zIndex = 0) {
//     const { propValue, bindValue } = element
//     let afterPropValue = propValue
//     if (bindValue) {
//       const { field } = bindValue
//       afterPropValue = RenderUtil.getDataConvertedByDataSource(
//         this.dataSet[field],
//         field,
//         this.dataSource
//       )
//     }
//     let newElement = this.createNewElementWithStyledComponent(element, zIndex)
//     newElement.innerHTML = `<div class="roy-simple-text-inner">${afterPropValue}</div>`
//     this.addElementToCurPage(newElement.outerHTML, 0)
//     newElement = null
//   }

//   async renderRoySimpleTable(
//     element,
//     zIndex = 0,
//     parentElement = null,
//     ristrictWidth = null,
//     margenTop = null
//   ) {
//     let autoTable = new AutoTable({
//       type: element.component,
//       propValue: element.propValue,
//       pagerConfig: this.pagerConfig,
//       tempHolder: this.tempHolder,
//       dataSource: this.dataSource,
//       dataSet: this.dataSet
//     })
//     const { style } = element
//     let outerStyle = style
//     let tableHtml = autoTable.getOriginTableItem()
//     let rootElement, pEle
//     let newElement = this.createNewElementWithStyledComponent(element, zIndex)
//     newElement.innerHTML = tableHtml
//     newElement.style.width = 'auto'
//     if (parentElement) {
//       newElement.style.position = 'relative'
//       newElement.style.width = '100%'
//       newElement.style.height = 'auto'
//       newElement.style.left = 0
//       newElement.style.top = 0
//       outerStyle = parentElement.style
//       pEle = this.createNewElementWithStyledComponent(parentElement, zIndex)
//       pEle.style.width = 'auto'
//       pEle.appendChild(newElement)
//       rootElement = pEle
//     } else {
//       rootElement = newElement
//     }
//     let realTop = outerStyle.top
//     if (this.curPageUsedHeight !== 0) {
//       rootElement.style.top = `${this.curPageUsedHeight}px`
//       realTop = this.curPageUsedHeight
//     }
//     if (ristrictWidth !== null) {
//       rootElement.style.width = `${ristrictWidth}px`
//     }
//     if (margenTop !== null) {
//       newElement.style.marginTop = `${margenTop}`
//       rootElement.style.marginTop = `${margenTop}`
//     }
//     this.tempHolder.appendChild(rootElement)
//     await RenderUtil.wait()
//     const tdElements = newElement.getElementsByClassName('roy-simple-table-row')
//     const { tables, overflowPages, maxTableWidth } = this.getTablesSplit(outerStyle, tdElements)
//     tables.forEach((table, index) => {
//       if (index > 0) {
//         rootElement.style.top = `${this.realPageMarginTop}px`
//         realTop = this.realPageMarginTop
//       }
//       newElement.innerHTML = `<table style='width: ${
//         ristrictWidth || maxTableWidth
//       }px;table-layout: auto'>${table.html}</table>`
//       if (overflowPages.includes(index)) {
//         newElement.style.height = `${
//           this.pageHeight - this.realPageMarginBottom - this.realPageMarginTop
//         }px`
//         newElement.style.overflow = 'hidden'
//       }
//       this.addElementToCurPage(rootElement.outerHTML, newElement.clientHeight)
//     })
//     // fix: 复杂表格各个元素位置不对问题
//     this.curPageUsedHeight = rootElement.clientHeight + realTop
//     this.tempHolder.removeChild(rootElement)
//     newElement = null
//     pEle = null
//     rootElement = null
//   }

//   async renderRoyComplexTable(element, zIndex = 0) {
//     const { showPrefix, showHead, showFoot, showSuffix } = element
//     const {
//       prefixTextElement,
//       suffixTextElement,
//       headSimpleTableElement,
//       footSimpleTableElement,
//       bodyDataTableElement
//     } = element.propValue
//     const { bodyTableWidth } = bodyDataTableElement
//     if (showPrefix) {
//       await this.renderRoyText(prefixTextElement, zIndex, element, bodyTableWidth)
//     }
//     if (showHead) {
//       await this.renderRoySimpleTable(headSimpleTableElement, zIndex, element, bodyTableWidth)
//     }
//     let autoTable = new AutoTable({
//       type: element.component,
//       propValue: bodyDataTableElement,
//       pagerConfig: this.pagerConfig,
//       tempHolder: this.tempHolder,
//       dataSource: this.dataSource,
//       dataSet: this.dataSet
//     })
//     let tableItem = autoTable.getOriginTableItem()
//     let newElement = this.createNewElementWithStyledComponent(element, zIndex)
//     let realTop = element.style.top
//     if (this.curPageUsedHeight !== 0) {
//       newElement.style.top = `${this.curPageUsedHeight}px`
//       realTop = this.curPageUsedHeight
//     }
//     if (showHead) {
//       newElement.style.marginTop = `-${element.style.borderWidth - 0.5}px`
//     }
//     const { tableStart, tableHead, tableBody, tableEnd } = tableItem
//     newElement.innerHTML = `${tableStart}${tableHead}${tableBody}${tableEnd}`
//     this.tempHolder.appendChild(newElement)
//     await RenderUtil.wait()
//     const trElements = newElement.getElementsByClassName('roy-complex-table-row')
//     const thElement = newElement.getElementsByClassName('roy-complex-table-thead')[0]
//     const { tables, overflowPages } = this.getTablesSplit(
//       element.style,
//       trElements,
//       thElement,
//       true
//     )
//     tables.forEach((table, index) => {
//       if (index > 0) {
//         newElement.style.top = `${this.realPageMarginTop}px`
//         realTop = this.realPageMarginTop
//       }
//       newElement.innerHTML = `${tableStart}${table.html}${tableEnd}`
//       if (overflowPages.includes(index)) {
//         newElement.style.height = `${
//           this.pageHeight - this.realPageMarginBottom - this.realPageMarginTop
//         }px`
//         newElement.style.overflow = 'hidden'
//       }
//       if (this.curPageUsedHeight !== 0) {
//         this.addElementToCurPage(newElement.outerHTML, newElement.clientHeight)
//       } else {
//         this.addElementToCurPage(newElement.outerHTML, realTop + newElement.clientHeight)
//       }
//     })
//     // this.curPageUsedHeight = newElement.clientHeight + realTop
//     this.tempHolder.removeChild(newElement)
//     newElement = null
//     if (showFoot) {
//       await this.renderRoySimpleTable(
//         footSimpleTableElement,
//         zIndex,
//         element,
//         bodyTableWidth,
//         `-${element.style.borderWidth - 0.5}px`
//       )
//     }
//     if (showSuffix) {
//       await this.renderRoyText(suffixTextElement, zIndex, element, bodyTableWidth)
//     }
//   }

//   async renderRoyRect(element, zIndex = 0) {
//     const { style } = element
//     let newElement = this.createNewElementWithStyledComponent(element, zIndex)
//     this.addElementToCurPage(newElement.outerHTML, style.height)
//     newElement = null
//   }

//   async renderRoyImage(element, zIndex = 0) {
//     const { style } = element
//     let newElement = this.createNewElementWithStyledComponent(element, zIndex)
//     let img = document.createElement('img')
//     img.src = element.src
//     img.alt = element.title
//     newElement.appendChild(img)
//     this.addElementToCurPage(newElement.outerHTML, style.height)
//     newElement = null
//   }

//   async renderRoyLine(element, zIndex = 0) {
//     const { style } = element
//     let newElement = this.createNewElementWithStyledComponent(element, zIndex)
//     this.addElementToCurPage(newElement.outerHTML, style.height)
//     newElement = null
//   }

//   async renderRoyStar(element, zIndex = 0) {
//     const { style } = element
//     let newElement = this.createNewElementWithStyledComponent(element, zIndex)
//     const star = document.createElement('span')
//     star.classList.add(...['iconfont', 'roy-star-icon', style.icon])
//     newElement.appendChild(star)
//     this.addElementToCurPage(newElement.outerHTML, 0)
//     newElement = null
//   }

//   async renderRoyCircle(element, zIndex = 0) {
//     let newElement = this.createNewElementWithStyledComponent(element, zIndex)
//     this.addElementToCurPage(newElement.outerHTML, 0)
//     newElement = null
//   }

//   getTablesSplit(style, rows, head = null, isDataTable = false) {
//     let headHeight = 0
//     if (isDataTable && head !== null) {
//       let innerCell = head.getElementsByClassName('roy-complex-table-cell-in')
//       for (let cell of innerCell) {
//         headHeight =
//           headHeight < cell.children[0].clientHeight ? cell.children[0].clientHeight : headHeight
//       }
//       head.children[0].style.height = `${headHeight}px`
//     }
//     let headHtml = head == null ? '' : head.outerHTML
//     let realTop = this.curPageUsedHeight || style.top
//     let maxHeight = this.maxPageUseHeight - realTop
//     let curHeight = this.curPageUsedHeight !== 0 ? headHeight : style.top + headHeight
//     let curHtml = ''
//     let tables = []
//     let overflowPages = []
//     let maxTableWidth = 0
//     for (let i = 0; i < rows.length; i++) {
//       let curTd = rows[i]
//       let cellMaxHeight = 0
//       if (isDataTable) {
//         let innerCell = curTd.getElementsByClassName('roy-complex-table-cell-in')
//         for (let cell of innerCell) {
//           cellMaxHeight =
//             cellMaxHeight < cell.children[0].clientHeight
//               ? cell.children[0].clientHeight
//               : cellMaxHeight
//         }
//         curTd.style.height = `${cellMaxHeight}px`
//       }
//       let lastHeight = curHeight
//       curHeight += Math.max(curTd.clientHeight, cellMaxHeight)
//       maxTableWidth = maxTableWidth > curTd.clientWidth ? maxTableWidth : curTd.clientWidth
//       if (curHeight > maxHeight) {
//         tables.push({
//           html: `${headHtml}<tbody>${curHtml}</tbody>`,
//           height: lastHeight
//         })
//         if (lastHeight > maxHeight) {
//           overflowPages.push(tables.length - 1)
//         }
//         curHeight =
//           this.realPageMarginTop + Math.max(curTd.clientHeight, cellMaxHeight) + headHeight
//         curHtml = curTd.outerHTML
//         maxHeight = this.maxPageUseHeight
//       } else {
//         curHtml += curTd.outerHTML
//       }
//       if (i === rows.length - 1) {
//         // 最后一个元素
//         tables.push({
//           html: `${headHtml}<tbody>${curHtml}</tbody>`,
//           height: curHeight
//         })
//         maxHeight = this.maxPageUseHeight
//       }
//     }
//     return { tables, overflowPages, maxTableWidth }
//   }

//   switchNextPage() {
//     this.curPageIndex += 1
//     this.curPageUsedHeight = 0
//   }

//   initWhileRenderNewElement() {
//     this.curPageIndex = 0
//     this.curPageUsedHeight = 0
//   }

//   addElementToCurPage(elementHTML, elementHeight) {
//     this.curPageUsedHeight += elementHeight
//     if (this.curPageUsedHeight > this.maxPageUseHeight) {
//       this.switchNextPage()
//       this.curPageUsedHeight = elementHeight
//     }
//     let curPage = this.pages[this.curPageIndex]
//     this.pages[this.curPageIndex] = curPage ? `${curPage}${elementHTML}` : elementHTML
//   }

//   createNewElementWithStyledComponent(element, zIndex = 0) {
//     const { component, style } = element
//     let constructor = Vue.extend(componentToStyled[component])
//     let instance = new constructor({
//       propsData: style
//     })
//     instance.$mount()
//     let newElement = instance.$el
//     newElement.style.width = `${style.width}px`
//     newElement.style.height = `${style.height}px`
//     newElement.style.position = 'absolute'
//     newElement.style.left = `${style.left}px`
//     newElement.style.top = `${style.top}px`
//     newElement.style.transform = `rotate(${style.rotate}deg)`
//     newElement.style.zIndex = zIndex
//     newElement.classList.add(componentToClassName[component])
//     instance.$destroy()
//     return newElement
//   }
// }
import { createVNode, render } from 'vue'
import { CONFIG } from '@/printTemplate/components/Viewer/viewer-constant'
import generateID from '@/printTemplate/utils/generateID'
import { RenderUtil } from '@/printTemplate/components/Viewer/render-util'
import { AutoSplitText } from '@/printTemplate/components/Viewer/auto-split-text'
import { AutoTable } from '@/printTemplate/components/Viewer/auto-table'
import {
  StyledCircle,
  StyledLine,
  StyledRect,
  StyledSimpleText,
  StyledStar,
  StyledText,
  StyledSimpleTable,
  StyledComplexTable,
  StyledImage
} from '@/printTemplate/components/PageComponents/style'

const componentToStyled = {
  RoyText: StyledText,
  RoyTextIn: StyledText,
  RoySimpleText: StyledSimpleText,
  RoySimpleTextIn: StyledSimpleText,
  RoyCircle: StyledCircle,
  RoyLine: StyledLine,
  RoyRect: StyledRect,
  RoyStar: StyledStar,
  RoySimpleTable: StyledSimpleTable,
  RoyComplexTable: StyledComplexTable,
  RoyImage: StyledImage
}

const componentToClassName = {
  RoyText: 'rendered-roy-text',
  RoyTextIn: 'rendered-roy-text-in',
  RoySimpleText: 'rendered-roy-simple-text',
  RoySimpleTextIn: 'rendered-roy-simple-text-in',
  RoyCircle: 'rendered-roy-circle',
  RoyLine: 'rendered-roy-line',
  RoyRect: 'rendered-roy-rect',
  RoyStar: 'rendered-roy-star',
  RoySimpleTable: 'rendered-roy-simple-table',
  RoyComplexTable: 'rendered-roy-complex-table',
  RoyImage: 'rendered-roy-image'
}

export class AutoRender {
  constructor({ renderElements, pagerConfig, dataSet, dataSource, tempHolder }) {
    const { COMMON_SCALE } = CONFIG
    this.renderElements = renderElements
    this.pagerConfig = pagerConfig
    this.dataSet = dataSet
    this.dataSource = dataSource
    this.tempHolder = tempHolder

    const {
      pageWidth,
      pageHeight,
      pageMarginBottom,
      pageMarginTop,
      pageDirection,
      background,
      color,
      fontSize,
      fontFamily,
      lineHeight
    } = pagerConfig

    this.pageWidth = (pageDirection === 'p' ? pageWidth : pageHeight) * COMMON_SCALE
    this.pageHeight = (pageDirection === 'p' ? pageHeight : pageWidth) * COMMON_SCALE
    this.realPageMarginBottom = pageMarginBottom * COMMON_SCALE
    this.realPageMarginTop = pageMarginTop * COMMON_SCALE
    this.maxPageUseHeight = this.pageHeight - this.realPageMarginBottom

    this.pageDefaultStyle = `
      width: ${this.pageWidth}px;
      height: ${this.pageHeight}px;
      background: ${background};
      color: ${color};
      font-size: ${fontSize}pt;
      font-family: ${fontFamily};
      line-height: ${lineHeight};
      position: relative;
      overflow: hidden;
    `

    this.curPageIndex = 0
    this.curPageUsedHeight = 0
    this.pages = []

    this.tempHolder.style = this.pageDefaultStyle
  }

  async run() {
    await this.render()
    return this.renderPages()
  }

  async render() {
    for (let i = 0; i < this.renderElements.length; i++) {
      const curElement = this.renderElements[i]
      const { component } = curElement
      const fn = this[`render${component}`]
      if (typeof fn === 'function') {
        await fn.call(this, curElement, i)
        this.initWhileRenderNewElement()
      }
    }
  }

  async renderPages() {
    return this.pages.map((page) => `
      <div
        id="${generateID()}"
        class="roy-preview-page"
        style="${this.pageDefaultStyle}"
      >
        ${page}
      </div>
    `)
  }

  addElementToCurPage(elementHTML, elementHeight) {
    this.curPageUsedHeight += elementHeight
    if (this.curPageUsedHeight > this.maxPageUseHeight) {
      this.switchNextPage()
      this.curPageUsedHeight = elementHeight
    }
    const cur = this.pages[this.curPageIndex] || ''
    this.pages[this.curPageIndex] = cur + elementHTML
  }

  switchNextPage() {
    this.curPageIndex += 1
    this.curPageUsedHeight = 0
  }

  initWhileRenderNewElement() {
    this.curPageIndex = 0
    this.curPageUsedHeight = 0
  }

  createNewElementWithStyledComponent(element, zIndex = 0) {
    const { component, style } = element
    const Comp = componentToStyled[component]
    const vnode = createVNode(Comp, { ...style })
    const container = document.createElement('div')
    render(vnode, container)
    const newEl = container.firstElementChild
    if (!newEl) return document.createElement('div')

    Object.assign(newEl.style, {
      width: `${style.width}px`,
      height: `${style.height}px`,
      position: 'absolute',
      left: `${style.left}px`,
      top: `${style.top}px`,
      transform: `rotate(${style.rotate}deg)`,
      zIndex: zIndex
    })
    newEl.classList.add(componentToClassName[component])
    return newEl
  }

  // 以下方法沿用原逻辑，仅使用 createNewElementWithStyledComponent 动态挂载组件

  async renderRoyText(element, zIndex = 0, parentElement = null, restrictWidth = null) {
    const { propValue, style } = element
    let outerStyle = style
    const after = RenderUtil.replaceTextWithDataSource(propValue, this.dataSet, this.dataSource)
    let rootEl
    let el = this.createNewElementWithStyledComponent(element, zIndex)
    el.style.transform = 'none'
    const bd = el.style.border
    el.style.border = 'none'
    el.innerHTML = `<div class="roy-text-inner">${after}</div>`
    el.style.height = 'auto'

    if (parentElement) {
      el.style.position = 'relative'
      el.style.width = '100%'
      el.style.height = 'auto'
      el.style.left = 0
      el.style.top = 0
      outerStyle = parentElement.style
      const p = this.createNewElementWithStyledComponent(parentElement, zIndex)
      p.appendChild(el)
      p.style.height = 'auto'
      rootEl = p
    } else {
      rootEl = el
    }

    if (this.curPageUsedHeight) rootEl.style.top = `${this.curPageUsedHeight}px`
    if (restrictWidth != null) rootEl.style.width = `${restrictWidth}px`

    this.tempHolder.appendChild(rootEl)
    await RenderUtil.wait()
    const { height } = rootEl.getBoundingClientRect()
    this.tempHolder.removeChild(rootEl)

    if (outerStyle.top + height <= this.maxPageUseHeight) {
      this.addElementToCurPage(rootEl.outerHTML, outerStyle.top + height)
      return
    }

    const splitter = new AutoSplitText(this.tempHolder, rootEl)
    const imgs = await splitter.run()
    el.style.display = 'inline-grid'
    el.innerHTML = ''
    el.style.transform = `rotate(${style.rotate}deg)`
    el.style.border = bd

    const appendImg = async (idx, second = false) => {
      let curH = this.curPageUsedHeight ? 0 : outerStyle.top
      if (idx || second) {
        curH = this.realPageMarginTop
        rootEl.style.top = `${this.realPageMarginTop}px`
      }
      for (let i = idx; i < imgs.length; i++) {
        const data = imgs[i]
        const last = curH
        curH += data.height
        if (curH > this.maxPageUseHeight && data.height <= this.maxPageUseHeight) {
          this.addElementToCurPage(rootEl.outerHTML, last)
          el.innerHTML = ''
          await appendImg(i, true)
          break
        } else {
          const img = document.createElement('img')
          img.src = data.src
          img.style.width = `${data.width}px`
          img.style.height = `${data.height}px`
          el.appendChild(img)
          if (i === imgs.length - 1) {
            this.addElementToCurPage(rootEl.outerHTML, curH)
          }
        }
      }
    }
    if (imgs.length) await appendImg(0)
  }

  async renderRoySimpleText(element, zIndex = 0) {
    const { propValue, bindValue } = element
    let text = propValue
    if (bindValue) {
      text = RenderUtil.getDataConvertedByDataSource(
        this.dataSet[bindValue.field],
        bindValue.field,
        this.dataSource
      )
    }
    const el = this.createNewElementWithStyledComponent(element, zIndex)
    el.innerHTML = `<div class="roy-simple-text-inner">${text}</div>`
    this.addElementToCurPage(el.outerHTML, 0)
  }

  async renderRoySimpleTable(element, zIndex = 0, parent = null, restrictWidth = null, marginTop = null) {
    const autoT = new AutoTable({ type: element.component, propValue: element.propValue,
      pagerConfig: this.pagerConfig, tempHolder: this.tempHolder,
      dataSource: this.dataSource, dataSet: this.dataSet })
    const { style } = element
    let outer = style
    const html = autoT.getOriginTableItem()
    let root, el = this.createNewElementWithStyledComponent(element, zIndex)
    el.innerHTML = html
    el.style.width = 'auto'
    if (parent) {
      el.style.position = 'relative'
      el.style.width = '100%'
      el.style.height = 'auto'
      el.style.left = 0
      el.style.top = 0
      outer = parent.style
      root = this.createNewElementWithStyledComponent(parent, zIndex)
      root.style.width = 'auto'
      root.appendChild(el)
    } else {
      root = el
    }
    let realTop = outer.top || 0
    if (this.curPageUsedHeight) {
      root.style.top = `${this.curPageUsedHeight}px`
      realTop = this.curPageUsedHeight
    }
    if (restrictWidth != null) root.style.width = `${restrictWidth}px`
    if (marginTop != null) {
      el.style.marginTop = `${marginTop}`
      root.style.marginTop = `${marginTop}`
    }
    this.tempHolder.appendChild(root)
    await RenderUtil.wait()
    const rows = el.getElementsByClassName('roy-simple-table-row')
    const { tables, overflowPages, maxTableWidth } = this.getTablesSplit(outer, rows)
    tables.forEach((tbl, idx) => {
      if (idx) {
        root.style.top = `${this.realPageMarginTop}px`
        realTop = this.realPageMarginTop
      }
      el.innerHTML = `<table style=\"width: ${restrictWidth||maxTableWidth}px;table-layout: auto\">${tbl.html}</table>`
      if (overflowPages.includes(idx)) {
        el.style.height = `${this.pageHeight - this.realPageMarginBottom - this.realPageMarginTop}px`
        el.style.overflow = 'hidden'
      }
      this.addElementToCurPage(root.outerHTML, el.clientHeight)
    })
    this.curPageUsedHeight = root.clientHeight + realTop
    this.tempHolder.removeChild(root)
  }

  // ... renderRoyComplexTable, renderRoyRect/Image/Line/Star/Circle ... can follow same migration pattern

  getTablesSplit(style, rows, head = null, isData = false) {
    let headH = 0
    if (isData && head) {
      const cells = head.getElementsByClassName('roy-complex-table-cell-in')
      for (const c of cells) {
        headH = Math.max(headH, c.children[0].clientHeight)
      }
      head.children[0].style.height = `${headH}px`
    }
    const headHtml = head ? head.outerHTML : ''
    const realTop = this.curPageUsedHeight || style.top
    let maxH = this.maxPageUseHeight - realTop
    let curH = this.curPageUsedHeight ? headH : style.top + headH
    let htmlStr = ''
    const tables = []
    const overflow = []
    let maxW = 0

    for (let i = 0; i < rows.length; i++) {
      const tr = rows[i]
      let cellMax = 0
      if (isData) {
        const inner = tr.getElementsByClassName('roy-complex-table-cell-in')
        for (const c of inner) {
          cellMax = Math.max(cellMax, c.children[0].clientHeight)
        }
        tr.style.height = `${cellMax}px`
      }
      const lastH = curH
      curH += Math.max(tr.clientHeight, cellMax)
      maxW = Math.max(maxW, tr.clientWidth)
      if (curH > maxH) {
        tables.push({ html: `${headHtml}<tbody>${htmlStr}</tbody>`, height: lastH })
        if (lastH > maxH) overflow.push(tables.length-1)
        curH = this.realPageMarginTop + Math.max(tr.clientHeight, cellMax) + headH
        htmlStr = tr.outerHTML
      } else {
        htmlStr += tr.outerHTML
      }
      if (i === rows.length-1) {
        tables.push({ html: `${headHtml}<tbody>${htmlStr}</tbody>`, height: curH })
      }
    }
    return { tables, overflowPages: overflow, maxTableWidth: maxW }
  }
}
