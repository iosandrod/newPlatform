import { Base } from '@ER/base'
import { Design, Node, Group } from './nodeClass'
import { produce } from 'immer'

export class DesignManager extends Base {
  constructor(initialDesign = new Design()) {
    super() //
    this.design = initialDesign
    this.selection = []
    this.listeners = new Set()
  }

  design: Design
  selection
  listeners

  // ===========================
  // 访问接口
  // ===========================
  getState() {
    return this.design
  }
  getSelection() {
    return this.selection
  }

  // ===========================
  // 状态操作
  // ===========================
  setSelection(nodeIds) {
    this.selection = Array.isArray(nodeIds) ? nodeIds : [nodeIds]
    this._notify()
  }

  apply(mutator) {
    const updated = this.design.applyChange(mutator)
    this.design = updated
    this._notify()
    return this.design
  }

  undo() {
    this.design = this.design.undo()
    this._notify()
    return this.design
  }

  redo() {
    this.design = this.design.redo()
    this._notify()
    return this.design
  }

  // ===========================
  // 增删改操作
  // ===========================
  addNode(node, parentGroupId = null) {
    return this.apply((draft) => {
      if (!parentGroupId) {
        draft.rootNodes.push(node)
      } else {
        const group = this.findNodeById(draft.rootNodes, parentGroupId)
        if (group?.type === 'group') {
          group.children.push(node)
        }
      }
    })
  }

  removeNode(nodeId) {
    return this.apply((draft) => {
      draft.rootNodes = this.removeRecursive(draft.rootNodes, nodeId)
    })
  }

  moveNode(nodeId, dx, dy) {
    return this.apply((draft) => {
      const node = this.findNodeById(draft.rootNodes, nodeId)
      if (node?.position) {
        node.position.x += dx
        node.position.y += dy
      }
    })
  }

  // ===========================
  // 事件监听（onChange）
  // ===========================
  onChange(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  _notify() {
    for (const fn of this.listeners) {
      fn(this.design)
    }
  }

  // ===========================
  // 快照导出/导入
  // ===========================
  exportSnapshot() {
    return JSON.stringify(this.design)
  }

  importSnapshot(json) {
    try {
      const raw = JSON.parse(json)
      this.design = Object.assign(new Design(), raw)
      this._notify()
    } catch (e) {
      console.error('设计快照导入失败:', e)
    }
  }

  // ===========================
  // 工具方法
  // ===========================
  findNodeById(id, nodes) {
    let _nodes = nodes || this.design.rootNodes
    for (const node of _nodes) {
      if (node.id === id) return node
      if (node.type === 'group' && node.children) {
        const found = this.findNodeById(id, node.children) //
        if (found) return found
      }
    }
    return null
  }

  removeRecursive(idToRemove, nodes) {
    nodes = nodes || this.design.rootNodes //
    return nodes.filter((node) => {
      if (node.id === idToRemove) return false
      if (node.type === 'group' && node.children) {
        //
        node.children = this.removeRecursive(idToRemove, node.children) //
      }
      return true
    })
  }
}
