import { defineComponent, computed } from 'vue'
import { useVueFlow, ConnectionLineProps } from '@vue-flow/core'

export default defineComponent({
  name: 'ConnectionLineWithCancel',
  props: {
    connectionLineData: {
      type: Object as () => ConnectionLineProps['connectionLineData'],
      required: true,
    },
    connectionMode: {
      type: String as () => ConnectionLineProps['connectionMode'],
      required: false,
    },
  },
  setup(props) {
    const { startConnection } = useVueFlow()

    // 计算按钮位置：连线中点
    const buttonX = computed(() => {
      const { x1 = 0, x2 = 0 } = props.connectionLineData || {}
      return (x1 + x2) / 2
    })
    const buttonY = computed(() => {
      const { y1 = 0, y2 = 0 } = props.connectionLineData || {}
      return (y1 + y2) / 2
    })

    // 生成贝塞尔路径
    const bezierPath = computed(() => {
      const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = props.connectionLineData || {}
      return `M${x1},${y1} C${x1 + 50},${y1} ${x2 - 50},${y2} ${x2},${y2}`
    })

    const cancel = () => {
      console.log('取消了') //
    }

    return () => (
      <g>
        {/* 默认连线路径 */}
        <path
          d={bezierPath.value}
          class="vue-flow__connection-line"
          fill="none"
          stroke="#888"
          stroke-width={2}
        />
        {/* 取消按钮 */}
        <foreignObject
          x={buttonX.value - 10}
          y={buttonY.value - 10}
          width={20}
          height={20}
          class="cursor-pointer"
        >
          <button
            onClick={cancel}
            class="w-5 h-5 bg-red-500 text-white rounded-full text-xs leading-none"
          >
            ×
          </button>
        </foreignObject>
      </g>
    )
  },
})
