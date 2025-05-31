<template>
  <component
    :is="tag"
    :class="rowClasses"
    :style="rowStyle"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    default: 'div'
  },
  gutter: Number,
  type: String,
  justify: {
    type: String,
    default: 'start'
  },
  align: String
})

const rowStyle = computed(() => {
  const style = {}
  if (props.gutter) {
    const half = `${-props.gutter / 2}px`
    style.marginLeft = half
    style.marginRight = half
  }
  return style
})

const rowClasses = computed(() => [
  'roy-row',
  props.justify !== 'start' ? `is-justify-${props.justify}` : '',
  props.align ? `is-align-${props.align}` : '',
  { 'roy-row--flex': props.type === 'flex' }
])
</script>

<style scoped> 
.roy-row {
  display: block;
}
.roy-row--flex {
  display: flex;
}
.is-justify-start    { justify-content: flex-start; }
.is-justify-end      { justify-content: flex-end; }
.is-justify-center   { justify-content: center; }
.is-justify-space-between { justify-content: space-between; }
.is-justify-space-around  { justify-content: space-around; }

.is-align-top    { align-items: flex-start; }
.is-align-middle { align-items: center; }
.is-align-bottom { align-items: flex-end; }
/* 根据需要补充其他对齐类 */
</style>
