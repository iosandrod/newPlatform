import { defineComponent, computed, inject } from 'vue'
import { Handle, Position, useVueFlow } from '@vue-flow/core'

type NodeBus = {
  emit: (evt: string, payload?: any) => void
}

interface DENodeData {
  label: string
  raw?: Record<string, any>
  collapsed?: boolean
  __phantom?: boolean
  color?: string
  // 可选：显式声明是否有入/出边（没有就默认都可连）
  hasIn?: boolean
  hasOut?: boolean
}

export default defineComponent({
  name: 'DENode',
  props: {
    id: { type: String, required: true }, // 由 Vue Flow 提供
    data: { type: Object as () => DENodeData, required: true },
    selected: { type: Boolean, default: false },
    dragging: { type: Boolean, default: false },
    connectable: { type: Boolean, default: true },
  },
  setup(props) {
    const { updateNodeData, findNode } = useVueFlow()
    const nodeBus = inject<NodeBus>('nodeBus', { emit: () => void 0 })

    const isPhantom = computed<boolean>(() => {
      const d = props.data
      return !!(d.__phantom || d.raw?.__phantom)
    })

    // 入/出边开关：如果没有显式 hasIn/hasOut，则按原始数据推断
    const hasIn = computed<boolean>(() => {
      if (typeof props.data.hasIn === 'boolean') return props.data.hasIn
      const raw = props.data.raw
      // 简单推断：若有其他节点指向本节点，通常需要在外部计算；这里默认 true
      return true
    })

    const hasOut = computed<boolean>(() => {
      if (typeof props.data.hasOut === 'boolean') return props.data.hasOut
      const raw = props.data.raw
      // 有 next 即认为可输出
      return !!(raw?.unode_next && raw.unode_next !== '-1')
    })

    const headerColor = computed<string>(() => {
      // 优先 data.color，其次按是否 phantom
      if (props.data.color) return props.data.color
      return isPhantom.value ? '#9CA3AF' : '#2563EB' // gray-400 / blue-600
    })

    const layerText = computed<string>(() => {
      const lv = props.data.raw?.wkn_layer
      return lv != null ? String(lv) : '-'
    })

    const subTitle = computed<string>(() => {
      const r = props.data.raw
      // 优先显示 wkp_id；可按需改成 wkn_desc / rmh_id 等
      return r?.wkp_id ? String(r.wkp_id) : ''
    })

    const okRate = computed<string>(() => {
      const r = props.data.raw
      return r?.wkn_ok_rate != null ? `${r.wkn_ok_rate}%` : ''
    })

    const efficiency = computed<string>(() => {
      const r = props.data.raw
      return r?.wkn_efficiency != null ? String(r.wkn_efficiency) : ''
    })

    const collapsed = computed<boolean>(() => !!props.data.collapsed)

    const onToggleCollapse = () => {
      updateNodeData(props.id, (d: any) => ({ ...d, collapsed: !d.collapsed }))
      nodeBus.emit('node:toggle', { id: props.id, collapsed: !collapsed.value })
    }

    const onNodeClick = (e: MouseEvent) => {
      nodeBus.emit('node:click', { id: props.id, event: e, data: props.data })
    }

    const onNodeDblClick = (e: MouseEvent) => {
      e.stopPropagation()
      onToggleCollapse()
    }

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      nodeBus.emit('node:context', {
        id: props.id,
        x: e.clientX,
        y: e.clientY,
        data: props.data,
      })
    }

    return () => {
      const borderBase = isPhantom.value
        ? 'border-dashed border-gray-400'
        : 'border-solid border-gray-300'
      const ring = props.selected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
      const dragging = props.dragging ? 'opacity-80' : ''

      return (
        <div
          class={`
            group
            rounded-2xl shadow-sm border bg-white min-w-[220px] max-w-[320px]
            ${borderBase} ${ring} ${dragging}
          `}
          onDblclick={onNodeDblClick}
          onClick={onNodeClick}
          onContextmenu={onContextMenu}
        >
          {/* Header */}
          <div
            class="flex items-center justify-between px-3 py-2 rounded-t-2xl"
            style={{ background: headerColor.value, color: '#fff' }}
          >
            <div class="truncate font-medium">
              {props.data.label ?? props.id}
            </div>
            <div class="ml-2 text-xs px-2 py-0.5 rounded-full bg-black/20">
              L{layerText.value}
            </div>
          </div>

          {/* Body */}
          {!collapsed.value && (
            <div class="px-3 py-2 text-sm text-gray-700">
              {subTitle.value && (
                <div class="mb-1 truncate">
                  <span class="text-gray-500 mr-1">工序ID:</span>
                  <span class="font-mono">{subTitle.value}</span>
                </div>
              )}

              <div class="mt-1 grid grid-cols-2 gap-x-2 gap-y-1">
                {okRate.value && (
                  <div class="flex items-center gap-1">
                    <span class="text-gray-500">合格率</span>
                    <span class="font-medium">{okRate.value}</span>
                  </div>
                )}
                {efficiency.value && (
                  <div class="flex items-center gap-1">
                    <span class="text-gray-500">效率</span>
                    <span class="font-medium">{efficiency.value}</span>
                  </div>
                )}
              </div>

              {/* 快速操作 */}
              <div class="mt-2 flex items-center gap-2">
                <button
                  class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleCollapse()
                  }}
                  title={collapsed.value ? '展开' : '折叠'}
                >
                  {collapsed.value ? '展开' : '折叠'}
                </button>
                <button
                  class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    nodeBus.emit('node:inspect', {
                      id: props.id,
                      data: props.data,
                    })
                  }}
                >
                  详情
                </button>
              </div>
            </div>
          )}

          {/* Footer（显示基础信息或折叠提示） */}
          {collapsed.value && (
            <div class="px-3 py-2 text-xs text-gray-500 border-t bg-gray-50 rounded-b-2xl">
              已折叠（双击或点击「展开」查看）
            </div>
          )}

          {/* Handles */}
          {hasIn.value && (
            <Handle
              id="in"
              type="target"
              position={Position.Left}
              class="!w-3 !h-3 !bg-white !border !border-gray-400 !shadow-sm"
            />
          )}
          {hasOut.value && (
            <Handle
              id="out"
              type="source"
              position={Position.Right}
              class="!w-3 !h-3 !bg-white !border !border-gray-400 !shadow-sm"
            />
          )}
          {/* 顶/底也给一个，便于多方向连接（可按需注释） */}
          <Handle
            id="top"
            type="target"
            position={Position.Top}
            class="!w-2.5 !h-2.5 !bg-transparent"
          />
          <Handle
            id="bottom"
            type="source"
            position={Position.Bottom}
            class="!w-2.5 !h-2.5 !bg-transparent"
          />
        </div>
      )
    }
  },
})
