import { defineComponent, onMounted, PropType, watch } from 'vue'
import VxeInput from 'vxe-pc-ui/packages/input'
import { Input } from './inputClass'
import { VxeInputPropTypes, getConfig } from 'vxe-table'
import dropdownCom from '@/menu/dropdownCom'
import { system } from '@/system'
export default defineComponent({
  name: 'InputCom',

  emits: [
    'update:modelValue',
    'input',
    'change',
    'keydown',
    'keyup',
    'wheel',
    'click',
    'focus',
    'blur',
    'clear',
    'search-click',
    'toggle-visible',
    'prev-number',
    'next-number',
    'prefix-click',
    'suffix-click',
    'date-prev',
    'date-today',
    'date-next',
  ],
  props: {
    onUpdateModelValue: Function,
    onInput: Function,
    onChange: Function,
    onKeydown: Function,
    onKeyup: Function,
    onWheel: Function,
    onClick: Function,
    onFocus: Function,
    onBlur: Function,
    onClear: Function,
    onSearchClick: Function,
    onToggleVisible: Function,
    onPrevNumber: Function,
    onNextNumber: Function,
    onPrefixClick: Function,
    onSuffixClick: Function,
    onDatePrev: Function,
    onDateToday: Function,
    onDateNext: Function,
    modelValue: [String, Number, Date] as PropType<
      VxeInputPropTypes.ModelValue
    >,
    immediate: {
      type: Boolean as PropType<VxeInputPropTypes.Immediate>,
      default: true,
    },
    name: String as PropType<VxeInputPropTypes.Name>,
    type: {
      type: String as PropType<VxeInputPropTypes.Type>,
      default: 'text',
    },
    clearable: {
      type: Boolean as PropType<VxeInputPropTypes.Clearable>,
      default: () => getConfig().input.clearable,
    },
    readonly: {
      type: Boolean as PropType<VxeInputPropTypes.Readonly>,
      default: null,
    },
    disabled: {
      type: Boolean as PropType<VxeInputPropTypes.Disabled>,
      default: null,
    },
    onConfirmTinyTable: {
      type: Function,
    },
    placeholder: {
      type: String as PropType<VxeInputPropTypes.Placeholder>,
      default: null,
    },
    maxLength: {
      type: [String, Number] as PropType<VxeInputPropTypes.MaxLength>,
      default: () => getConfig().input.maxLength,
    },
    autoComplete: {
      type: String as PropType<VxeInputPropTypes.AutoComplete>,
      default: 'off',
    },
    autoFocus: {
      type: Boolean as PropType<VxeInputPropTypes.AutoFocus>,
      default: null,
    },
    align: String as PropType<VxeInputPropTypes.Align>,
    form: String as PropType<VxeInputPropTypes.Form>,
    className: String as PropType<VxeInputPropTypes.ClassName>,
    size: {
      type: String as PropType<VxeInputPropTypes.Size>,
      default: () => getConfig().input.size || getConfig().size,
    },
    multiple: Boolean as PropType<VxeInputPropTypes.Multiple>,

    // text
    showWordCount: Boolean as PropType<VxeInputPropTypes.ShowWordCount>,
    countMethod: Function as PropType<VxeInputPropTypes.CountMethod>,

    // number、integer、float
    min: {
      type: [String, Number] as PropType<VxeInputPropTypes.Min>,
      default: null,
    },
    max: {
      type: [String, Number] as PropType<VxeInputPropTypes.Max>,
      default: null,
    },
    step: [String, Number] as PropType<VxeInputPropTypes.Step>,
    trim: {
      type: Boolean as PropType<VxeInputPropTypes.Trim>,
      default: () => getConfig().input.trim,
    },
    exponential: {
      type: Boolean as PropType<VxeInputPropTypes.Exponential>,
      default: () => getConfig().input.exponential,
    },

    // number、integer、float、password
    controls: {
      type: Boolean as PropType<VxeInputPropTypes.Controls>,
      default: () => getConfig().input.controls,
    },

    // float
    digits: {
      type: [String, Number] as PropType<VxeInputPropTypes.Digits>,
      default: () => getConfig().input.digits,
    },

    // date、week、month、quarter、year
    startDate: {
      type: [String, Number, Date] as PropType<VxeInputPropTypes.MinDate>,
      default: () => getConfig().input.startDate,
    },
    endDate: {
      type: [String, Number, Date] as PropType<VxeInputPropTypes.MaxDate>,
      default: () => getConfig().input.endDate,
    },
    minDate: [String, Number, Date] as PropType<VxeInputPropTypes.MinDate>,
    maxDate: [String, Number, Date] as PropType<VxeInputPropTypes.MaxDate>,
    // 已废弃 startWeek，被 startDay 替换
    startWeek: Number as PropType<VxeInputPropTypes.StartDay>,
    startDay: {
      type: [String, Number] as PropType<VxeInputPropTypes.StartDay>,
      default: () => getConfig().input.startDay,
    },
    labelFormat: String as PropType<VxeInputPropTypes.LabelFormat>,
    valueFormat: String as PropType<VxeInputPropTypes.ValueFormat>,
    editable: {
      type: Boolean as PropType<VxeInputPropTypes.Editable>,
      default: true,
    },
    festivalMethod: {
      type: Function as PropType<VxeInputPropTypes.FestivalMethod>,
      default: () => getConfig().input.festivalMethod,
    },
    disabledMethod: {
      type: Function as PropType<VxeInputPropTypes.DisabledMethod>,
      default: () => getConfig().input.disabledMethod,
    },

    // week
    selectDay: {
      type: [String, Number] as PropType<VxeInputPropTypes.SelectDay>,
      default: () => getConfig().input.selectDay,
    },

    prefixIcon: String as PropType<VxeInputPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeInputPropTypes.SuffixIcon>,
    placement: String as PropType<VxeInputPropTypes.Placement>,
    transfer: {
      type: Boolean as PropType<VxeInputPropTypes.Transfer>,
      default: null,
    },
    columnSelect: {
      type: Boolean,
    },
    formitem: {
      type: Object,
    },
    // 已废弃
    maxlength: [String, Number] as PropType<VxeInputPropTypes.Maxlength>,
    // 已废弃
    autocomplete: String as PropType<VxeInputPropTypes.Autocomplete>,
    isBaseinfo: {
      type: Boolean, //
      default: false, //
    },
    baseinfoTableName: {
      type: String, //
    },
    baseinfoConfig: {
      type: Object,
    },
    onVisibleChange: {
      type: Function, //
    },
    dropdownModelValue: {
      type: Boolean,
      default: false, //
    },
  },
  components: {
    dropdownCom,
    VxeInput,
  },
  setup(props, { emit, slots, attrs, expose }) {
    let _input = new Input(props) //
    let register = (el) => {
      _input.registerRef('input', el) //
    } //
    let registerDropdown = (el) => {
      _input.registerRef('dropdown', el) //
    }
    onMounted(() => {
      if (props.autoFocus == true) {
        _input.focus() //
      }
    })
    watch(
      () => {
        return props.dropdownModelValue
      },
      (value) => {
        if (value == true) {
          _input.showDropdown(value)
        } else {
          _input.hiddenDropdown() //
        }
      },
    )
    expose({ _instance: _input })
    return () => {
      let com = (
        <div class="h-full w-full flex">
          <VxeInput
            ref={register}
            autoFocus={props.autoFocus}
            style={{
              //
              flex: 1,
              height: '100%', //
              width: '100%', //
              paddingLeft: '3px',
              paddingRight: '3px', //
            }} //
            {...props} //
            onFocus={(config) => {}}
            modelValue={_input.getModelValue()}
            v-slots={{
              suffix: () => {
                let buttons = slots?.buttons?.()
                return buttons //
              },
            }}
          ></VxeInput>
          {/* {slots?.buttons?.()} */}
        </div>
      ) //
      let _com = null
      let type: any = props.type
      let isBaseinfo = props.isBaseinfo
      if (isBaseinfo) {
        //
        _com = (
          <dropdownCom
            class="h-full"
            ref={registerDropdown}
            onVisibleChange={(visible) => {
              let onVisibleChange = props.onVisibleChange
              if (typeof onVisibleChange == 'function') {
                onVisibleChange(visible) //
              }
            }}
            v-slots={{
              default: () => {
                return com //
              }, //
              dropdown: () => {
                let tableCom = _input.getSysComponents()['tableCom']
                let baseinfoConfig = props.baseinfoConfig
                let com = (
                  <div class="h-300 w-full" style={{ minWidth: '300px' }}>
                    <erXeTable
                      {...baseinfoConfig}
                      tableState="scan" //
                      showRowSeriesNumber={false} //
                      showCheckboxColumn={false} ////
                      onDbCurRowChange={(config) => {
                        // debugger//
                        let onConfirmTinyTable = props.onConfirmTinyTable
                        if (typeof onConfirmTinyTable == 'function') {
                          onConfirmTinyTable(config)
                        }
                      }}
                    ></erXeTable>
                  </div>
                )
                return com //
              },
            }}
          ></dropdownCom>
        )
      } else {
        _com = com //
      }
      return _com //
    }
  }, //
})
