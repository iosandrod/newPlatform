import { computed, inject, isRef } from 'vue'
import { showToast } from 'vant'
import dayjs from 'dayjs'
import _ from 'lodash'
import Region from '@DESIGN/region/Region'
import { areaList } from '@vant/area-data'
import { useI18n } from '../use-i18n'
import utils from '@DESIGN/utils'
import { Form } from '@DESIGN/form'
import { FormItem } from '@DESIGN/formitem'
import { StateType } from '@DESIGN/formEditor/formType'
class FormProps {
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  clearable?: boolean;
  required?: boolean;
  labelWidth?: string;
  maxlength?: number;
  showWordLimit?: boolean;
  showPassword?: boolean;
  prepend?: string;
  model?: any
  append?: string;
  type?: string;
  rows?: number;
  controls?: boolean;
  controlsPosition?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  options?: any[];
  multiple?: boolean;
  filterable?: boolean;
  format?: string;
  valueFormat?: string;
  rangeSeparator?: string;
  startPlaceholder?: string;
  disabledDate?: (time: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  defaultDate?: Date | Date[];
  contentPosition?: string;
  allowHalf?: boolean;
  count?: number;
  action?: string;
  maxSize?: number;
  config?: any;
  limit?: number;
  size?: any
  maxCount?: number;
  accept?: string;
  areaList?: any;
  columnsNum?: number;
  labelPosition?: string
  labelAlign?: string//
  formitem: FormItem
  //@ts-ignore
  constructor(init?: Partial<FormField>) {
    Object.assign(this, init);
  }
}

const findPosition = (node, parent) => {
  for (let y = 0; y < parent.list.length; y++) {
    const row = parent.list[y]
    const x = row.indexOf(node)
    if (x !== -1) {
      return { x, y }
    }
  }

  return { x: -1, y: -1 }
}
// const addValidate = (result, node, isPc, t, state, ExtraParams) => {
//   const {
//     options
//   } = node
//   if (isPc) {
//     result.prop = node.context && node.context.parents.map((e, index) => {
//       let result = ''
//       if (!index) {
//         result = e.context.parent.indexOf(e)
//       } else {
//         const parent = e.context.parent
//         let nodes = []
//         if (parent.type === 'subform') {
//           const {
//             x,
//             y
//           } = findPosition(e, parent)
//           result += `list.${y}.${x}`
//         } else {
//           if (parent.columns) {
//             nodes = parent.columns
//             result += 'columns.'
//           } else if (parent.list) {
//             nodes = parent.list
//             result += 'list.'
//           } else if (parent.rows) {
//             nodes = parent.rows
//             result += 'rows.'
//           }
//           result += nodes.indexOf(e)
//         }
//       }
//       return result
//     }).join('.') + '.options.defaultValue'
//   }

//   const obj: any = {
//   }
//   const validator = (...arg0) => new Promise((...arg1: any) => {
//     const resolve = () => {
//       arg1[0]()
//     }
//     const reject = isPc
//       ? arg1[1]
//       : (message) => {
//         obj.message = message
//         arg1[0](false)
//       }
//     let value = isPc ? arg0[1] : arg0[0]
//     if (/^(signature|radio|checkbox|select|html)$/.test(node.type)) {
//       value = options.defaultValue
//     }
//     const newValue = options.isShowTrim ? value.trim() : value
//     if (node.type === 'subform') {
//       const allFields = utils.findSubFormAllFields(node)
//       if (result.required) {
//         if (allFields.length) {
//           if (allFields.some(e => utils.isEmpty(e.options.isShowTrim ? e.options.defaultValue.trim() : e.options.defaultValue))) {
//             reject(t('er.validateMsg.required'))
//           }
//         } else {
//           reject(t('er.validateMsg.required'))
//         }
//       } else {
//         resolve()
//       }
//     } else {
//       let isRequired = result.required
//       if (state.mode === 'preview' && utils.checkIsInSubform(node)) {
//         const parent = node?.context?.parent?.context?.parent
//         if (parent) {
//           const {
//             readOnly,
//             required
//           } = getLogicStateByField(parent, state.fieldsLogicState)
//           const parentProps: any = useProps(state, parent, isPc, false, false, t, ExtraParams).value
//           if (required !== undefined) {
//             isRequired = parentProps.required
//           }
//         }
//       }
//       if (isRequired && node.type !== 'subform' && utils.isEmpty(newValue)) {
//         reject(t('er.validateMsg.required'))
//         return
//       }
//       if (/^(select|checkbox|radio)$/.test(node.type)) {
//         if ((_.isArray(node.options.defaultValue) ? node.options.defaultValue : [node.options.defaultValue]).includes('other')) {
//           const key = node.key + '_other'
//           if (!state.othersFiles[key]) {
//             reject(t('er.validateMsg.placeholder3'))
//             return false
//           }
//         }
//       }
//     }
//     switch (node.type) {
//       case 'input':
//         switch (options.renderType) {
//           case 1:
//             if (!!newValue && options.isShowWordLimit && newValue.length < options.min) {
//               reject(t('er.validateMsg.limitWord', { min: options.min }))
//             } else {
//               resolve()
//             }
//             break
//           case 2:
//             if (!!newValue && !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(newValue)) {
//               reject(t('er.validateMsg.email'))//
//             } else {
//               resolve()
//             }
//             break
//           case 3:
//             if (!!newValue && !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(newValue)) {
//               reject(t('er.validateMsg.IdNumber'))
//             } else {
//               resolve()
//             }
//             break
//           case 4:
//             if (!!newValue && !/^(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(newValue)) {
//               reject(t('er.validateMsg.phone'))
//             } else {
//               resolve()
//             }
//             break
//           case 5:
//             if (!!newValue && !/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(newValue)) {
//               reject(t('er.validateMsg.http'))
//             } else {
//               resolve()
//             }
//             break
//         }
//         break
//       case 'textarea':
//         if (!!newValue && options.isShowWordLimit && newValue.length < options.min) {
//           reject(t('er.validateMsg.limitWord', { min: options.min }))
//         } else {
//           resolve()
//         }
//         break
//       default:
//         resolve()
//         break
//     }
//   })
//   if (isPc) {
//     obj.required = options.required
//     obj.asyncValidator = validator
//   } else {
//     obj.validator = validator
//   }
//   result.rules = [obj]
// }
const getLogicStateByField = (field, fieldsLogicState) => {
  // console.log(field, 'testField is Object')//
  let fieldState = fieldsLogicState.get(field)
  let required = _.get(fieldState, 'required', undefined)
  let readOnly = _.get(fieldState, 'readOnly', undefined)
  return {
    required,
    readOnly
  }
}

export const useProps = (state: StateType, data, isPc = true, isRoot = false, specialHandling?: any, t?: any, ExtraParams?: any) => {
  if (!t) {
    t = useI18n().t
  }
  if (!ExtraParams) {
    ExtraParams = inject('EverrightExtraParams', {})
  }
  //这个form不是这个form//
  const formIns: Form = inject('formIns', {}) as any
  // console.log(formIns,'testFormIns')
  // console.log(state,data, 'testState')
  return computed(() => {
    let node = isRoot ? data.config : data
    let result = new FormProps({})
    const item = formIns.items.find(item => item.id === data.id)//
    result.formitem = item
    const platform = isPc ? 'pc' : 'mobile'
    if (isRoot) {
      if (isPc) { 
        result.model = data.store// is Array
        result.size = node.pc.size
        result.labelPosition = node[platform].labelPosition
      } else {
        result.labelAlign = node[platform].labelPosition
      }
      return result
    }
    if (isRef(data)) {
      node = data.value
    }
    const {
      options
    } = node
    let result1 = {
      label: options.isShowLabel ? node.label : '',
      disabled: options.disabled,
      placeholder: options.placeholder,
      clearable: options.clearable,
      required: options.required
    }
    Object.assign(result, result1)//
    if (state.mode === 'preview') {
      const {
        readOnly,
        required
      } = getLogicStateByField(node, state.fieldsLogicState)
      if (readOnly === undefined) {
        result.disabled = options.disabled
      } else {
        result.disabled = readOnly === 1
      }
      if (required === undefined) {
        result.required = result.disabled ? false : result.required
      } else {
        result.required = result.disabled ? false : required === 1
      }
    }
    // console.log(ExtraParams, 'testParams')//
    const formitem: FormItem = ExtraParams.formitem
    //@ts-ignore
    result.prop = 'email'
    // addValidate(result, node, isPc, t, state, ExtraParams)
    if (isPc) {
      result.labelWidth = options.isShowLabel ? options.labelWidth + 'px' : 'auto'
    }
    switch (node.type) {
      case 'input':
        if (options.isShowWordLimit) {
          result.maxlength = options.max
          result['show-word-limit'] = options.isShowWordLimit
        }
        if (isPc) {
          result.showPassword = options.showPassword
          result.prepend = options.prepend
          result.append = options.append
        } else {
          if (options.showPassword) {
            result.type = 'password'
          }
          if (options.renderType === 4) {
            result.type = 'tel'
          }
        }
        break
      case 'textarea':
        if (options.isShowWordLimit) {
          result.maxlength = options.max
          result['show-word-limit'] = options.isShowWordLimit
        }
        result.type = 'textarea'
        result.rows = options.rows
        break
      case 'number':
        if (isPc) {
          result.controls = options.controls
          if (options.controls) {
            result['controls-position'] = options.controlsPosition ? 'right' : ''
          }
        } else {
          // result.inputWidth = '100px'
          //@ts-ignore
          result.defaultValue = null
          //@ts-ignore
          result.allowEmpty = true
        }
        if (options.isShowWordLimit) {
          result.min = options.min
          result.max = options.max
        } else {
          result.min = Number.NEGATIVE_INFINITY
          result.max = Number.POSITIVE_INFINITY
        }
        result.step = options.step
        result.precision = options.precision
        break
      case 'radio':
      case 'checkbox':
        result.options = _.get(state, `data[${options.dataKey}].list`, [])
        break
      case 'select':
        result.options = _.get(state, `data[${options.dataKey}].list`, [])
        result.multiple = options.multiple
        result.filterable = options.filterable
        break
      case 'time':
        result.format = options.format
        if (isPc) {
          result.valueFormat = options.valueFormat
        }
        break
      case 'date':
        result.placeholder = options.placeholder
        result.format = options.format
        result.type = options.type
        if (isPc) {
          result.valueFormat = 'X'
          if (options.type === 'daterange') {
            result.rangeSeparator = ''
            result.startPlaceholder = options.placeholder
          }
          result.disabledDate = (time) => {
            const {
              startTime,
              endTime,
              isShowWeeksLimit
            } = options
            const startDate = dayjs.unix(startTime)
            const endDate = dayjs.unix(endTime)
            const currentDate = dayjs(time)
            let result = false
            if (options.isShowWordLimit) {
              result = currentDate.isBefore(startDate) || currentDate.isAfter(endDate)
            }
            return result
          }
        } else {
          const {
            startTime,
            endTime,
            isShowWeeksLimit
          } = options
          switch (options.type) {
            case 'date':
            case 'datetime':
              if (startTime && options.isShowWordLimit) {
                result.minDate = dayjs.unix(startTime).toDate()
              } else {
                result.minDate = dayjs.unix(0).toDate()
              }
              if (endTime && options.isShowWordLimit) {
                result.maxDate = dayjs.unix(endTime).toDate()
              } else {
                result.maxDate = dayjs().add(20, 'year').toDate()
              }
              break
            case 'dates':
              if (_.isEmpty(options.defaultValue)) {
                result.defaultDate = null
              } else {
                options.defaultValue.map(e => dayjs.unix(e).toDate())
              }
              if (startTime && options.isShowWordLimit) {
                result.minDate = dayjs.unix(startTime).toDate()
              } else {
                result.minDate = dayjs().subtract(1, 'year').toDate()
              }
              if (endTime && options.isShowWordLimit) {
                result.maxDate = dayjs.unix(endTime).toDate()
              } else {
                result.maxDate = dayjs().add(1, 'year').toDate()
              }
              break
            case 'daterange':
              if (options.defaultValue) {
                result.defaultDate = options.defaultValue.map(e => dayjs.unix(e).toDate())
              } else {
                result.defaultDate = null
              }
              if (startTime && options.isShowWordLimit) {
                result.minDate = dayjs.unix(startTime).toDate()
              } else {
                result.minDate = dayjs().subtract(1, 'year').toDate()
              }
              if (endTime && options.isShowWordLimit) {
                result.maxDate = dayjs.unix(endTime).toDate()
              } else {
                result.maxDate = dayjs().add(1, 'year').toDate()
              }
              break
          }
        }
        break
      case 'cascader':
        result.options = _.get(state, `data[${options.dataKey}].list`, [])
        //@ts-ignore
        result.props = {
          multiple: options.multiple,
          checkStrictly: options.checkStrictly
        }
        // result.options = options.options
        break
      case 'slider':
        result.step = options.step
        result.min = options.min
        result.max = options.max
        break
      case 'divider':
        result.contentPosition = options.contentPosition
        break
      case 'rate':
        result.allowHalf = options.allowHalf
        if (!isPc) {
          result.count = options.max
        } else {
          result.max = options.max
        }
        break
      case 'html':
        result.type = 'textarea'
        result.rows = 4
        result.action = options.action
        result.maxSize = options.size * 1024 * 1024
        result.config = {
          placeholder: options.placeholder
        }
        if (!isPc) {
          result.config.toolbar = {
            items: [
              'formattingOptions',
              '|',
              'uploadImage',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'link',
              'undo',
              'redo'
            ]
          }
          result.config.formattingOptions = [
            'fontFamily',
            'fontSize',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'alignment',
            'blockQuote',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'insertTable',
            'removeFormat'
          ]
        }
        break
      case 'uploadfile':
        result.multiple = options.multiple
        result.action = options.action
        // result.size = options.size
        result.accept = options.accept
        result.maxSize = options.size * 1024 * 1024
        if (isPc) {
          result.limit = options.limit
        } else {
          result.maxCount = options.limit
          //@ts-ignore
          result.onOversize = (file) => {
            showToast(t('er.validateMsg.fileSize', { size: options.size }))
          }
        }
        break
      case 'region':
        if (isPc) {
          const region = new Region(areaList, {
            isFilter: false,
            selectType: options.selectType
          })
          result.options = region.getAll()
          //@ts-ignore 
          result.props = {
            emitPath: false
          }
          result.filterable = options.filterable
        } else {
          result.areaList = areaList
          result.columnsNum = options.selectType
        }
        break
    }
    specialHandling && specialHandling(node.type, result)
    return result
  })
}
