import { Arrayable } from "element-plus/es/utils/typescript"
import { Base } from "@/base/base"
import { Form, } from "./form"
import { Field, TableCell, TableRow } from "./layoutType"
import { FormItemRule, InputProps } from "element-plus"
import { computed, isRef } from "vue"
import { FormProps } from "./hooks/use-props"
import dayjs from 'dayjs'
import { showToast } from 'vant'
import Region from '@ER/region/Region'
import _ from "lodash"
import { areaList } from "@vant/area-data"
import { itemTypeMap } from "./itemTypeMap"
export type FormOptions = {
    items: Field[]
}


export class FormItem extends Base {
    field: Field = {} as any
    subForm?: Form
    form: Form
    config: Field//
    rowIndex: number// 
    columns: TableCell[] = []
    mobileColumns: TableCell[] = []
    constructor(config: Field, form) {
        super()
        let id = config.id
        if (id != null) {
            this.id = id//
        }
        this.form = form
        this.config = config
        this.init()//初始化行列
    }
    getField() {
        let config = this.config
        let field = config.field
        if (field == null) {
            field = this.id
        }
        return field
    }
    updateBindData(updateConfig: { value: any, [key: string]: any }) {
        try {
            let value = updateConfig.value
            let field = this.getField()
            let updateBefore = this.config.updateBefore
            if (typeof updateBefore == 'function') {
                updateBefore(value)
            }
            let data = this.getData()
            data[field] = value//
        } catch (error) {
            console.log('更新数据报错了')//
        }
    }
    getItemChange() {
    }
    async onValueChange() {

    }
    getForm() {
        return this.form//
    }
    getSpan() {
        let options = this.config
        let span = options.span
        let form = this.form
        let _span = form.getItemSpan()
        if (span == null) {
            span = _span
        }//
        return span
    }
    init() {
        super.init()//
        //处理列
        this.getTdColumn()
        //不影响form的属性
        // this.columns = tdRow//做一个缓存
        this.getRowIndex()
        //处理字段
        // let field = this.createField()
        // this.field = field
        let mobileRow = this.createMobileRow()
        this.mobileColumns = mobileRow//
        this.setSubForm()
    }//
    setSubForm() {
        let type = this.getType()
        let config = this.config
        let options = config.options
        if (type == 'Sform') {
            let formConfig = options?.formConfig || {}
            let _form = new Form(formConfig)
            _form.parent = this.form//
            this.subForm = _form//
            _form.curFormItem = this//
        }
    }//
    async getSelectOptions() {
        const config = this.config

    }
    getSubForm(id: string) {
    }
    getData() {
        let form = this.form
        let data = form.data
        return data//
    }
    getTdColumn(): TableCell[] {
        let span = this.getSpan()
        let tDList = Array(span).fill(null).map((row, i) => {
            let isMerge = i > 0 ? true : false
            let id = this.uuid()
            let key = `td_${id}`
            let list = []
            if (i == 0) {
                let iId = this.uuid()
                let iKey = `inline_${iId}`
                let fId = this.id
                let obj = {
                    type: 'inline',
                    columns: [fId],
                    style: {},
                    id: iId,
                    key: iKey
                }
                list.push(obj)
            }//
            let obj1: TableCell = {
                type: 'td',
                style: {},
                options: {
                    colspan: span,
                    rowspan: 1,
                    isMerged: isMerge
                },
                id,
                key,
                list: list//
            }
            return obj1
        })
        this.columns = tDList
        return tDList//
    }
    createField() {
        let type = this.getType()
        let id = this.id
        let key = `${type}_${id}`//
        let config = this.config
        let field = { ...this.config, id: id, key: key, field: config.field }
        return field
    }
    createMobileRow() {
        let obj = [{
            type: 'inline',
            columns: [this.id],
        }] as any
        return obj
    }
    getRowIndex() {
        let form = this.form
        let items = form.items
        let curIndex = items.findIndex((item) => item === this)
        if (curIndex === -1) {
            curIndex = items.length//
        }
        let preItems = items.slice(0, curIndex)
        let preSpans = preItems.map((item) => item.getSpan())
        let preSpan = preSpans.reduce((a, b) => a + b, 0)//
        let num = preSpan + this.getSpan()
        let rowIndex = 0
        if (num % 24 == 0) {
            rowIndex = num / 24 - 1
        } else {
            rowIndex = Math.floor((preSpan + this.getSpan()) / 24)
        }
        //做一个缓存
        this.rowIndex = rowIndex
        return rowIndex
    }

    getOptionField() {
        let config = this.config
        let id = this.id
        let obj: any = {
            ...config,
            id: id,
            key: this.getKey(),
        }
        obj.options = obj.options || {}
        const type = this.getType()
        obj.type = obj.type || type
        const style = this.getStyle()
        obj.style = obj.style || style//
        return obj
    }
    getDisabled() {
        let disables = this.config?.options?.disabled
        return disables//
    }
    getClearable() {
        let clearable = this.config?.options?.clearable
        if (clearable == null) {
            clearable = true
        }
        return clearable
    }
    getRequired() {
        let required = this.config?.options?.required
        return required
    }
    getLabelWidth() {
        let config = this.config
        let labelWidth = config?.labelWidth
        labelWidth = labelWidth ? labelWidth : 100
        let _width = `${labelWidth}px`
        return _width
    }
    getStyle() {
        let config = this.config
        let style = config?.style || {
            width: {
                pc: "100%",
                mobile: "100%"//
            }
        }
        return style
    }
    getKey() {
        let config = this.config
        let id = this.id
        let type = this.getType()
        let key = `${type}_${id}`
        return key
    }
    getPlaceholder() {
        let config = this.config
        let placeholder = config?.options?.placeholder || '请输入'
        return placeholder
    }
    getBindConfig() {
        let type = this.getType()//
        let typeFn = itemTypeMap[type]
        let defaultMap = itemTypeMap['default']
        let obj = {}
        if (typeFn) {
            obj = typeFn(this)
        } else {
            obj = defaultMap(this)
        }
        return obj
    }
    getBindValue(getConfig?: any) {
        let form = this.form
        let data = form.data
        let field = this.getField()
        let value = data[field]
        if (getConfig) {
            return value
        }
        return value
    }
    getTitle() {
        // console.log('fsklfsdjflkdsfjlksdfjdskl')//
        let config = this.config
        let label = config.label
        return label || '标题'//
    }
    getValidateRoles() {
        let field = this.getField()
        let r: FormItemRule = {
            //@ts-ignore
            trigger: "blur",
            required: true,
            asyncValidator: async (rule, value, callback) => {//
            }//
        }
        let rules = { field: field, rules: [r] }//
        return rules
    }
    getType() {
        let config = this.config
        let type = config.type
        if (type == null) {
            type = 'input'
        }
        return type
    }
    getFormItemProps(data, specialHandling, isRoot = false) {
        let form = this.form
        let t = form.t
        const formIns: Form = form
        let state = form.state
        let isPc = formIns.getIsPc()
        let node = isRoot ? data.config : data
        let result = new FormProps({})
        result.formitem = this
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
            label: this.getTitle(),//
            disabled: this.getDisabled(),
            placeholder: this.getPlaceholder(),
            clearable: this.getClearable(),
            required: this.getRequired()
        }
        Object.assign(result, result1)//
        //@ts-ignore
        result.prop = this.getField()//
        // addValidate(result, node, isPc, t, state, ExtraParams)
        if (isPc) {
            result.labelWidth = this.getLabelWidth()//
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
    }
}