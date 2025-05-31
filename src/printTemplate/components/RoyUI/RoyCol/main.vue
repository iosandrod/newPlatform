<template>
  <component
    :is="tag"
    :class="['roy-col', ...classList]"
    :style="colStyle"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  span:   { type: Number, default: 24 },
  tag:    { type: String, default: 'div' },
  offset: Number,
  pull:   Number,
  push:   Number,
  xs:     [Number, Object],
  sm:     [Number, Object],
  md:     [Number, Object],
  lg:     [Number, Object],
  xl:     [Number, Object]
})

// 从父级 RoyRow 中注入 gutter（需要在 RoyRow 中 provide('gutter', props.gutter)）
const gutter = inject('gutter', 0)

// 计算左右 padding
const colStyle = computed(() => {
  if (gutter) {
    const half = `${gutter / 2}px`
    return { paddingLeft: half, paddingRight: half }
  }
  return {}
})

// 生成所有要加的 class
const classList = computed(() => {
  const list = []

  // span, offset, pull, push
  ;['span', 'offset', 'pull', 'push'].forEach(key => {
    const val = props[key]
    if (val !== undefined && val !== null) {
      list.push(
        key === 'span'
          ? `roy-col-${val}`
          : `roy-col-${key}-${val}`
      )
    }
  })

  // 响应式尺寸 xs, sm, md, lg, xl
  ;['xs','sm','md','lg','xl'].forEach(size => {
    const val = props[size]
    if (typeof val === 'number') {
      list.push(`roy-col-${size}-${val}`)
    } else if (val && typeof val === 'object') {
      Object.entries(val).forEach(([k, v]) => {
        list.push(
          k === 'span'
            ? `roy-col-${size}-${v}`
            : `roy-col-${size}-${k}-${v}`
        )
      })
    }
  })

  return list
})
</script>

<style scoped lang="scss">
.roy-col {
  box-sizing: border-box;
}

.roy-col[class*="roy-col-"] {
  float: left;
}

/* 示例基础样式，你可根据项目调整 */
</style>
