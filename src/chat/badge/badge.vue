<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  count?: number
  isDot?: boolean
  max?: number
}>(), {
  max: 99,
})

const showCount = computed(() => {
  if (props.count && !props.isDot)
    return true
  return false
})

const badgeClass = computed(() => {
  if (showCount.value)
    return 'rounded-10px color-white px-6px top--5px right--4px h-16px line-height-16px'
  return 'w-8px h-8px rounded top--2px right--4px'
})
</script>

<template>
  <div relative>
    <slot />
    <div
      v-if="count"
      absolute text-12px
      bg="red"
      :class="badgeClass"
    >
      {{ showCount ? (count > max ? `${max}+` : count) : '' }}
    </div>
  </div>
</template>
