<template>
  <div
    :class="[cls, 'roy-divider', `roy-divider--${direction}`]"
    v-bind="rest"
  >
    <div
      v-if="slots.default && direction !== 'vertical'"
      :class="['roy-divider__text', `is-${contentPosition}`]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useAttrs, useSlots } from 'vue'

const props = defineProps({
  direction: {
    type: String,
    default: 'horizontal',
    validator: (val) => ['horizontal', 'vertical'].includes(val)
  },
  contentPosition: {
    type: String,
    default: 'center',
    validator: (val) => ['left', 'center', 'right'].includes(val)
  }
})

// Pull out "class" from attrs so we can merge it with our own classes
const attrs = useAttrs()
const slots = useSlots()
const { class: cls, ...rest } = attrs
</script>

<style scoped>
.roy-divider {
  /* basic divider styling; adjust as needed */
  display: flex;
  align-items: center;
  width: 100%;
}

.roy-divider--horizontal {
  border-top: 1px solid #ccc;
}

.roy-divider--vertical {
  border-left: 1px solid #ccc;
  height: 100%;
}

.roy-divider__text {
  padding: 0 8px;
}

.is-left {
  justify-content: flex-start;
}

.is-center {
  justify-content: center;
}

.is-right {
  justify-content: flex-end;
}
</style>
