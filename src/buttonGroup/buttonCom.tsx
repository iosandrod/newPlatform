import { defineComponent } from 'vue'
import { buttonProps } from 'element-plus'
import { ContextmenuItem } from '@/contextM'
import { Button } from './button'
export default defineComponent({
  name: 'buttonCom',
  props: {
    ...buttonProps,
    label: {
      type: String,
      default: '按钮', //
    },
    fn: {
      type: Function,
      default: () => {}, //
    },
  },
  setup(props, { emit, slots, expose, attrs }) {
    let btn = new Button(props)
    let runBtnFn = (el: Button) => {
      btn.runFn({
        //
      })
    }
    return () => {
      //
      let com = (
        <div
          class="v-contextmenu"
          style={{ width: '', position: 'relative', zIndex: 0 }}
          onClick={() => {
            runBtnFn(btn)
          }}
        >
          <ContextmenuItem>{btn?.getLabel()}</ContextmenuItem>
        </div>
      )
      return com
    }
  },
})
