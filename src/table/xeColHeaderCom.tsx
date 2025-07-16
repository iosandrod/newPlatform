import { defineComponent } from 'vue'
import { XeColumn } from './xecolumn'

export default defineComponent({
  name: 'XeColHeaderCom', //
  props: {
    config: {
      type: Object,
    },
    checked: {
      type: Boolean,
    },
  }, //
  setup(props) {
    let config = props.config
    let type = 'default'
    if (typeof config.checked == 'boolean') {
      type = 'checkbox'
    } //
    let column: XeColumn = config.column.params
    return () => {
      let com = null //
      if (type == 'checkbox') {
        com = (
          <div class="h-full w-full flex items-center justify-center">
            <vxe-checkbox
              onChange={(e) => {
                column
                  .getTable()
                  .onCheckboxChangeAll({ ...config, checked: e.checked }) //
              }} //
              modelValue={props.checked}
            ></vxe-checkbox>
          </div>
        )
      }
      if (type == 'default') {
        com = (
          <div class="h-full w-full flex items-center justify-center">
            {column.getTitle()}
          </div>
        )
      }
      return com //
    }
  },
})
