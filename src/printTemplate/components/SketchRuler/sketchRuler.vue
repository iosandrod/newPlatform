<template>
  <div id="mb-ruler" class="style-ruler mb-ruler">
    <!-- 水平方向 -->
    <RulerWrapper
      :canvas-configs="canvasConfigs"
      :height="thick"
      :is-show-refer-line="isShowReferLine"
      :lines="horLineArr"
      :palette="palette"
      :scale="scale"
      :select-length="shadow.width"
      :select-start="shadow.x"
      :start="startX"
      :thick="thick"
      :vertical="false"
      :width="width"
      @onLineChange="handleLineChange"
    />
    <!-- 竖直方向 -->
    <RulerWrapper
      :canvas-configs="canvasConfigs"
      :height="height"
      :is-show-refer-line="isShowReferLine"
      :lines="verLineArr"
      :palette="palette"
      :scale="scale"
      :select-length="shadow.height"
      :select-start="shadow.y"
      :start="startY"
      :thick="thick"
      :vertical="true"
      :width="thick"
      @onLineChange="handleLineChange"
    />
    <a
      :class="['corner', cornerActiveClass]"
      :style="cornerStyle"
      @click="onCornerClick"
    ></a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'
import RulerWrapper from './rulerWrapper.vue'

const props = defineProps({
  scale: {
    type: Number,
    default: 1
  },
  ratio: {
    type: Number,
    default: () => (window.devicePixelRatio || 1)
  },
  thick: {
    type: Number,
    default: 16
  },
  width: Number,
  height: Number,
  startX: {
    type: Number,
    default: 0
  },
  startY: {
    type: Number,
    default: 0
  },
  shadow: {
    type: Object,
    default: () => ({
      x: 200,
      y: 100,
      width: 200,
      height: 400
    })
  },
  horLineArr: {
    type: Array,
    default: () => [100, 200]
  },
  verLineArr: {
    type: Array,
    default: () => [100, 200]
  },
  cornerActive: Boolean,
  lang: String,
  isOpenMenuFeature: {
    type: Boolean,
    default: false
  },
  handleShowRuler: {
    type: Function,
    default: () => () => {}
  },
  isShowReferLine: {
    type: Boolean,
    default: true
  },
  handleShowReferLine: {
    type: Function,
    default: () => () => {}
  },
  palette: {
    type: Object,
    default: () => ({
      bgColor: 'rgba(225,225,225, 0)',        // ruler bg color
      longfgColor: '#BABBBC',                 // ruler longer mark color
      shortfgColor: '#C8CDD0',                // ruler shorter mark color
      fontColor: '#7D8694',                   // ruler font color
      shadowColor: '#E8E8E8',                 // ruler shadow color
      lineColor: '#EB5648',
      borderColor: '#DADADC',
      cornerActiveColor: 'rgba(235, 86, 72, 0.6)',
      menu: {
        bgColor: '#fff',
        dividerColor: '#DBDBDB',
        listItem: {
          textColor: '#415058',
          hoverTextColor: '#298DF8',
          disabledTextColor: 'rgba(65, 80, 88, 0.4)',
          bgColor: '#fff',
          hoverBgColor: '#F2F2F2'
        }
      }
    })
  }
})

const emit = defineEmits(['onCornerClick', 'handleLine'])

const cornerActiveClass = computed(() => (props.cornerActive ? 'active' : ''))

const cornerStyle = computed(() => ({
  backgroundColor: props.palette.bgColor,
  width: props.thick + 'px',
  height: props.thick + 'px',
  borderRight: `1px solid ${props.palette.borderColor}`,
  borderBottom: `1px solid ${props.palette.borderColor}`
}))

const canvasConfigs = computed(() => {
  const {
    bgColor,
    longfgColor,
    shortfgColor,
    fontColor,
    shadowColor,
    lineColor,
    borderColor,
    cornerActiveColor
  } = props.palette
  return {
    ratio: props.ratio,
    bgColor,
    longfgColor,
    shortfgColor,
    fontColor,
    shadowColor,
    lineColor,
    borderColor,
    cornerActiveColor
  }
})

function onCornerClick(event) {
  emit('onCornerClick', event)
}

function handleLineChange(arr, vertical) {
  const newLines = vertical
    ? { h: props.horLineArr, v: [...arr] }
    : { h: [...arr], v: props.verLineArr }
  emit('handleLine', newLines)
}
</script>

<style lang="scss">
.style-ruler {
  position: absolute;
  width: 100%; /* scrollbar width */
  height: 100%;
  z-index: 3; /* 需要比 resizer 高 */
  pointer-events: none;
  font-size: 12px;
  overflow: hidden;

  span {
    line-height: 1;
  }
}

.corner {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-sizing: content-box;
}
.corner.active {
  background-color: var(--corner-active-color) !important;
}

.indicator {
  position: absolute;
  pointer-events: none;

  .value {
    position: absolute;
    background: white;
  }
}

.ruler {
  width: 100%;
  height: 100%;
  pointer-events: auto;
}
</style>
 