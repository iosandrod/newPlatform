<!--
 * @description 容器组件
 * @filename RoyContainer.vue
 * @author ROYIANS
 * @date 2023/4/3
-->
<template>
  <section :class="{ 'is-vertical': isVertical }" class="roy-container">
    <slot />
  </section>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  direction: String
})

const slots = useSlots()

const isVertical = computed(() => {
  if (props.direction === 'vertical') {
    return true
  }
  if (props.direction === 'horizontal') {
    return false
  }
  const vnodes = slots.default ? slots.default() : []
  return vnodes.some(vnode => {
    const type = vnode.type
    // 对于组件，type 可能是对象 (有 name)，也可能是字符串标签
    const name = typeof type === 'object' 
      ? type.name 
      : type
    return (
      name === 'roy-header' ||
      name === 'RoyHeader' ||
      name === 'roy-footer' ||
      name === 'RoyFooter'
    )
  })
})
</script>

<style scoped>
.roy-container.is-vertical {
  /* 你的垂直布局样式 */
}
.roy-container {
  /* 你的默认容器样式 */
}
</style>
