import { defineComponent } from 'vue';
import dayjs from 'dayjs';
import hooks from '@ER/hooks';
import DeviceSwitch from '@ER/formEditor/components/DeviceSwitch.vue';
import _ from 'lodash';
import { ref, unref, computed, inject } from 'vue';
import { ClickOutside as vClickOutside } from 'element-plus';
import CompleteButton from '@ER/formEditor/components/CompleteButton';
import PanelsConfigComponentsTypeComponent from './TypeComponent.vue';
import PanelsConfigComponentsLogicComponent from './LogicComponent.vue';
import utils from '@ER/utils';
export default defineComponent({
  setup(props, { slots, emit, attrs, expose }) {
    return () => {};
  },
});
