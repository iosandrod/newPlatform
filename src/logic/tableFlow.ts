import { Edge } from '@vue-flow/core'
import { Flow } from './flow'
import dagre from 'dagre'
import { Contextmenu } from '@/contextM'
import { cacheValue, useTimeout } from '@ER/utils/decoration'
import { isProxy, isReactive, nextTick, reactive } from 'vue'
import { Dropdown } from '@/menu/dropdown'
import { BMenu } from '@/buttonGroup/bMenu'
import { Table } from '@/table/table'
import {
  getForeignKeyConfigColumns,
  getForeignKeyConfigData,
} from './tableFlowFn'
export class TableFlow extends Flow {
  constructor(config) {
    super(config) //
  }
 
  remoteTables: any = []
  refreshNodes(_config?: any) {
    let tables: any[] = this.getTables()
    // ✅ 筛选出 checkboxField = true 的表格
    let selectedTables = tables.filter((t: any) => t.checkboxField === true) //
    // ✅ 转换为 VueFlow 节点数组
    let nodes = selectedTables.map((table: any, index: number) => {
      let id = table.fid
      if (id == null) {
        id = this.uuid()
        table.fid = id //
      }
      return {
        id: table.fid, //
        type: 'erTable',
        position: {
          // x: 100 + index * 300, // 自动横向排列
          // y: 100,
          x: 0,
          y: 0, //
        },
        data: table, //
      } as any
    }) //
    nextTick(() => {
      let oldNodes = this.templateProps.nodes || []
      let _arr = []
      nodes.forEach((n) => {
        let id = n.id
        let oldNode = oldNodes.find((n) => n.id === id)
        if (oldNode) {
          _arr.unshift(n)
          n.position = { ...oldNode.position }
          n.isInPanel = true
        } else {
          n.isInPanel = false
          _arr.push(n)
        }
      })
      this.templateProps._nodes = _arr //
    })
  }

