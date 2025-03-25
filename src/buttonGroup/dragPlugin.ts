//@ts-ignore
import _ from 'lodash'
//@ts-ignore
import utils from '@ER/utils'
import { nextTick } from 'vue'
import { nanoid } from 'nanoid'
let prevEl: any = ''
let prevSortable: any = ''
let inserRowIndex: any = ''
// let prevRows = ''
let inserColIndex = ''
function getWindowScrollingElement() {
  const scrollingElement = document.scrollingElement
  if (scrollingElement) {
    return scrollingElement
  } else {
    return document.documentElement
  }
}
function getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement()
  let elem = el
  let gotSelf = false
  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      const elemCSS = css(elem)
      if (
        elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX === 'auto' || elemCSS.overflowX === 'scroll') ||
        elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY === 'auto' || elemCSS.overflowY === 'scroll')
      ) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement()

        if (gotSelf || includeSelf) return elem
        gotSelf = true
      }
    }
    /* jshint boss:true */
    // eslint-disable-next-line
  } while (elem = elem.parentNode)

  return getWindowScrollingElement()
}
const getOffset = (el, key) => {
  let offset = 0
  let parent = el

  while (parent) {
    offset += parent[key]
    parent = parent.offsetParent
  }

  return offset
}
function matches(/** HTMLElement */el, /** String */selector) {
  if (!selector) return

  selector[0] === '>' && (selector = selector.substring(1))

  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector)
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector)
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector)
      }
    } catch (_) {
      return false
    }
  }

  return false
}
function css(el, prop?: any, val?: any) {
  const style = el && el.style

  if (style) {
    // eslint-disable-next-line
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '')
      } else if (el.currentStyle) {
        val = el.currentStyle
      }
      // eslint-disable-next-line
      return prop === void 0 ? val : val[prop]
    } else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px')
    }
  }
}
function lastChild(el, selector?: any) {
  let last = el.lastElementChild
  // eslint-disable-next-line
  while (last && (css(last, 'display') === 'none' || selector && !matches(last, selector))) {
    last = last.previousElementSibling
  }
  return last || null
}
const disableBothSides = (ER) => ER.props.layoutType === 1 && ER.state.platform === 'mobile'
const getDirection1 = (target, originalEvent) => {
  let direction: any = ''
  const Y = getOffset(target, 'offsetTop')
  const scrollEl = getParentAutoScrollElement(target, true)
  const clientY = originalEvent.clientY + scrollEl.scrollTop
  const h = target.offsetHeight
  if (clientY > Y && clientY < Y + (h / 2)) {
    direction = 5
  } else {
    direction = 6
  }
  return direction
}
const getDirection0 = (target, originalEvent) => {
  let direction: any = ''
  const X = getOffset(target, 'offsetLeft')
  const Y = getOffset(target, 'offsetTop')
  const scrollEl = getParentAutoScrollElement(target, true)
  const clientX = originalEvent.clientX
  const clientY = originalEvent.clientY + scrollEl.scrollTop
  const w = target.offsetWidth
  const h = target.offsetHeight
  const x1 = X
  const y1 = -Y
  const x2 = x1 + w
  const y2 = y1 - h
  const x0 = (x1 + x2) / 2
  const y0 = (y1 + y2) / 2
  const k = (y2 - y1) / (x2 - x1)
  const x = clientX
  const y = -clientY
  const K = (y - y0) / (x - x0)
  if (k < K && K < -k) {
    if (x > x0) {
      direction = 2
    } else {
      direction = 4
    }
  } else {
    if (y > y0) {
      direction = 1
    } else {
      direction = 3
    }
  }
  return direction
}
const clearBorder = (el) => {
  const classNames = ['top', 'bottom', 'left', 'right']
  classNames.forEach(e => {
    el.classList.remove(`drag-line-${e}`)
  })
}
const setBorder = (el, className) => {
  clearBorder(el)
  el.classList.add(className)
}
const getDragElement = (node) => {
  return node.__draggable_context?.element
}

