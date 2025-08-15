import { defineComponent, nextTick, provide, watch, watchEffect } from 'vue'
import { VueFlow, FlowProps } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { flowProps } from './loginComProps'
import { Flow } from './flow'
import ERNodeVue from './ERNode'
import { TableFlow } from './tableFlow'
import { Contextmenu } from '@/contextM'
import ContextmenuCom from '@/contextM/components/ContextmenuCom'
import { MiniMap, MiniMapNode } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import tabCom from '@/buttonGroup/tabCom'
import DENode from './DENode'
export default defineComponent({
  //
  name: 'LoginCom',
  components: {
    VueFlow,
    Background,
    MiniMap,
    ContextmenuCom,
    Controls,
    MiniMapNode, //
    tabCom, //
  },
  props: {
    ...flowProps,
    isERDiagram: {
      type: Boolean,
      default: false, // 是否是ER图
    }, //
    tables: {
      type: Array,
      default: () => [],
    }, // 表格数据
    foreignKeys: {
      type: Array,
      default: () => [],
    },
    getRemoteTables: {
      type: Boolean,
      default: false, // 是否从远程获取表格数据
    },
  },
  setup(props) {
    let flow: TableFlow = null as any
    if (props.isERDiagram == false) {
      flow = new Flow(props) as any
    } else {
      flow = new TableFlow(props)
    }
    provide('flowIns', flow)
    // watchEffect(() => {
    //   flow.refreshNodes()
    //   flow.refreshEdges()
    //   setTimeout(() => {
    //     flow.autoFitView()
    //   }, 100) //
    // })
    watch(
      () => {
        // let length = 0
        if (props.isERDiagram) {
          let _this = flow
          let tables: any[] = _this.getTables()
          // ✅ 筛选出 checkboxField = true 的表格
          let selectedTables = tables.filter(
            (t: any) => t.checkboxField === true,
          )
          return selectedTables
        } else {
          let nodes = flow.config.nodes || []
          nodes = nodes.map((n) => n)
          return nodes
        }
      },
      (config: any) => {
        flow.refreshNodes() //
        flow.autoFitView()
      },
    ) //
    watch(
      () => {
        if (props.isERDiagram) {
          let foreignKeys: any[] = flow.getForeignKeys()
          return foreignKeys
        } else {
          let edges = flow.config.edges || []
          edges = edges.map((n) => n)
          return edges //
        }
      },
      (config: any) => {
        flow.refreshNodes()
        flow.autoFitView()
      },
    )
    watch(
      () => props.tables,
      (value) => {
        if (Array.isArray(value)) {
          value.forEach((table: any) => {
            let tableName = table.tableName
            // if (['task', 'resource', 'taskassignment'].includes(tableName)) {
            //   table.checkboxField = true //
            // }
          })
        }
      },
      { immediate: true },
    )
    // watchEffect(() => {}) //
    return () => {
      let leftTable = null
      const context = (
        <ContextmenuCom
          items={flow.getContextItems()}
          ref={(el) => flow.registerRef('contextmenu', el)}
        ></ContextmenuCom>
      )
      if (props.isERDiagram) {
        let columnTable = (
          <div class="h-full w-full">
            <erXeTable
              ref={(el) => flow.registerRef('columnTable', el)} //
              data={flow.getColumnConfigData()}
              columns={flow.getColumnConfigColumns()}
              showHeaderDefaultButtons={false}
              showHeaderButtons={true}
              buttons={flow.getColumnTableHeaderButtons()}
              showRowSeriesNumber={false}
              showCheckboxColumn={false} //
              showFooterTable={false} //
            ></erXeTable>
          </div>
        )
        let foreignKeyTable = (
          <div class="h-full w-full">
            <erXeTable
              ref={(el) => flow.registerRef('foreignKeyTable', el)} //
              data={flow.getForeignKeyConfigData()}
              columns={flow.getForeignKeyConfigColumns()}
              showHeaderDefaultButtons={false}
              showHeaderButtons={true}
              buttons={flow.getForeignKeyTableHeaderButtons()}
              showRowSeriesNumber={false}
              showCheckboxColumn={false} //
              showFooterTable={false} //
            ></erXeTable>
          </div>
        ) //
        let tabsLayout = (
          <tabCom
            items={[
              {
                label: '表格列',
                value: 'columnTable',
                name: 'columnTable',
              },
              {
                label: '外键',
                value: 'foreignKeyTable',
                name: 'foreignKeyTable', //
              },
            ]}
            v-slots={{
              default: (item) => {
                let config = item.config
                let name = config.name
                if (name === 'columnTable') {
                  return columnTable
                }
                if (name === 'foreignKeyTable') {
                  return foreignKeyTable //
                }
              },
            }}
          ></tabCom>
        )
        leftTable = (
          <div class="w-1/4 h-full overflow-hidden flex flex-col">
            <div class="flex-1">
              <erXeTable
                ref={(el) => flow.registerRef('tableTable', el)}
                onCurRowChange={(row) => {
                  flow.onCurRowChange(row)
                }}
                showHeaderButtons={true}
                showHeaderDefaultButtons={false}
                buttons={flow.getTableHeaderButtons()}
                showRowSeriesNumber={false}
                showFooterTable={false} //
                columns={flow.getTableConfigColumns()}
                data={flow.getTables()}
              ></erXeTable>
            </div>
            <div class="flex-1 overflow-hidden">
              {
                tabsLayout //
              }
            </div>
          </div>
        )
      }
      let com = (
        <div class="h-full w-full flex flex-col">
          {context}

          <div
            ref={(el) => flow.registerRef('container', el)}
            class="flex-1 overflow-hidden w-full flex"
          >
            {leftTable}
            <div class="h-full flex-1 relative">
              <VueFlow
                key={flow.id}
                ref={(instance) => {
                  flow.registerRef('flow', instance) //
                }}
                {...props}
                nodeTypes={{ erTable: ERNodeVue, erNode: DENode }} //
                nodes={flow.templateProps.nodes}
                edges={flow.templateProps.edges}
                onNodeClick={(e) => {
                  flow.onNodeClick(e)
                }}
                onNodeDrag={(config) => {
                  flow.onNodeDrag(config) // 👈 新增
                }}
                onMove={(config) => {
                  // console.log('onMove', config) //
                  flow.onMove(config)
                }}
                onConnect={(connection) => flow.onConnect(connection)}
                onConnectStart={(config) => {
                  flow.onConnectStart(config)
                }}
                onConnectEnd={(config) => {
                  flow.onConnectEnd(config) //
                }}
              >
                <Background
                  variant="dots"
                  gap={16}
                  color="#978686"
                  size={1}
                ></Background>
                <MiniMap
                  position="bottom-right"
                  style={{
                    width: 180,
                    height: 120,
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                  maskColor="rgba(240, 240, 240, 0.6)"
                  nodeColor={(node) =>
                    node.type === 'erTable' ? '#3B82F6' : '#999'
                  }
                  nodeStrokeColor={(node) =>
                    node.type === 'erTable' ? '#2563EB' : '#666'
                  }
                  nodeStrokeWidth={2}
                >
                  {{
                    default: () => (
                      <MiniMapNode
                        nodeColor={(node) =>
                          node.type === 'erTable' ? '#3B82F6' : '#999'
                        }
                        nodeStrokeWidth={2}
                      />
                    ),
                  }}
                </MiniMap>
                <Controls
                  position="bottom-left"
                  showInteractive={true} // 鼠标拖动
                  showZoom={true} // 缩放按钮
                  showFitView={true} // 自动居中
                  style={{
                    background: '#fff',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    height: '40px',
                  }}
                />
              </VueFlow>
            </div>
          </div>
        </div>
      )
      // return com //
      let com1 = (
        <div class="h-full flex flex-col w-full er-pt-32">
          <div class="absolute er-h-32"></div>
          <div class="flex-1">{com}</div>
        </div>
      )
      return com1 //
    } //
  }, //
})
