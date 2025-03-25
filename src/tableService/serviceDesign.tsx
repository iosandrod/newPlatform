import { defineComponent } from 'vue';
import { fService } from './fService';

export default defineComponent({
  setup(props, { slots, emit, attrs, expose }) {
    return () => {
      const design = new fService({});
      return <div>123</div>;
    };
  },
});
