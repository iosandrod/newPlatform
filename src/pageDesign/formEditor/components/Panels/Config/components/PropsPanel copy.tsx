import { defineComponent } from "vue";
import { ElMessage } from 'element-plus'
import { ref, computed, reactive, watchEffect, watch, unref, provide, onMounted, inject } from 'vue'
import utils from '@DESIGN/utils'
import hooks from '@DESIGN/hooks'
import PanelsConfigComponentsCheckboxComponent from './CheckboxComponent.vue'
import PanelsConfigComponentsCollapseComponent from './CollapseComponent.vue'
import PanelsConfigComponentsTypeComponent from './TypeComponent.vue'
import PanelsConfigComponentsBorderComponent from './BorderComponent.vue'
import PanelsConfigComponentsLimitComponent from './LimitComponent.vue'
import PanelsConfigComponentsAllsidesComponent from './AllsidesComponent.vue'
import PanelsConfigComponentsBackgroundComponent from './BackgroundComponent.vue'
import PanelsConfigComponentsDataComponent1 from './DataComponent1'
import PanelsConfigComponentsDataComponent2 from './DataComponent2'
import PanelsConfigComponentsDataComponent3 from './DataComponent3.vue'
import PanelsConfigComponentsSubformDefaultValue from './SubformDefaultValue.vue'
import Icon from '@DESIGN/icon'
export default defineComponent({
  name: "ConfigPropsPanel",//
  setup() {
    return () => <div></div>;
  },
});