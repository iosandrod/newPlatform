<script>
import utils from '@ER/utils'
import hooks from '@ER/hooks'
export default {
  name: 'ConfigCheckboxComponent',
  customOptions: {}
}
</script>
<script setup>
const {
  target
} = hooks.useTarget()
const ns = hooks.useNamespace('ConfigCheckboxComponent')
const props = defineProps({
  field: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
  // mode: {
  //   type: Number,
  //   default: 1
  // }
})
</script>
<template>
  <div :class="[ns.b(), target.options[field] && ns.e('open')]">
    <el-checkbox v-model="target.options[field]" @change="(newValue) => $emit('change', newValue)"
      :label="label"></el-checkbox>
    <template v-if="$slots.default">
      <div :class="[ns.e('slot')]" v-show="target.options[field]">
        <slot></slot>
      </div>
    </template>
  </div> 
</template>
