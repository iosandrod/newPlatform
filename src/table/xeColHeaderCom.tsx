import { defineComponent, ref, withDirectives } from 'vue'
import { XeColumn } from './xecolumn'
import { table } from 'console'
import { XeTable } from './xetable'
import InputCom from '@/input/inputCom'
import { ClickOutside } from 'element-plus'

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
    let _type = config.column.type
    let column: XeColumn = config.column.params
    let table: XeTable = column.getTable()
    const sortIconArr = ref(null)
    const _filterIcon = ref(null)
    let showStatus = false
    let hiddenTimeout = null
    const mouseenterFn = () => {
      showStatus = true
      if (hiddenTimeout) {
        clearTimeout(hiddenTimeout) //
      }
      column.setShowDragIcon(true)
      if (sortIconArr.value) {
        sortIconArr.value.classList.remove('hidden')
        sortIconArr.value.classList.add('flex')
        sortIconArr.value.classList.add('flex-col') //
      }
      if (_filterIcon.value) {
        _filterIcon.value.classList.remove('hidden')
        _filterIcon.value.classList.add('flex') //
        _filterIcon.value.classList.add('flex-col')
      }
    }
    const mouseoutFn = () => {
      hiddenTimeout = setTimeout(() => {
        hiddenTimeout = null //
        column.setShowDragIcon(false) //
        if (sortIconArr.value) {
          sortIconArr.value.classList.remove('flex')
          sortIconArr.value.classList.remove('flex-col')
          sortIconArr.value.classList.add('hidden')
        }
        if (_filterIcon.value) {
          _filterIcon.value.classList.remove('flex')
          _filterIcon.value.classList.remove('flex-col')
          _filterIcon.value.classList.add('hidden') //
        }
        showStatus = false //
      }, 1000)
    }
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
        let sortIcon = (
          <div
            ref={(el) => {
              sortIconArr.value = el
            }}
            class=" justify-center hidden"
          >
            <i
              class="vxe-icon-caret-up er-h-10 cursor-pointer"
              onClick={(e) => {
                // e.stopPropagation()
                table.onSortClick({ ...config, event: e, sortType: 'asc' })
              }}
              style="font-size: 11px"
            ></i>
            <i
              onClick={(e) => {
                // e.stopPropagation()
                table.onSortClick({ ...config, event: e, sortType: 'desc' })
              }}
              class="vxe-icon-caret-down er-h-10 cursor-pointer"
              style="font-size: 11px"
            ></i>
          </div>
        )
        let filterIcon = (
          <div
            ref={(el) => (_filterIcon.value = el)}
            class="justify-center hidden"
            onClick={(e) => {
              // e.stopPropagation()
              table.onFilterIconClick({ ...config, event: e })
            }}
          >
            <i
              class="vxe-icon-funnel er-h-10 cursor-pointer"
              style="font-size: 15px"
            ></i>
          </div>
        )
        if (table.getShowFilterTable() == false) {
          filterIcon = null //
        }
        let iconArr = (
          <div class="absolute right-1 flex">
            {sortIcon}
            {filterIcon}
          </div>
        )
        if (_type == 'seq') {
          iconArr = null //
        }
        let showCom = <div>{column.getTitle()}</div>
        if (column.isEditTitle == true) {
          let v = column.getTitle()
          showCom = withDirectives(
            <div class="er-h-30">
              <InputCom
                onChange={(value) => {
                  column.setTemplateTitle(value) //
                }}
                autoFocus={true} //
                onBlur={() => {
                  column.setTitle(column.templateTitle) //
                  column.isEditTitle = false //
                  column.templateTitle = '' //
                }}
                modelValue={v}
              ></InputCom>
            </div>,
            [
              //
              [
                {
                  mounted: (el) => {
                    column.templateTitle = column.getTitle()
                  },
                  unmounted: (el) => {
                    column.setTitle(column.templateTitle) //
                  },
                },
              ],
            ],
          )
        }
        com = (
          <div
            onDblclick={(e) => {
              table.startEditColumnTitle({ ...config, event: e })
            }}
            onContextmenu={(e) => {
              table.onHeaderCellContext({
                ...config,
                event: e,
              })
            }}
            onMouseenter={(e) => {
              mouseenterFn()
            }}
            onMouseleave={(e) => {
              mouseoutFn() //
            }}
            class="h-full w-full flex items-center justify-center"
          >
            {showCom}
            {iconArr}
          </div>
        )
      }
      return com //
    }
  },
})