  refreshEdges(_config?: any) {
    //
    let config = _config || this.config
    let tables = config?.tables || []
    let foreignKeys = config?.foreignKeys || []
    let edges: Edge[] = []
    for (let fk of foreignKeys) {
      let { fromTable, fromField, toTable, toField } = fk
      if (!fromTable || !fromField || !toTable || !toField) continue
      let tableId = tables.find((t) => t.tableName === fromTable)?.fid
      let targetTableId = tables.find((t) => t.tableName === toTable)?.fid
      edges.push({
        id: `e-${fromTable}-${fromField}-to-${toTable}-${toField}`,
        source: tableId, //
        sourceHandle: `field-${fromField}`,
        target: targetTableId, //
        targetHandle: `field-${toField}`,
        type: 'default',
        animated: false,
        label: `${fromField} → ${toField}`,
      }) //
    }

    nextTick(() => {
      this.templateProps._edges = edges
    })
  }
  getNodes(template = false) {
    if (template) return this.templateProps._nodes
    return this.templateProps.nodes
  }
  getEdges(template = false) {
    if (template) return this.templateProps._edges
    return this.templateProps.edges
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
  } // //
  @useTimeout({ number: 200 })
  autoFitView() {
    const rawNodes: any[] = this.getNodes(true)
    const edges: Edge[] = this.getEdges(true)
    const zoom = this.getInstanceZoom()
    // 分组
    const oldNodes = rawNodes.filter((n) => n.isInPanel)
    let newNodes = rawNodes.filter((n) => !n.isInPanel)

    // 布局参数
    let NODE_WIDTH = 240
    let HEADER_HEIGHT = 60
    let ROW_HEIGHT = 28
    let V_SPACING = 20 // 列内垂直间距
    let H_SPACING = 50 // 列间水平间距

    // 画布高度
    const container = this.getRef('container')
    if (container == null) {
      return //
    }
    let { height: viewportHeight } = container.getBoundingClientRect()
    viewportHeight = viewportHeight / zoom //
    // 计算旧节点最右边界，作为新列起点
    const maxOldX = oldNodes.length
      ? Math.max(...oldNodes.map((n) => n.position.x + NODE_WIDTH))
      : 0
    let columnX = maxOldX + H_SPACING
    let cursorY = 0 //
    // 瀑布布局 newNodes
    newNodes = newNodes.map((node) => {
      const cols = node.data?.data?.columns ?? []
      const nodeHeight = HEADER_HEIGHT + (cols.length + 1) * ROW_HEIGHT

      // 如果当前列剩余空间不足，换列
      if (cursorY + nodeHeight > viewportHeight) {
        columnX += NODE_WIDTH + H_SPACING
        cursorY = 0
      }

      // 放置位置
      const placed: Node = {
        ...node,
        position: {
          x: columnX,
          y: cursorY,
        },
      }

      // 下一个节点 Y 游标向下移动
      cursorY += nodeHeight + V_SPACING
      return placed
    })

    // 合并并应用
    const layouted = [...oldNodes, ...newNodes]
    this.setNodes(layouted)
    this.setEdges(edges)
    console.log('自动布局', layouted) //
  }
  setNodes(nodes) {
    if (!Array.isArray(nodes)) {
      return
    }
    this.templateProps.nodes = nodes //
  }
  setEdges(edges) {
    if (!Array.isArray(edges)) {
      return
    } //
    this.templateProps.edges = edges
  }
  fitView() {
    let ins = this.getInstance()
    ins.fitView()
  }
  async init() {
    super.init()
    let config = this.config
    if (config.getRemoteTables) {
      //   await this.getRemoteTables() //
    }
  }
  async getRemoteTables() {
    let sys = this.getSystem()
    let _tables = await sys.getRealTables()
    return _tables //
  }
  setRemoteTables(tables: any[]) {
    if (!Array.isArray(tables)) {
      return
    } //
    let _tables = this.getTables()
    _tables.splice(0, _tables.length, ...tables) ////
  }
  @cacheValue()
  getTableControllerButtons() {
    return [
      {
        label: '编辑',
        icon: 'iconfont icon-layout',
        fn: () => {
          console.log('编辑') //
        },
      },
    ]
  }
  getControllButtons() {
    return [
      // {
      //   label: '自动布局',
      //   icon: 'iconfont icon-layout',
      //   fn: () => {
      //     this.autoFitView()
      //   },
      // },
      // {
      //   label: '获取表格',
      //   icon: 'iconfont icon-table',
      //   fn: async () => {
      //     let tables = await this.getRemoteTables() //
      //     // console.log(tables, 'testTables') //
      //     this.setRemoteTables(tables) ////
      //   },
      // },
      // {
      //   label: '获取zoom',
      //   icon: 'iconfont icon-table',
      //   fn: () => {
      //     let zoom = this.getInstanceZoom()
      //     console.log(zoom)
      //   },
      // },
      // {
      //   label: '返回管理页面',
      //   icon: 'iconfont icon-table',
      //   fn: () => {
      //     this.getSystem().routeTo('/admin') //
      //   },
      // },
    ]
  }
  getTables() {
    let tables = reactive(this.config.tables)
    return tables //
  }
  getLeftTableConfig() {} //
  @cacheValue() //
  getTableConfigColumns() {
    return [
      {
        field: 'tableName',
        title: '表名',
      },
      {
        field: 'cnName',
        title: '中文名',
      },
    ]
  }
  @cacheValue()
  getColumnConfigColumns() {
    return [
      {
        field: 'field',
        title: '字段名',
      },
      {
        field: 'type',
        title: '字段类型',
      },
      {
        field: 'default',
        title: '默认值',
      },
      {
        field: 'cnName',
        title: '中文名',
      },
    ]
  }
  getColumnConfigData() {
    let selection = this.getSelection()
    let columns = selection?.data?.columns || [] //
    return columns //
  }
  getSelection() {
    return this.selection //
  }
  getHandleStyle() {
    return {
      width: '10px',
      height: '10px',
    }
  }
  @cacheValue()
  getTableHeaderButtons() {
    return [
      {
        label: '新增表',
        icon: 'iconfont icon-layout',
        fn: () => {
          console.log('新增') //
        },
      },
    ] //
  }
  @cacheValue() //
  getColumnTableHeaderButtons() {
    return [
      {
        label: '新增字段',
        icon: 'iconfont icon-layout',
        fn: async () => {
          this.addField({ tableName: this.getCurrentSelectTableName() })
        },
      },
      {
        label: '更新字段',
      },
      {
        label: '删除字段',
        fn: async () => {
          await this.deleteField({
            tableName: this.getCurrentSelectTableName(),
          })
        },
      }, //
    ]
  }

