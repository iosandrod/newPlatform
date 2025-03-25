<script setup>
import { ref, onMounted, getCurrentInstance, inject, provide } from 'vue';
import { erFormEditor } from '@ER/formEditor';
import { globalConfig } from '@ER/formEditor/componentsConfig';
const { lang } = inject('globalConfig', {}); //
const EReditorRef = ref(null);
provide('globalConfig', globalConfig)
const handleListener = async ({ type, data }) => {
  switch (type) {
    case 'lang':
      lang.value = data; 
      localStorage.setItem('er-lang', data); 
      break;
  }
};
const checkFieldsForNewBadge = (field) => {
  return field.type === 'subform';
};
</script>
<template>
  <router-view></router-view> 
</template>
