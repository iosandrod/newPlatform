import { computed, inject, reactive, toRaw } from 'vue'
import _ from 'lodash'
import { Context } from './Context'
// 示例使用
export const addContext = (config) => {
  // console.log(config, 'testConfig')//
  if (config.form == null) {
    // debugger//
  }
  const { node, parent, fn } = config//
  if (node == null) {
    throw new Error('没有节点')//
  }
  let _context = new Context({
    node: node,
    parent: parent,
    fn: fn,
    form: config.formIns,
  })
  return _context//
}