const setStates = (newTarget, ev, ER) => {
  const {
    activeSortable: {
      constructor: {
        utils
      },
      options: {
        dataSource
      },
      el: {
        __draggable_component__: {
          list
        }
      }
    },
    activeSortable,
    target,
    originalEvent,
    dragEl,
    sortable: {
      el,
      el: {
        __draggable_component__: {
          //list是横向的东西
          //columns是纵向的
          list: targetList//获取到sort的dom的list变量
        }
      }
    },
    sortable
  } = ev
  let _targetList = ev.sortable.el.__draggable_component__
  const targetContainer = el.parentNode
  const direction = disableBothSides(ER) ? getDirection1(newTarget, originalEvent) : getDirection0(newTarget, originalEvent)
  const cols = newTarget.parentNode.children
  const colIndex = utils.index(newTarget)
  const rows = targetContainer.parentNode.children
  const rowIndex = utils.index(targetContainer)
  if (/^(2|4)$/.test(direction)) {
    if (targetList.length === ER.props.inlineMax && !el.contains(dragEl)) {
      return false
    }
  }
  if (/^(1)$/.test(direction)) {
    if (ER.state.store.length > 0 && (/^(root)$/.test(el.dataset.layoutType))) {
      return false
    }
  }
  switch (direction) {
    case 1:
      if ((list.length === 1 && rows[rowIndex - 1] && rows[rowIndex - 1].contains(dragEl)) || !sortable.el.parentNode.parentNode.__draggable_component__) {
        prevEl = ''
        return false
      }
      prevSortable = (sortable.el.parentNode.parentNode.__draggable_component__)._sortable
      prevEl = targetContainer
      inserRowIndex = utils.index(prevEl)
      setBorder(prevEl, 'drag-line-top')
      break
    case 2:
      if (cols[utils.index(target) + 1] !== dragEl) {
        if (colIndex === targetList.length - 1) {
          prevEl = newTarget
          prevSortable = sortable
          inserColIndex = utils.index(prevEl) + 1
          setBorder(prevEl, 'drag-line-right')
        } else {
          prevSortable = sortable
          prevEl = cols[colIndex + 1]
          inserColIndex = utils.index(prevEl)
          setBorder(prevEl, 'drag-line-left')
        }
      }
      break
    case 3:
      if (sortable.el.dataset.layoutType === 'root') {
        return false
      }
      prevSortable = (sortable.el.parentNode.parentNode.__draggable_component__)._sortable
      if (rowIndex === rows.length - 1) {
        prevEl = targetContainer
        setBorder(prevEl, 'drag-line-bottom')
      } else {
        prevEl = rows[rowIndex + 1]
        if (list.length === 1 && rows[rowIndex + 1].contains(dragEl)) {
          prevEl = ''
          return false
        }
        setBorder(prevEl, 'drag-line-top')
      }
      inserRowIndex = utils.index(targetContainer) + 1
      break
    case 4:
      if (cols[utils.index(target) - 1] !== dragEl) {
        prevEl = newTarget
        prevSortable = sortable
        inserColIndex = utils.index(prevEl)
        setBorder(prevEl, 'drag-line-left')
      }
      break
    case 5:
      if (targetList.length === ER.props.inlineMax && !el.contains(dragEl)) {
        return false
      }
      if (cols[utils.index(target) - 1] !== dragEl) {
        prevEl = newTarget
        prevSortable = sortable
        inserColIndex = utils.index(prevEl)
        setBorder(prevEl, 'drag-line-top')
      }
      break
    case 6:
      // console.log('下')
      if (targetList.length === ER.props.inlineMax && !el.contains(dragEl)) {
        return false
      }
      if (cols[utils.index(target) + 1] !== dragEl) {
        if (colIndex === targetList.length - 1) {
          prevEl = newTarget
          prevSortable = sortable
          inserColIndex = utils.index(prevEl) + 1
          setBorder(prevEl, 'drag-line-bottom')
        } else {
          prevSortable = sortable
          prevEl = cols[colIndex + 1]
          inserColIndex = utils.index(prevEl)
          setBorder(prevEl, 'drag-line-top')
        }
      }
      break
  }
}
const getNodes = (node) => {
  const nodes = node.columns || node.list || node.rows || []
  return Array.isArray(node) ? node : nodes
}
const resetStates = () => {
  if (prevEl) {
    clearBorder(prevEl)
  }
  prevEl = prevSortable = inserColIndex = inserRowIndex = ''
}
function ControlInsertionPlugin(ER) {
  class ControlInsertionPlugin {
    dragStart(e) {
    }
    drop(e) {
      // 如果没有之前的元素 (prevEl) 或者当前事件没有一个活动的sortable实例，则直接返回
      if (!prevEl || !e.activeSortable) {
        return false
      }
      // 判断当前拖拽的元素是否是 'block' 类型
      const isBlock = _.get(e, 'activeSortable.options.dataSource', false) === 'block'
      // 从事件对象中获取拖拽的元素 (dragEl) 和目标元素 (target)
      const { dragEl, target } = e
      // 获取拖拽元素的真实DOM结构
      const oldEl = getDragElement(dragEl)
      // 克隆并包装拖拽的元素，以便插入到新位置
      // console.log(oldEl, 'testOld')//
      const newElement = ER.wrapElement(_.cloneDeep(oldEl), inserRowIndex !== '', true, isBlock)
      // 如果不是 'block' 类型的元素，并且原始元素有 context，则删除该 context
      if (!isBlock) {
        if (oldEl.context) {
          let _context = oldEl.context
          let flatNode = _context.getFlattenNodes()
          let ids = flatNode.map(node => node.id)
          let next = Array.isArray(prevSortable.options.parent)
            ? prevSortable.options.parent
            : [prevSortable.options.parent]//is Array
          let _ids = next.map(node => node.id)
          if (_ids.some(id => ids.includes(id))) {
            resetStates()
            return
          }
          oldEl.context.delete()
        }
      }

      if (inserRowIndex !== '') {
        let store = []
        // 判断是否是 'subform' 类型的父级元素，并获取正确的存储数组
        if (prevSortable.options.parent.type === 'subform') {
          store = prevSortable.options.parent.list[0]
        } else {
          store = Array.isArray(prevSortable.options.parent)
            ? prevSortable.options.parent
            : prevSortable.options.parent.list
        }
        // 在指定的索引位置插入新元素
        store.splice(inserRowIndex, 0, newElement)
        // 关联新元素的上下文信息
        utils.addContext({ node: store[inserRowIndex], parent: prevSortable.options.parent })
      }
      // 处理列插入逻辑
      if (inserColIndex !== '') {
        const {
          el: {
            __draggable_component__: { list }
          },
          el,
          constructor: { utils: sortableUtils }
        } = prevSortable

        // 在指定的索引位置插入新元素
        list.splice(inserColIndex, 0, newElement)

        // 关联新元素的上下文信息
        utils.addContext({
          node: newElement,
          parent: prevSortable.options.parent[sortableUtils.index(prevSortable.el.parentNode)]
        })
      }

      // 如果有行插入或列插入操作，则遍历新元素，并检查是否需要额外的字段处理
      if (inserColIndex !== '' || inserRowIndex !== '') {
        // console.log(ER, 'testERRR')//
        utils.deepTraversal(newElement, (node) => {
          if (utils.checkIsField(node)) {
            ER.addField(node) // 添加字段到表单
          }
        })
        // 在下一次DOM更新后，选中新的元素
        nextTick(() => {
          ER.setSelection(newElement)
        })
      }
      // 重置拖拽状态
      resetStates()
    }
    dragOver(e) {
      e.cancel()
      resetStates()
      const {
        activeSortable: {
          constructor: {
            utils: SortableUtils
          },
          options: {
            dataSource
          },
          el: {
            __draggable_component__: {
              list
            }
          }
        },
        activeSortable,
        target,
        originalEvent,
        dragEl,
        sortable: {
          el,
          el: {
            __draggable_component__: {
              list: targetList
            }
          }
        },
        sortable
      } = e
      // console.log(dataSource, 'testDataSource')//
      if (sortable.options.dataSource === 'block') {
        return false
      }
      if (target.dataset.layoutType === 'grid') {
        return false
      }
      const dragNode = getDragElement(dragEl)
      const targetNode = getDragElement(target)
      if ((!utils.checkIsField(dragNode) || dragNode.type === 'subform') && utils.checkIsInSubform(targetNode)) {
        return false
      }
      if (target.dataset.layoutType === 'subform') {
        if (!utils.checkIsField(dragNode) || dragNode.type === 'subform') {
          return false
        }
      }//
      originalEvent.stopPropagation && originalEvent.stopPropagation()
      const direction = ''
      const targetContainer = el.parentNode
      const targetOnlyOne = targetList.length === 1
      //@ts-ignore
      let newTarget = SortableUtils.closest(target, this.options.draggable, sortable.el)
      if (dragEl.contains(newTarget)) {
        return false
      }
      if (/^(grid-col|tabs-col|td|collapse-col|root|inline|subform)$/.test(target.dataset.layoutType)) {
        newTarget = target
        const state = (newTarget.__draggable_component__ || newTarget.children[0].__draggable_component__)
        if (!state.list.length) {
          prevEl = target.dataset.layoutType === 'root' ? target : newTarget.__draggable_component__ ? newTarget.children[0] : newTarget.parentNode
          prevSortable = state._sortable
          inserRowIndex = 0
          setBorder(prevEl, 'drag-line-top')
        } else {
          if (/^(root|grid-col)$/.test(target.dataset.layoutType)) {
            const rows = el.children
            prevEl = lastChild(el)
            if (prevEl === dragEl.parentNode.parentNode && list.length === 1) {
              prevEl = ''
              return false
            }
            setBorder(prevEl, 'drag-line-bottom')
            inserRowIndex = rows.length
            prevSortable = state._sortable
          }
          if (target.dataset.layoutType === 'inline') {
            if (disableBothSides(ER)) return false
            const cols = el.children
            prevEl = lastChild(el)
            if (prevEl.contains(dragEl) && list.length === 1) {
              prevEl = ''
              return false
            }
            inserColIndex = cols.length
            prevSortable = state._sortable
            setBorder(prevEl, 'drag-line-right')
          }
        }
      } else {
        setStates(newTarget, e, ER)
      }
    }
  }
  const name = ER.formIns.getPluginName()
  return Object.assign(ControlInsertionPlugin, {
    pluginName: name, //
    initializeByDefault: true
  })
}
export default ControlInsertionPlugin