  getCurrentSelectTableName() {
    let selection = this.getSelection()
    let tableName = selection?.tableName
    return tableName
  }
  async addField(config: any = {}) {
    let tableName = config.tableName
    if (tableName == null) {
      return
    } //
    let sys = this.getSystem() //
    let res = await sys.addTableField(tableName, { tableName: tableName }) //
    let node = this.getNodeByTableName(tableName) //
    let columns = this.getColumnsInNode(node)
    columns.splice(0, columns.length, ...res) //
  }
  getColumnsInNode(node) {
    return node.data.data.columns
  }
  getNodeByTableName(tableName: string) {
    let nodes = this.getNodes()
    let node = nodes.find((node) => node.data.tableName == tableName)
    return node
  }
  onFieldClick(config) {
    let f = config.field
    this.selectionField = f //
    let columnTable: Table = this.getRef('columnTable')
    let data = config.data
    this.setSelection(data) //
    this.setselectionField(f)
    // let hasRow = columnTable.getData().includes(f)
    // if (hasRow == false) {
    //   //
    //   columnTable.addAfterMethod({
    //     methodName: 'updateCanvas',
    //     fn: (config) => {
    //       let table = config.table
    //       table.setCurRow(f) //
    //     },
    //   })
    //   return
    // } else {
    //   columnTable.setCurRow(f)
    // }
    // nextTick(() => {
    // })
  }
  @cacheValue()
  getContextItems() {
    return [
      {
        label: '编辑字段',
        fn: async () => {}, //
      },
      {
        label: '删除字段',
        fn: async () => {
          await this.deleteField({
            tableName: this.getCurrentSelectTableName(), //
          })
        },
      },
    ]
  }
  setselectionField(field) {
    this.selectionField = field
    let columnTable: Table = this.getRef('columnTable')
    let f = field //
    let hasRow = columnTable.getData().includes(f)
    if (hasRow == false) {
      //
      columnTable.addAfterMethod({
        methodName: 'updateCanvas',
        fn: (config) => {
          let table = config.table
          table.setCurRow(f) //
        },
      })
      return
    } else {
      columnTable.setCurRow(f)
    }
  }
  onFieldContextClick(config) {
    let field = config.field //
    let data = config.data
    // debugger //
    this.setSelection(data) //
    this.setselectionField(field)
    let context: BMenu = this.getRef('contextmenu')
    let event = config.event
    if (context == null) {
      return
    }
    context.open(event) //
  }
  onNodeDrag(config) {
   
    let node = config.node //
    let id = node.id
    let myNode = this.getNodeById(id)
    let position = node.position
    myNode.position.x = position.x
    myNode.position.y = position.y //
  }
  getNodeById(id) {
    return this.templateProps.nodes.find((n) => n.id === id)
  }
  onMove(config) {
    let flowTransform = config.flowTransform
    this.templateProps.flowTransform = flowTransform //
  } //
  onConnect(config) {
    /* 
    {
    "source": "gXVCCYR-QEy5Ze-6tYl7p",
    "sourceHandle": "field-taskid",
    "target": "Kn_YQ52wfIOfako_QZgJr",
    "targetHandle": "field-id"
}
    */
    let source = config.source
    let target = config.target
    let sourceTable = this.getNodeById(source).data
    let targetTable = this.getNodeById(target).data
    let ins = this.getInstance() //
    ins.addEdges([config]) //
  }
  onConnectStart(config) {
    // console.log(config, 'onConnectStart') //
  }
  onConnectEnd(config) {
    // console.log(config, 'onConnectEnd') //
  }
  getForeignKeyConfigData() {
    let d = getForeignKeyConfigData(this)
    return d
  }
  @cacheValue()
  getForeignKeyConfigColumns() {
    let d = getForeignKeyConfigColumns(this)
    return d
  }
  @cacheValue()
  getForeignKeyTableHeaderButtons() {
    return [
      {
        label: '添加外键',
        fn: async () => {},
      },
      {
        label: '删除外键',
      },
    ]
  } //
  async deleteField(config) {
    let tableName = config.tableName
    let currentDesignField = this.selectionField
    if (currentDesignField == null) {
      return
    }
    let sys = this.getSystem()
    let _cols = await sys.removeTableField(tableName, currentDesignField) //
    let node = this.getNodeByTableName(tableName)
    let columns = this.getColumnsInNode(node)
    columns.splice(0, columns.length, ..._cols) //
  }
  async getSelectionField() {
    let selectionField = this.selectionField
    return selectionField //
  }
}
