import { Base } from '@/base/base'
import { Form } from '@ER/form'
import { Context } from '@ER/utils/Context'
import utils from '@ER/utils'
let reg = /^(input|textarea|number|radio|checkbox|select|time|date|rate|switch|slider|html|cascader|uploadfile|signature|region|subform)$/
const excludes = [
  'grid',
  'col',
  'table',
  'tr',
  'td',
  'tabs',
  'tabsCol',
  'collapse',
  'collapseCol',
  'divider',
  'inline',
]
type ContextNode = {
  form: Form
}
//@ts-ignore
export class Node extends Base {
  form: Form
  context: Context
  type: string
  list?: Node[]
  rows?: Node[]
  columns?: Node[]
  children?: Node[]
  constructor(config, form) {
    super()
    Object.entries(config).forEach(([key, value]) => {
      this[key] = value
    })
    //@ts-ignore
    Object.defineProperties(this, 'form', {
      value: form,
      writable: false,
      enumerable: false,
      configurable: true,
    })
    this.setNodes()
    this.addContext()
  }
  setNodes() {
    let children = this.getChildren()
    for (const [key, value] of Object.entries(children)) {
      if (value instanceof Node) {
      } else {
        children[key] = new Node(value, this.form) //
      }
    }
  }
  addContext() {
    let children = this.getChildren()
    children.forEach((e) => {})
  }
  getFlatChildren() {
    let arr: any[] = []
    let items = this.getChildren() //
    let _items = items.map((item) => item.getFlatChildren())
    _items.forEach((e) => {
      arr.push(...e) //
    })
    return arr //
  }
  getChildren() {
    let items = this.list || this.rows || this.columns || this.children
    return items
  }
  checkIsField() {
    let type = this.getType()
    let res = reg.test(type)
    return res //
  }
  getType() {
    return this.type
  }
  flatNodes(excludes, fn?: any, excludesFn?: any) {
    let children = this.getChildren()
    let arr = []
    arr.push(this) //
    children.forEach((node) => {
      if (excludes.indexOf(node.type) === -1) {
        fn && fn(node)
      } else {
        excludesFn && excludesFn(node)
      }
      let _arr = node.flatNodes(excludes, fn, excludesFn) //
      arr.push(..._arr)
    })
    return arr
  }
  getNodeProps() {
    let obj = {
      type: this.type,
      data: this.getData(),
    }
  }
  getData() {
    let type = this.getType()
    if (type == 'inline') {
    }
  }
  getList() {}
  getTab() {
    return
  }
  getHandle() {
    return '.ER-handle'
  }
  getClass() {} //
  getGroup() {}
  getPlugins() {}
  getPluginName() {}
  syncWidthByPlatform() {}
  wrapElement() {}
  deepTraversal() {}
  renderFieldData() {}
  getAllFields() {}
  disassemblyData1() {}
  combinationData1() {}
  disassemblyData2() {}
  combinationData2() {}
  checkIslineChildren() {}
  pickfields() {}
  fieldLabel() {}
  transferData() {}
  transferLabelPath() {}
  isNull() {}
  repairLayout() {}
  checkIsInSubform() {}
  getSubFormValues() {}
  findSubFormAllFields() {}
  processField() {}
}
