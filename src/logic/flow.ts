import { Table } from '@/table/table'
import { Base } from '@ER/base'
import type { Node, Edge, FlowExportObject, VueFlowStore } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'
import { nanoid } from 'nanoid'
import { nextTick } from 'vue' //

export class Flow extends Base {
  selectionField: any
  selection: any //
  config: any
  nodes: Node[] = []
  edges: Edge[] = []
  templateProps: any = {
    nodes: [],
    edges: [],
  } //
  constructor(config = {}) {
    super()
    this.config = config //
    this.init()
  }
  getInstance(): InstanceType<typeof VueFlow> {
    let _r = this.getRef('flow')
    return _r //
  }
  refreshNodes() {
    nextTick(() => {
      this.templateProps.nodes = [
        {
          id: '1',
          type: 'input', // 起点
          label: '原料准备',
          position: { x: 50, y: 50 },
          data: { techNo: 'T01', wcNo: 'WC-01', duration: '2h' },
          style: {
            padding: '8px 12px',
            border: '1px solid #999',
            borderRadius: '6px',
          },
        },
        {
          id: '2',
          label: '切割',
          position: { x: 250, y: 50 },
          data: { techNo: 'T02', wcNo: 'WC-02', duration: '3h' },
        },
        {
          id: '3',
          label: '焊接',
          position: { x: 450, y: 50 },
          data: { techNo: 'T03', wcNo: 'WC-03', duration: '4h' },
        },
        {
          id: '4',
          label: '打磨',
          position: { x: 650, y: 50 },
          data: { techNo: 'T04', wcNo: 'WC-02', duration: '1.5h' },
        },
        {
          id: '5',
          label: '喷漆',
          position: { x: 850, y: 50 },
          data: { techNo: 'T05', wcNo: 'WC-04', duration: '2h' },
        },
        {
          id: '6',
          type: 'output', // 终点
          label: '入库',
          position: { x: 1050, y: 50 },
          data: { techNo: 'T06', wcNo: 'WC-05', duration: '1h' },
        },
      ] //
    })
  }
  refreshEdges() {}
  autoFitView() {}
  getContextItems() {}
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
  onNodeDrag(config) {
    let node = config.node //
    let id = node.id
    let myNode = this.getNodeById(id)
    let position = node.position
    myNode.position.x = position.x
    myNode.position.y = position.y //
  } //
  getNodeById(id) {
    return this.templateProps.nodes.find((n) => n.id === id)
  } //
  onMove(config) {
    let flowTransform = config.flowTransform
    this.templateProps.flowTransform = flowTransform //
  } ////
}
