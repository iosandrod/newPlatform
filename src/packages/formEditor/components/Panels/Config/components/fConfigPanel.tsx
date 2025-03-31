import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
import { Form } from '@ER/form'
import formCom from '@ER/formCom'
import { computed, defineComponent, inject } from 'vue'
const fConfigItemMap = {
  input: {
    items: [
      {
        field: 'options.placeholder',
        label: '提示',
        type: 'input', //
      },
      {
        field: 'label',
        label: '标题',
        type: 'input', //
      },
    ],
  },
  root: {
    items: [
      {
        field: 'options',
        label: '配置',
        type: 'stable', //
      },
      {
        field: 'bindField',
        label: '绑定字段',
        type: 'input',
      },
      // {
      //   field: 'd',
      //   label: 'd',
      //   type: 'input',
      // },
      // {
      //   field: 'd111',
      //   label: 'd111', //
      //   type: 'input',
      // },
    ],
  },
  select: {
    items: [],
  },
}
export default defineComponent({
  props: {},
  components: {
    formCom,
  },
  setup(props, { slots, emit, attrs, expose }) {
    const fIns: Form = inject('formIns')
    const curType = computed(() => {
      let selected = fIns?.state.selected
      if (selected == null) {
        return null
      }
      if (typeof selected == 'string') {
        return selected
      }
      if (selected == fIns.state.config) {
        return 'root'
      }
      let t = fIns?.state.selected?.type //
      return t //
    })
    const items = computed(() => {
      let _item = fConfigItemMap[curType.value]?.items || []
      console.log(_item, '_item is change') //
      return _item
    })
    const selected = computed(() => {
      let _v = fIns?.state.selected || {}
      return _v //
    })
    return () => {
      return (
        //
        <div class="f-config-panel">
          {/* <ButtonGroupCom
            items={[
              {
                label: '按钮1',
                fn: () => {},
              },
            ]}
          ></ButtonGroupCom> */}
          {
            <formCom
              data={selected.value}
              itemSpan={24}
              items={items.value}
            ></formCom>
          }
        </div>
      )
    }
  },
})
