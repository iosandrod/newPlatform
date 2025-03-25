import { Arrayable } from "element-plus/es/utils/typescript"
import { Base } from "@/base/base"
import { Form, } from "./form"
import { Field, TableCell, TableRow } from "./layoutType"
import { FormItemRule, InputProps } from "element-plus"
import { computed } from "vue"
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
    updateBindData(updateConfig) {

    }
    async onValueChange() {

    }
    getForm() {
        return this.form//
    }
    getSpan() {
        let options = this.config
        let span = options.span
        if (span == null) {
            span = 6
        }
        return span
    }
    init() {
        //处理列
        let tdRow = this.getTdColumn()
        //不影响form的属性
        this.columns = tdRow//做一个缓存
        this.getRowIndex()
        //处理字段
        let field = this.createField()
        this.field = field
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
    getTr() {

    }
    getBindConfig() {
        let type = this.getType()//
        let form = this.form
        return computed(() => {
            let config = this.config
            let options = config.options
            let placeholder = options.placeholder
            let value = this.getBindValue()
            switch (type) {
                case 'select':
                case 'baseinfo':
                case 'date':
                case 'time':
                case 'datetime':
                case 'checkbox':
                case 'radio':
                case 'cascader':
                case 'region'://
                case 'uploadfile':
                case "textarea"://
                default:
                    break
            }
            let obj: Partial<InputProps> = {
                placeholder: placeholder,//
                modelValue: value,//
            }
            return obj
        })
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
        let config = this.config
        let label = config.label
        return label || '标题'//
    }
    getValidateRoles() {
        let field = this.getField()
        let r: FormItemRule = {
            //@ts-ignore
            trigger: 'change',
            required: true,
            asyncValidator: async (rule, value, callback) => {
                return Promise.reject('校验报错了')//
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
}