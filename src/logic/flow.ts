import { BMenu } from '@/buttonGroup/bMenu'
import { Table } from '@/table/table'
import { Base } from '@ER/base'
import { Context } from '@ER/utils/Context'
import { useTimeout } from '@ER/utils/decoration'
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
  refreshNodes(_nodes?: any) {
    this.templateProps._nodes = _nodes || this.config.nodes //
    this.autoFitView()
  }
  refreshEdges(_edges?: any) {
    this.templateProps._edges = _edges || this.config.edges //\
    this.autoFitView() //
  }
  @useTimeout({
    number: 200,
  })
  autoFitView() {
    let _nodes = this.getNodes(true)
    let _edges = this.getEdges(true) //
    this.setNodes(_nodes)
    this.setEdges(_edges)
    console.log('重新渲染了') //
  }
  setNodes(nodes: Node[]) {
    this.templateProps.nodes = nodes //
  }
  setEdges(edges: Edge[]) {
    this.templateProps.edges = edges //
    // console.log('newEdges', edges) //
  }
  openContextMenu(event) {//
    let context: BMenu = this.getRef('contextmenu') //
    if (event == null) {
      return //
    }
    if (context) {
      context.open(event) //
    }
  }
  getContextItems() {
    return [
      {
        label: '设计当前节点',
        fn: async () => {
          console.log('设计当前节点')// 
        },
      },
      {
        label: '设计当前组件',
        fn: async () => {
          let pageitem=this.config.pageitem
          if(pageitem!=null){
            pageitem.designCurrentNode()
          }
        },
      },
    ]
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
  getInstanceViewPort() {
    let ins = this.getInstance()
    if (ins == null) {
      return
    } //
    return this.getInstance().getViewport()
  }
  getInstanceZoom() {
    let viewport = this.getInstanceViewPort()
    return viewport?.zoom || 1
  }
  getNodes(template = false) {
    //
    if (template) return this.templateProps._nodes || []
    return this.templateProps.nodes || []
  }
  getEdges(template = false) {
    if (template) return this.templateProps._edges || []
    return this.templateProps.edges || [] //
  }
  onNodeClick(event: any) {
    let config = this.config //
    let node = event.node //
    let data = node.data
    this.setSelection(data) //
    if (config.onNodeClick) config.onNodeClick({ event, row: data }) //
  } //
  onCurRowChange(config: any) {
    let row = config.row //
    this.setSelection(row) //
  }
  onContextMenu(event: any) {
    event.preventDefault()
    // this.openContextMenu(event)
    this.openContextMenu(event) //
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
  getForeignKeys() {
    let ks = this.templateProps.foreignKeys || []
    return ks.map((v) => v) //
  }
  onNodeDrop(config) {
    //
  }
}
