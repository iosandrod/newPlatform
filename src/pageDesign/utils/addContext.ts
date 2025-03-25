import { computed, inject, reactive, toRaw } from 'vue'
import _ from 'lodash'
import { Context } from './Context'
// 示例使用
//node, parent?:any, fn?:any
export const addContext = (config) => {
  const { node, parent, fn } = config//
  if (node == null) {
    throw new Error('没有节点')//
  }
  let _context = new Context({
    node: node,
    parent: parent,
    fn: fn
  })
  return _context//
}