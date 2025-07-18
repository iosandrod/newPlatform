import { computed, reactive, toRaw } from 'vue'
import dayjs from 'dayjs'
import _ from 'lodash'
import { nanoid } from 'nanoid'
import utils from '@ER/utils'
import { wrapElement } from './field'
import { Form } from '@ER/form'
export type ContextNode = any
export type ContextOptions = {
  node: any
  parent
  fn?: any
  form?: any
}
export class Context {
  form: Form
  node: ContextNode
  parent: ContextNode | ContextNode[]
  arr: ContextNode[]
  state: ContextNode
  constructor(config: ContextOptions) {
    let fn = config.fn
    let node = config.node
    this.node = config.node
    this.parent = config.parent
    let parent = this.parent
    this.form = config.form //
    if (Array.isArray(this.parent)) {
      this.arr = this.parent
    } else {
      //当前的容器
      this.arr = parent.columns || parent.list || parent.rows
    }
    this.state = config.node
    Object.defineProperty(this.state, 'context', {
      value: this,
      writable: false,
      enumerable: false,
      configurable: true,
    })
    //
    let nodes = []
    if (node.type === 'subform') {
      nodes = node.list[0]
    } else {
      nodes = node.columns || node.list || node.rows || []
    }
    nodes.forEach((e) => {
      this.addContext(e, node, fn)
    })
  }
  getIsLastNode() {
    let parents = this.parents
  }
  getFlattenNodes() {
    const columns = this.node.columns || []
    let list = this.node.list || []
    let rows = this.node.rows || []
    let arr = [...columns, ...list, ...rows]
    let _arr = []
    arr.forEach((e) => {
      let context = e.context
      let _arr1 = []
      if (context) {
        let nodes = context.getFlattenNodes()
        _arr1.push(...nodes)
      }
      _arr1.push(e)
      _arr.push(..._arr1)
    })
    return _arr //
  }
  get props() {
    let node = this.node
    return (isPc) =>
      computed(() => {
        const { options } = node
        const result: any = {
          disabled: options.disabled,
          placeholder: options.placeholder,
          clearable: options.clearable,
          required: options.required,
        }
        if (isPc) {
        } else {
          result.label = node.label
        }
        switch (node.type) {
          case 'input':
            if (options.isShowWordLimit) {
              result.maxlength = options.max
              result['show-word-limit'] = options.isShowWordLimit
            }
            if (isPc) {
              result.showPassword = options.showPassword
              result.prepend = options.prepend
              result.append = options.append
            } else {
              if (options.showPassword) {
                result.type = 'password'
              }
              if (options.renderType === 4) {
                result.type = 'tel'
              }
            }
            break
          case 'textarea':
            result.type = 'textarea'
            result.rows = options.rows
            break
          case 'number':
            if (isPc) {
              result.controls = options.controls
              if (options.controls) {
                result['controls-position'] = options.controlsPosition
                  ? 'right'
                  : ''
              }
            }
            if (options.isShowWordLimit) {
              result.min = options.min
              result.max = options.max
            }
            result.step = options.step
            result.precision = options.precision
            break
          case 'radio':
          case 'checkbox':
            break
          case 'select':
            break
          case 'time':
            result.format = options.format
            if (isPc) {
              result.valueFormat = options.valueFormat
            }
            break
          case 'date':
            result.placeholder = options.placeholder
            result.startPlaceholder = options.startPlaceholder
            result.endPlaceholder = options.endPlaceholder
            result.format = options.format
            result.type = options.type
            if (isPc) {
              result.disabledDate = (time) => {
                const { startTime, endTime, weeks, isShowWeeksLimit } = options
                const startDate = dayjs.unix(startTime)
                const endDate = dayjs.unix(endTime)
                const currentDate = dayjs(time)
                const result =
                  currentDate.isBefore(startDate) ||
                  currentDate.isAfter(endDate)
                return result
              }
            } else {
              const { startTime, endTime, weeks, isShowWeeksLimit } = options
              switch (options.type) {
                case 'date':
                case 'datetime':
                  if (startTime) {
                    result.minDate = dayjs.unix(startTime).toDate()
                  } else {
                    result.minDate = dayjs.unix(0).toDate()
                  }
                  if (endTime) {
                    result.maxDate = dayjs.unix(endTime).toDate()
                  } else {
                    result.maxDate = dayjs().add(20, 'year').toDate()
                  }
                  break
                case 'dates':
                  if (options.defaultValue) {
                    result.defaultDate = options.defaultValue.map((e) =>
                      dayjs.unix(e).toDate(),
                    )
                  } else {
                    result.defaultDate = null
                  }
                  if (startTime) {
                    result.minDate = dayjs.unix(startTime).toDate()
                  } else {
                    result.minDate = dayjs().subtract(1, 'year').toDate()
                  }
                  if (endTime) {
                    result.maxDate = dayjs.unix(endTime).toDate()
                  } else {
                    result.maxDate = dayjs().add(1, 'year').toDate()
                  }
                  break
                case 'daterange':
                  if (options.defaultValue) {
                    result.defaultDate = options.defaultValue.map((e) =>
                      dayjs.unix(e).toDate(),
                    )
                  } else {
                    result.defaultDate = null
                  }
                  if (startTime) {
                    result.minDate = dayjs.unix(startTime).toDate()
                  } else {
                    result.minDate = dayjs().subtract(1, 'year').toDate()
                  }
                  if (endTime) {
                    result.maxDate = dayjs.unix(endTime).toDate()
                  } else {
                    result.maxDate = dayjs().add(1, 'year').toDate()
                  }
                  break
              }
            }
            break
          case 'cascader':
            result.props = {
              multiple: options.multiple,
              checkStrictly: options.checkStrictly,
            }
            result.options = options.options
            break
          case 'slider':
            result.step = options.step
            result.min = options.min
            result.max = options.max
            break
          case 'divider':
            result.contentPosition = options.contentPosition
            break
          case 'uploadfile':
            result.multiple = options.multiple
            result.action = options.action
            result.limit = options.limit
            result.size = options.size
            result.accept = options.accept
            break
        }
        return result
      })
  }
  get row() {
    let parent = this.parent
    let isArray = Array.isArray(parent)
    let node = this.node
    let arr = this.arr
    let result: any = ''
    if (isArray || node.type === 'tr') {
      result = arr.indexOf(node)
    } else {
      result = parent.context.row
    }
    return result
  }
  getParentIsArray() {
    let parent = this.parent
    let isArray = Array.isArray(parent)
    return isArray
  }
  get col() {
    let result: any = ''
    let isArray = this.getParentIsArray()
    let parent = this.parent
    let arr = this.arr
    let node = this.node
    if (isArray) {
      result = 0
    } else {
      if (
        parent.type === 'grid' ||
        parent.type === 'tr' ||
        parent.type === 'td' ||
        parent.type === 'col' ||
        parent.type === 'tabsCol' ||
        parent.type === 'collapseCol'
      ) {
        result = arr.indexOf(node)
      } else {
        result = parent.context.col
      }
    }
    return result
  }
  get root() {
    let result = {}
    let node = this.node
    let parent = this.parent
    switch (node.type) {
      case 'grid':
      case 'table':
        result = node
        break
      default:
        result = parent?.context?.root //
    }
    return result
  }
  get parents() {
    const result = []
    let node = this.node
    let cursor = node
    while (cursor) {
      result.unshift(cursor)
      if (cursor.context.parent && !_.isArray(cursor.context.parent)) {
        //
        cursor = cursor.context.parent
      } else {
        cursor = ''
      }
    }
    return result
  }
  copy() {
    const parent = this.parent
    const arr = this.arr
    const node = this.node
    const index = arr.indexOf(node)
    const newNode = reactive(_.cloneDeep(toRaw(node)))
    delete newNode.context
    newNode.id = nanoid()
    newNode.key = `${newNode.type}_${newNode.id}`
    //@ts-ignore
    this.addContext(newNode, parent, (node) => {
      node.id = nanoid()
      node.key = `${node.type}_${node.id}-copy`
    })
    arr.splice(index + 1, 0, newNode)
  }
  addContext(node, parent?: any, fn?: any) {
    if (typeof node != 'object' || node == null) {
      //
      return
    }
    fn && fn(node)
    let context = new Context({
      node,
      parent,
      form: this.form, //
    }) //
    return context
  }
  delete() {
    //删除节点
    const arr = this.arr
    const node = this.node //
    let parent = this.parent //
    if (parent.type == 'inline') {
      let columns = parent.columns
      if (columns.length == 1) {
        //只有自己一个
        let pParent = parent.context.parent
        if (pParent.type == 'col') {
          let ppParent = pParent.context.parent
          let list = ppParent.list || []
          if (list.length == 1) {
            if (ppParent.type == 'grid') {
              let columns = ppParent.columns
              if (columns.length == 1) {
                let pppParent = ppParent.context.parent
                if (pppParent.type == 'inline') {
                  let pppContext = pppParent.context
                  pppContext.delete() //
                }
              }
            }
          }
          //当前列只有自己一个
          if (list.length == 0) {
            pParent.context.delete() //
          }
        }
      }
    }
    if (node.type === 'inline') {
      arr.splice(arr.indexOf(node), 1)
    } else {
      arr.splice(arr.indexOf(node), 1)
    }
  } //
  appendCol(index?: number) {
    const parent = this.parent
    let allCols = this.state.columns || []
    let allSpan = allCols
      .map((col) => col.options.span)
      .reduce((pre, cur) => pre + cur, 0) //
    if (allSpan >= 24) return
    let subSpan = 24 - allSpan
    const arr = this.arr
    const node = this.node
    if (subSpan > 6) {
      subSpan = 6 //
    }
    const newNode = wrapElement({
      options: {
        span: subSpan, //
        offset: 0,
        pull: 0,
        push: 0,
      },
      type: 'col',
      label: 'new tab', //
      list: [],
    })
    if (index == null) {
      node.columns.push(newNode)
    } else {
      node.columns.splice(index, 0, newNode)
    }
    //@ts-ignore
    this.addContext(newNode, node)
    return newNode
  }
  get columns() {
    const node = this.node
    const result = []
    switch (node.type) {
      case 'table':
        node.rows.forEach((item0, index0) => {
          item0.columns.forEach((item1, index1) => {
            if (!index0) {
              result.push([])
            }
            result[index1].push(item1)
          })
        })
        break
      default:
    }
    return result
  }
  get isDisableMargeLeft() {
    const node = this.node
    const {
      context: { root, col, row },
    } = node
    const nodes = root.rows[row].columns
    let result = col <= 0
    if (!result) {
      let onOff = true
      this.findNode(node, 'before', 'colspan', (nodes) => {
        onOff = result =
          !nodes.every((e) => e.options.rowspan === node.options.rowspan) ||
          nodes.every((e) => e.options.isMerged)
      })
      result = onOff
    }
    return result
  }
  findNode(node, dir, key, fn, ignore = false) {
    const {
      context: { root, col, row },
    } = node
    let count = key === 'rowspan' ? row : col
    let passArr = []
    const nodes = this.getNodes(node, key)
    const callBack = () => {
      // rowspan
      if (key === 'rowspan') {
        passArr.forEach((e, index) => {
          e.options.rowspan = passArr.length
          e.options.isMerged = !!index
          if (e.options.colspan > 1) {
            const nodes = this.getNodes(e, 'colspan')
            nodes.slice(col + 1, col + e.options.colspan).forEach((e) => {
              e.options.rowspan = passArr.length
            })
          }
          if (index) {
            passArr[0].list = passArr[0].list.concat(e.list)
            e.list = []
          }
        })
      } else if (key === 'colspan') {
        passArr.forEach((e, index) => {
          e.options.colspan = passArr.length
          e.options.isMerged = !!index
          if (e.options.colspan > 1) {
            const nodes = this.getNodes(e, 'rowspan')
            nodes.slice(row + 1, row + e.options.rowspan).forEach((e) => {
              e.options.colspan = passArr.length
            })
          }
          if (index) {
            passArr[0].list = passArr[0].list.concat(e.list)
            //@ts-ignore
            this.addContext(passArr[0], passArr[0].context.parent)
            // console.log(passArr[0], passArr[0].context.parent)
            e.list = []
          }
        })
      }
    }
    if (dir === 'after') {
      while (++count) {
        const item = nodes[count]
        if (!item) {
          fn(passArr)
          break
        }
        passArr.push(item)
        if (!item.options.isMerged) {
          if (item.options[key] > 1) {
            const lastNode = passArr[passArr.length - 1]
            passArr = passArr.concat(
              nodes.slice(
                lastNode.context[key.slice(0, 3)] + 1,
                lastNode.context[key.slice(0, 3)] + item.options[key],
              ),
            )
          }
          passArr.unshift(node)
          fn(passArr, callBack)
          break
        }
      }
    } else {
      while (count--) {
        const item = nodes[count]
        if (!item) {
          fn(passArr)
          break
        }
        let arr = []
        passArr.unshift(item)
        if (!item.options.isMerged) {
          if (node.options[key] > 1) {
            this.findNode(passArr[0], 'after', key, (nodes) => {
              arr = nodes
            })
          }
          passArr.push(node)
          if (arr.length) {
            passArr = arr
          }
          fn(passArr, callBack)
          break
        }
      }
    }
  }
  getNodes(node, key) {
    const {
      context: { root, col, row },
    } = node
    let nodes = []
    if (key === 'rowspan') {
      nodes = root.context.columns[col]
    } else if (key === 'colspan') {
      nodes = root.rows[row].columns
    }
    return nodes
  }
  get isDisableMargeRight() {
    const node = this.node
    const {
      context: { root, col, row },
    } = node
    const nodes = root.rows[row].columns
    let result = col >= nodes.length - 1
    if (!result) {
      let onOff = true
      this.findNode(node, 'after', 'colspan', (nodes) => {
        onOff = result =
          !nodes.every((e) => e.options.rowspan === node.options.rowspan) ||
          nodes.every((e) => e.options.isMerged)
      })
      result = onOff
    }
    return result
  }
  get isDisableMargeColumn() {
    const node = this.node
    const nodes = this.getNodes(node, 'rowspan')
    return this.isDisableDelColumn || nodes.length === node.options.rowspan
  }
  get isDisableMargeBottom() {
    const node = this.node
    const {
      context: { root, col, row },
    } = node
    const columns = root.context.columns
    let result = row >= columns[col].length - 1
    if (!result) {
      let onOff = true
      this.findNode(node, 'after', 'rowspan', (nodes) => {
        onOff = result =
          !nodes.every((e) => e.options.colspan === node.options.colspan) ||
          nodes.every((e) => e.options.isMerged)
      })
      result = onOff
    }
    return result
  }
  get isDisableMargeTop() {
    let node = this.node
    const {
      context: { root, col, row },
    } = node
    const columns = root.context.columns
    let result = row <= 0
    if (!result) {
      let onOff = true
      this.findNode(node, 'before', 'rowspan', (nodes) => {
        onOff = result =
          !nodes.every((e) => e.options.colspan === node.options.colspan) ||
          nodes.every((e) => e.options.isMerged)
      })
      result = onOff
    }
    return result
  }
  get isDisableSplitColumn() {
    let node = this.node
    return node.options.colspan === 1
  }
  get isDisableSplitRow() {
    let node = this.node
    return node.options.rowspan === 1
  }
  get isDisableDelRow() {
    let node = this.node
    const nodes = this.getNodes(node, 'colspan')
    const rowspanNodes = this.getNodes(node, 'rowspan')
    return (
      rowspanNodes.length === 1 ||
      rowspanNodes.filter((e) => !e.options.isMerged).length === 1 ||
      !nodes.every((e) => e.options.rowspan === node.options.rowspan)
    )
  }
  get isDisableDelColumn() {
    let node = this.node
    const nodes = this.getNodes(node, 'rowspan')
    const colspanNodes = this.getNodes(node, 'colspan')
    return (
      colspanNodes.length === 1 ||
      colspanNodes.filter((e) => !e.options.isMerged).length === 1 ||
      !nodes.every((e) => e.options.colspan === node.options.colspan)
    )
  }
  merge(type) {
    let node = this.node
    const {
      context: { root, col, row },
    } = node
    switch (type) {
      case 'left':
        this.findNode(node, 'before', 'colspan', (nodes, callBack) => {
          callBack()
        })
        break
      case 'right':
        this.findNode(node, 'after', 'colspan', (nodes, callBack) => {
          callBack()
        })
        break
      case 'top':
        this.findNode(node, 'before', 'rowspan', (nodes, callBack) => {
          callBack()
        })
        break
      case 'bottom':
        this.findNode(node, 'after', 'rowspan', (nodes, callBack) => {
          callBack()
        })
        break
      case 'row':
        while (
          root.rows[row].columns.length >
          root.rows[row].columns[0].options.colspan
        ) {
          this.findNode(
            root.rows[row].columns[0],
            'after',
            'colspan',
            (nodes, callBack) => {
              callBack()
            },
          )
        }
        break
      case 'column':
        while (
          root.context.columns[col].length >
          root.context.columns[col][0].options.rowspan
        ) {
          this.findNode(
            root.context.columns[col][0],
            'after',
            'rowspan',
            (nodes, callBack) => {
              callBack()
            },
          )
        }
        break
      default:
    }
  }
  getValidNode(node) {
    const {
      context: { root, col, row },
    } = node
    const result = []
    const rows = root.rows
    for (let i0 = 0; i0 < rows.length; i0++) {
      for (let i1 = 0; i1 < rows[i0].columns.length; i1++) {
        const item = rows[i0].columns[i1]
        if (!item.options.isMerged) {
          result.push(item)
        }
      }
    }
    return result.filter((e) => {
      const {
        context: { root, col, row },
        options: { colspan, rowspan },
      } = e
      const offsetx = [col, col + (colspan > 1 ? colspan - 1 : 0)]
      const offsety = [row, row + (rowspan > 1 ? rowspan - 1 : 0)]
      const status =
        node.context.col >= offsetx[0] &&
        node.context.col <= offsetx[1] &&
        node.context.row >= offsety[0] &&
        node.context.row <= offsety[1]
      return status
    })[0]
  }
  getNodeRange(node) {
    const {
      context: { root, col, row },
      options: { rowspan, colspan },
    } = node
    let count = row
    const xNodes = root.rows[row].columns
    const yNodes = root.context.columns[col]
    const result = [] // x , y
    while (count < row + rowspan) {
      result.push([...root.rows[count].columns.slice(col, col + colspan)])
      count++
    }
    return result
  }
  checkStatus(nodes, node, key) {
    const data = {
      x: -1,
      y: -1,
      status: -1,
    }
    for (let i0 = 0; i0 < nodes.length; i0++) {
      for (let i1 = 0; i1 < nodes[i0].length; i1++) {
        if (nodes[i0][i1].id === node.id) {
          data.x = i1
          data.y = i0
          if (key === 'colspan') {
            if (nodes[i0].length === 1) {
              data.status = 0
            } else {
              if (i1 === nodes[i0].length - 1) {
                data.status = 3
              }
              if (i1 === 0) {
                data.status = 1
              }
              if (i1 > 0 && i1 < nodes[i0].length - 1) {
                data.status = 2
              }
            }
          } else {
            if (nodes.length === 1) {
              data.status = 0
            } else {
              if (i0 === nodes.length - 1) {
                data.status = 3
              }
              if (i0 === 0) {
                data.status = 1
              }
              if (i0 > 0 && i0 < nodes.length - 1) {
                data.status = 2
              }
            }
          }
        }
      }
    }
    return data
  }
  appendBlockNode(newElement, inserRowIndex = 0) {
    // let store = []
    // debugger //
    let store = this.state.columns || this.state.list
    // if(Array.isArray(store)){
    // store = store
    // }
    // debugger//
    // 在指定的索引位置插入新元素
    store.splice(inserRowIndex, 0, newElement)
    // 关联新元素的上下文信息
    // let _node = store[inserRowIndex]
    // if (_node == null) {
    //   return //
    // }
    let parent = this.state //
    let ER = this.form
    utils.addContext({
      node: store[inserRowIndex],
      parent: parent,
      form: this.form, //
    })
    utils.deepTraversal(newElement, (node) => {
      if (utils.checkIsField(node)) {
        ER.addField(node) // 添加字段到表单
      }
    })
  }
  appendNodes(node, dir, key) {
    let _this = this
    const {
      context: { root, col, row },
      options: { colspan, rowspan },
    } = node
    let index = -1
    let nodes = []
    if (dir === 'before') {
      if (key === 'colspan') {
        index = col
        if (index !== 0) {
          nodes = root.context.columns[index - 1]
        } else {
          nodes = root.context.columns[0]
        }
      } else {
        index = row
        if (index !== 0) {
          nodes = root.rows[index - 1].columns
        }
      }
    } else {
      if (key === 'colspan') {
        if (node.options.colspan > 1) {
          index = col + colspan - 1
        } else {
          index = col
        }
        nodes = root.context.columns[index]
      } else {
        if (node.options.rowspan > 1) {
          index = row + rowspan - 1
        } else {
          index = row
        }
        nodes = root.rows[index].columns
      }
    }
    if (key === 'colspan') {
      nodes.forEach((e, index0) => {
        const newNode = wrapElement({
          type: 'td',
          options: {
            colspan: 1,
            rowspan: 1,
            isMerged: false,
          },
          list: [],
          style: {},
        })
        e.context.parent.columns.splice(
          dir === 'before' ? index : index + 1,
          0,
          newNode,
        )
        this.addContext(e.context.parent, root)
        if (!(index === 0 && dir === 'before')) {
          const validNode = _this.getValidNode(e)
          const ranges = _this.getNodeRange(validNode)
          const { status, x, y } = _this.checkStatus(ranges, e, 'colspan')
          if (/[1, 2]/.test(`${status}`)) {
            newNode.options.isMerged = true
            ranges[y].forEach((e) => {
              e.options.colspan = newNode.options.colspan =
                ranges[y].length + (y === 0 ? 1 : 0)
              newNode.options.rowspan = e.options.rowspan
            })
          }
        }
      })
    } else {
      const arr = nodes.map((e) => {
        const validNode = _this.getValidNode(e)
        const ranges = _this.getNodeRange(validNode)
        return {
          ..._this.checkStatus(ranges, e, 'rowspan'),
          ranges,
        }
      })
      const tr = wrapElement({
        type: 'tr',
        columns: Array.from(
          Array(node.context.parent.columns.length),
          (e, i0) => {
            const newNode = {
              type: 'td',
              options: {
                colspan: 1,
                rowspan: 1,
                isMerged: false,
              },
              list: [],
              style: {},
            }
            if (index !== 0) {
              const { status, x, y, ranges } = arr[i0]
              if (/[1, 2]/.test(`${status}`)) {
                newNode.options.isMerged = true
                for (let i0 = 0; i0 < ranges.length; i0++) {
                  for (let i1 = 0; i1 < ranges[i0].length; i1++) {
                    if (i1 === 0) {
                      ranges[i0].forEach((e) => {
                        e.options.rowspan = newNode.options.rowspan =
                          ranges.length + 1
                        newNode.options.colspan = e.options.colspan
                      })
                    }
                  }
                }
              }
            }
            return newNode
          },
        ),
      })
      root.rows.splice(dir === 'before' ? index : index + 1, 0, tr)
      root.rows.forEach((item) => {
        _this.addContext(item, root)
      })
    }
  }
  insert(type) {
    let node = this.node
    const {
      context: { root, col, row },
    } = node
    switch (type) {
      case 'left':
        this.appendNodes(node, 'before', 'colspan')
        break
      case 'right':
        this.appendNodes(node, 'after', 'colspan')
        break
      case 'top':
        this.appendNodes(node, 'before', 'rowspan')
        break
      case 'bottom':
        this.appendNodes(node, 'after', 'rowspan')
        break
    }
  }
  split(type) {
    let node = this.node
    const {
      context: { root, col, row },
    } = node
    const nodes = this.getNodes(node, type === 'column' ? 'colspan' : 'rowspan')
    switch (type) {
      case 'column':
        //  zheliyoudu  没有考虑底层
        nodes.slice(col, col + node.options.colspan).forEach((e) => {
          e.options.colspan = 1
          e.options.isMerged = false
          if (e.options.rowspan > 1) {
            const nodes = this.getNodes(e, 'rowspan')
            nodes.slice(row + 1, row + e.options.rowspan).forEach((e) => {
              e.options.colspan = 1
            })
          }
        })
        break
      case 'row':
        nodes.slice(row, row + node.options.rowspan).forEach((e) => {
          e.options.rowspan = 1
          e.options.isMerged = false
          if (e.options.colspan > 1) {
            const nodes = this.getNodes(e, 'colspan')
            nodes.slice(col + 1, col + e.options.colspan).forEach((e) => {
              e.options.rowspan = 1
            })
          }
        })
        break
    }
  }
  del(type) {
    let node = this.node

    const {
      //
      context: { root, col, row },
    } = node
    const nodes = this.getNodes(node, type === 'column' ? 'colspan' : 'rowspan') //
    switch (type) {
      case 'column':
        root.rows.forEach((e) => {
          e.columns.splice(col, node.options.colspan)
          this.addContext(e, root)
        })
        break
      case 'row':
        root.rows.splice(row, node.options.rowspan)
        root.rows.forEach((e) => {
          this.addContext(e, root)
        })
        break
    }
  }
  getShowIcon() {
    // const form=this
  }
  getLayoutProps() {
    let obj = {}
    let type = this.state.type
    if (type == 'table') {
      let _obj = {
        hasWidthScale: true,
        hasCopy: true,
        hasDel: true,
        hasDrag: true,
        hasInserColumn: true,
        hasInserRow: true,
      }
      Object.assign(obj, _obj) //
    }
    return obj //
  }
  getNodeStyle() {}
}
