import { defineComponent, nextTick, provide, watchEffect } from 'vue'
import { VueFlow, FlowProps } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { flowProps } from './loginComProps'
import { Flow } from './flow'
import ERNodeVue from '@/ERNode'
import { TableFlow } from './tableFlow'
import { Contextmenu } from '@/contextM'
import ContextmenuCom from '@/contextM/components/ContextmenuCom'
export default defineComponent({
  //
  name: 'LoginCom',
  components: {
    VueFlow,
    Background,
    ContextmenuCom,
  },
  props: {
    ...flowProps,
    isERDiagram: {
      type: Boolean,
      default: false, // 是否是ER图
    },

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
    watchEffect(() => {
      flow.refreshNodes()
      flow.refreshEdges()
      setTimeout(() => {
        flow.autoFitView()
      }, 100) //
    })
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
            <erTable
              ref={(el) => flow.registerRef('columnTable', el)} //
              data={flow.getColumnConfigData()}
              columns={flow.getColumnConfigColumns()}
              showHeaderDefaultButtons={false}
              showHeaderButtons={true}
              buttons={flow.getColumnTableHeaderButtons()}
              showRowSeriesNumber={false}
              showCheckboxColumn={false} //
              showFooterTable={false} //
            ></erTable>
          </div>
        )
        leftTable = (
          <div class="w-1/4 h-full overflow-hidden flex flex-col">
            <div class="h-1/3">
              <erTable
                ref={(el) => flow.registerRef('tableTable', el)}
                onCurRowChange={(row) => {
                  flow.onCurRowChange(row)
                }}
                showHeaderButtons={true}
                showHeaderDefaultButtons={false}
                buttons={flow.getTableHeaderButtons()}
                // showControllerButtons={true} //
                // controllerButtons={flow.getTableControllerButtons()}
                showRowSeriesNumber={false}
                showFooterTable={false} //
                columns={flow.getTableConfigColumns()}
                data={flow.getTables()}
              ></erTable>
            </div>
            <div class="h-2/3 overflow-hidden">{columnTable}</div>
          </div>
        )
      }
      let com = (
        <div class="h-full w-full flex flex-col">
          {context}
          <div class="" style={{}}>
            <erButtonGroup items={flow.getControllButtons()}></erButtonGroup>
          </div>
          <div
            ref={(el) => flow.registerRef('container', el)}
            class="flex-1 overflow-hidden w-full flex"
          >
            {leftTable}
            <div class="h-full flex-1">
              <VueFlow
                key={flow.id}
                ref={(instance) => {
                  flow.registerRef('flow', instance) //
                }}
                {...props}
                nodeTypes={{ erTable: ERNodeVue }}
                nodes={flow.templateProps.nodes}
                edges={flow.templateProps.edges}
                onNodeClick={(e) => {
                  flow.onNodeClick(e)
                }}
              >
                <Background
                  variant="dots"
                  gap={16}
                  color="#978686"
                  size={1}
                ></Background>
              </VueFlow>
            </div>
          </div>
        </div>
      )
      return com //
    }
  },
})
