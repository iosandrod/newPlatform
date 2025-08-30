import { defineComponent, inject } from 'vue'
import { buttonProps } from 'element-plus'
import { ContextmenuItem } from '@/contextM'
import { Button } from './button'
import * as andvIcon from '@ant-design/icons-vue'
export default defineComponent({
  name: 'buttonCom',
  props: {
    btnIns: {
      type: Object,
    },
    ...buttonProps,
    label: {
      type: String,
      default: '按钮', //
    },
    fn: {
      type: Function,
      default: () => { }, //
    },
  },
  setup(props, { emit, slots, expose, attrs }) {
    // let btn = new Button(props)
    let btn: Button = null
    if (props.btnIns != null) {
      btn = props.btnIns as any
    } else {
      btn = new Button(props)
    }
    let _config = btn.config
    // console.log(_config, 'test_config')//
    let page = inject('mainPageDesign', {})
    let runBtnFn = (el: Button) => {
      let p = el?.group?.config?.parent //
      btn.runFn({
        group: el.group,
        parent: p,
        page,//
      }) //
    } //
    return () => {
      let disabled = btn.getDisabled()
      let _class = ['er-h-32', 'items-center', 'flex']
      let _class1 = [
        'h-full w-full er-pl-10 er-pr-10  rounded-md custom-button',
      ]
      let dIcon = null
      if (btn?.buttons?.length > 0) {
        dIcon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="m12 15l-5-5h10z" />
          </svg>
        )
      }
      let _icon = btn.getIcon()
      let _iconC = null
      if (Boolean(_icon)) {
        let _cc = andvIcon[_icon]
        _iconC = <span class='h-full flex justify-center items-center'>
          <_cc></_cc>
        </span>
      }//
      let maskCom = null
      if (disabled == true) {
        // _class.push('is-disabled') //
        _class.push('') //
        _class1.push('is-disabled cursor-not-allowed')
        maskCom = (
          <div
            class="absolute top-0 left-0 w-full h-full  cursor-not-allowed opacity-0"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault() //
            }}
          ></div> //
        )
      } else {
        _class1.push('cursor-pointer')
      }
      // console.log(_iconC, '_test_icon_c')//
      let com = (
        <div
          onClick={() => {
            runBtnFn(btn)
          }}
          class={[..._class, 'pl-1 pr-1 relative']}
          style={{
            display: `${btn.getDisplay()}`, //
            minWidth: `${btn.getButtonWidth()}px`,
            position: 'relative',
            zIndex: 0,

          }
          }

        >
          <div
            class={[
              ..._class1,
              'flex justify-center items-center h-full w-full',
            ]}
          >
            <button class={[]}>
              <div class="flex">
                {btn?.getLabel()}
                {dIcon}
                {_iconC}
              </div>
            </button>
          </div>
          {maskCom}
        </div >
      )
      return com
    }
  },//
})//
