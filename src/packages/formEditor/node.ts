import { Base } from '@/base/base'
import { Context } from '@ER/utils/Context'
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
export class Node extends Base {
  type: string
  context: Context //
  list?: Node[]
  rows?: Node[]
  columns?: Node[]
  children?: Node[]
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
}
