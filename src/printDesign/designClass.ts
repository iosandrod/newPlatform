import { produce } from 'immer'
import { Design, Node, Group } from './nodeClass' // 假设你把类放到这个文件中

export class DesignManager {
  constructor(initialDesign = new Design()) {
    this.design = initialDesign
    this.selection = null
  }
  design // 当前设计状态
  selection // 当前选中的 nodeId 或多个 id
  getState() {
    return this.design
  }
  getSelection() {
    return this.selection
  }

  setSelection(nodeIds) {
    this.selection = Array.isArray(nodeIds) ? nodeIds : [nodeIds]
  }

  apply(mutator) {
    const updated = this.design.applyChange(mutator)
    this.design = updated
    return this.design
  }

  undo() {
    this.design = this.design.undo()
    return this.design
  }

  redo() {
    this.design = this.design.redo()
    return this.design
  }

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
      if (node && node.position) {
        node.position.x += dx
        node.position.y += dy
      }
    })
  }

  // === 工具方法 ===
  findNodeById(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.type === 'group' && node.children) {
        const found = this.findNodeById(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  removeRecursive(nodes, idToRemove) {
    return nodes.filter((node) => {
      if (node.id === idToRemove) return false
      if (node.type === 'group' && node.children) {
        node.children = this.removeRecursive(node.children, idToRemove)
      }
      return true
    })
  }
}
