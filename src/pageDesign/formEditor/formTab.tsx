import { ElBreadcrumb } from 'element-plus';
import { inject, defineComponent } from 'vue';
import hooks from '@ER/hooks';
export default defineComponent({
  props: {},
  setup(props) {
    const formIns = inject('formIns');
    const ns = hooks.useNamespace('breadcrumb');
    return () => {
      <ElBreadcrumb
        separator-icon={() => {
          return (
            <svg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'>
              <path
                fill='currentColor'
                d='M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z'
              />
            </svg>
          );
        }}
        class={ns.e('breadcrumb')}
      ></ElBreadcrumb>;
    };
  },
});
