import { Edge } from '@vue-flow/core'
import { Flow } from './flow'
import dagre from 'dagre'
import { Contextmenu } from '@/contextM'
import { cacheValue, useTimeout } from '@ER/utils/decoration'
import { isProxy, isReactive, nextTick, reactive } from 'vue'
import { Dropdown } from '@/menu/dropdown'
import { BMenu } from '@/buttonGroup/bMenu'
import { Table } from '@/table/table'
export class TableFlow extends Flow {
  templateProps: any = {
    nodes: [],
    edges: [],
  } //
  remoteTables: any = []
  refreshNodes(_config?: any) {
    let tables: any[] = this.getTables()
    // ✅ 筛选出 checkboxField = true 的表格
    let selectedTables = tables.filter((t: any) => t.checkboxField === true) //
    // ✅ 转换为 VueFlow 节点数组
    let nodes: Node[] = selectedTables.map((table: any, index: number) => {
      let id = table.fid
      if (id == null) {
        id = this.uuid()
        table.fid = id //
      }
      return {
        id: table.fid, //
        type: 'erTable',
        position: {
          x: 100 + index * 300, // 自动横向排列
          y: 100,
        },
        data: table, //
      } as any
    }) //
    nextTick(() => {
      this.templateProps._nodes = nodes //
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
  } //
  @useTimeout({ number: 200 })
  autoFitView() {
    let rawNodes = this.getNodes(true)
    let edges = this.getEdges(true) //
    // 创建 dagre 图
    let g = new dagre.graphlib.Graph()
    g.setDefaultEdgeLabel(() => ({}))
    g.setGraph({
      rankdir: 'LR',
      nodesep: 100,
      ranksep: 100,
    })

    // 设置节点尺寸（用于布局）
    rawNodes.forEach((node) => {
      g.setNode(node.id, {
        width: 240,
        height: 60 + (node.data.fields?.length || 0) * 28,
      })
    })

    // 设置边
    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target)
    })

    // 计算布局
    dagre.layout(g)

    // 更新节点位置
    let layoutedNodes = rawNodes.map((node) => {
      let pos = g.node(node.id)
      return {
        ...node,
        position: {
          x: pos.x - 120, // 左上角对齐
          y: pos.y - 30,
        },
      }
    })
    // ===== 计算自定义视图偏移与缩放 =====
    let allX = layoutedNodes.map((n) => n.position.x)
    let allY = layoutedNodes.map((n) => n.position.y)

    let allRight = layoutedNodes.map((n) => n.position.x + 240)
    let allBottom = layoutedNodes.map(
      (n) => n.position.y + (60 + (n.data.fields?.length || 0) * 28),
    )

    let minX = Math.min(...allX)
    let maxX = Math.max(...allRight)
    let minY = Math.min(...allY)
    let maxY = Math.max(...allBottom)

    let contentWidth = maxX - minX
    let contentHeight = maxY - minY

    let container: HTMLDivElement = this.getRef('container')
    let containerRect = container.getBoundingClientRect()
    let viewportWidth = containerRect.width
    let viewportHeight = containerRect.height

    let zoomX = viewportWidth / (contentWidth + 100)
    let zoomY = viewportHeight / (contentHeight + 100)
    let zoom = Math.min(zoomX, zoomY, 1) // 最大缩放为1，防止放大

    // 计算偏移
    let offsetX = (viewportWidth - contentWidth * zoom) / 2 - minX * zoom
    let offsetY = (viewportHeight - contentHeight * zoom) / 2 - minY * zoom

    // 保存视图信息（可用于 setTransform）

    // console.log(viewportTransform)
    // 设置数据（可用于后续 VueFlow 渲染）
    // this.templateProps.nodes = layoutedNodes
    // this.templateProps.edges = edges
    // console.log('layoutedNodes', edges) //
    this.setNodes(layoutedNodes) // 设置节点
    this.setEdges(edges) // 设置边
    let viewportTransform = {
      x: offsetX,
      y: offsetY,
      zoom,
    }
    if (isNaN(viewportTransform.x) || isNaN(viewportTransform.y)) {
      return //
    }
    this.templateProps.viewport = viewportTransform
    // this.getInstance().setTransform(viewportTransform) //
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
      {
        label: '自动布局',
        icon: 'iconfont icon-layout',
        fn: () => {
          this.autoFitView()
        },
      },
      {
        label: '获取表格',
        icon: 'iconfont icon-table',
        fn: async () => {
          debugger //
          let tables = await this.getRemoteTables() //
          console.log(tables, 'testTables') //
          this.setRemoteTables(tables) ////
        },
      },
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
        field: 'cnName',
        title: '中文名',
      },
      {
        field: 'type',
        title: '字段类型',
      },
      {
        field: 'default',
        title: '默认值',
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
        fn: () => {
          let currentTableName = this.getCurrentSelectTableName()
          console.log(currentTableName, 'testName') //
        },
      },
      {
        label: '更新字段',
      },
      {
        label: '删除字段',
      }, //
    ]
  }
  getCurrentSelectTableName() {
    let selection = this.getSelection()
    let tableName = selection?.tableName
    return tableName
  }
  addField(config) {}
  onFieldClick(config) {
    let f = config.field
    this.selectionField = f //
    let columnTable: Table = this.getRef('columnTable')
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
    ]
  }
  onFieldContextClick(config) {
    let field = config.field
    this.selectionField = field
    let context: BMenu = this.getRef('contextmenu')
    let event = config.event
    if (context == null) {
      return
    }
    context.open(event) //
  }
}
