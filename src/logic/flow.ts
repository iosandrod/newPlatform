import { Table } from '@/table/table'
import { Base } from '@ER/base'
import type { Node, Edge, FlowExportObject, VueFlowStore } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'
import { nanoid } from 'nanoid'

export class Flow extends Base {
  selectionField: any
  selection: any //
  config: any
  nodes: Node[] = []
  edges: Edge[] = []

  constructor(config = {}) {
    super()
    this.config = config //
    this.init()
  }
  getInstance(): InstanceType<typeof VueFlow> {
    let _r = this.getRef('flow')
    return _r //
  }
  /**
   * 添加一个表节点
   */
  addTable(name: string, position = { x: 100, y: 100 }) {
    const id = name.toLowerCase() + '-' + nanoid(6)
    const newNode: Node = {
      id,
      type: 'erTable',
      position,
      data: {
        label: name,
        fields: [],
      },
    }
    this.nodes.push(newNode)
    return newNode
  }
  /**
   * 向某个表添加一个字段
   */
  addColumn(
    tableId: string,
    fieldName: string,
    fieldType: string,
    options?: { isPrimary?: boolean; isForeign?: boolean },
  ) {
    let node = this.nodes.find((n) => n.id === tableId)
    if (!node) throw new Error(`Table not found: ${tableId}`) //
    node.data.fields.push({
      name: fieldName,
      type: fieldType,
      isPrimary: options?.isPrimary,
      isForeign: options?.isForeign,
    }) //
    return node
  }

  /**
   * 创建字段级别的连线
   */
  connectFields(
    sourceTable: string,
    sourceField: string,
    targetTable: string,
    targetField: string,
  ) {
    const edge: Edge = {
      id: `e-${sourceTable}-${sourceField}-to-${targetTable}-${targetField}`,
      source: sourceTable,
      sourceHandle: `field-${sourceField}`,
      target: targetTable,
      targetHandle: `field-${targetField}`,
      type: 'default',
      label: `${sourceField} → ${targetField}`,
    }

    this.edges.push(edge)
    return edge
  }

  /**
   * 返回全部节点和边，可传入 VueFlow 渲染
   */
  getFlowData() {
    return {
      nodes: this.nodes,
      edges: this.edges,
    }
  }
  logNodes() {
    let ins = this.getInstance() //
  }
  getNodes() {
    let config = this.config //
    if (config.nodes) {
      return config.nodes //
    }
  }
  getEdges() {
    let config = this.config //
    if (config.edges) {
      return config.edges //
    }
  }
  onNodeClick(event: any) {
    let config = this.config //
    let node = event.node //
    let data = node.data
    this.setSelection(data) //
    if (config.onNodeClick) config.onNodeClick(event) //
  } //
  onCurRowChange(config: any) {
    let row = config.row //
    this.setSelection(row) //
  }
  setSelection(selection: any) {
    let leftTable: Table = this.getRef('tableTable') //
    let curRow = leftTable?.getCurRow() //
    if (curRow != selection) {
      leftTable?.setCurRow(selection) //
    } //
    this.selection = selection
  }
}
