import { Base } from "@ER/base";
import { computed, customRef, h, shallowRef, triggerRef } from "vue";
import { Column } from "./column";
import { ListTable } from '@visactor/vtable'
import { VTable } from '@visactor/vue-vtable'
import { method } from "lodash";
export class Table extends Base {
    isDesign = false//
    columns: Column[] = []
    config: any
    instance: ListTable
    tableData = {
        data: [],
        showData: []
    }
    templateProps: any = {}
    hooksManager: { [key: string]: Array<any> } = {}
    constructor(config) {
        super()
        this.config = config
        this.init()////
    }
    init() {
        super.init()//
        let config = this.config
        let columns = config.columns || []
        let data = config.data || []
        this.tableData.data = data
        this.setColumns(columns)//
    }//
    getTableName() {

    }
    render() {
        const rootDiv = this.getRef('root')
        let _instance = this.instance
        if (_instance == null) {
            return
        }
        // console.log(_instance, 'testInstance')//
        const instance = shallowRef(new ListTable({
            container: rootDiv
        }))
        //@ts-ignore
        this.instance = instance//
        this.loadColumns()
        this.loadData()
    }
    getColumns() {
        const columns = this.columns
        let _cols = columns.map(col => {
            return col.getColumnProps()
        })
        return _cols//
    }
    getOptions() {
        let tempalteProps = this.templateProps
        return { ...tempalteProps }//
    }
    getShowData() {
        //
        let tableData = this.tableData.data.map(d => {
            return { ...d }
        })
        return tableData
    }
    getData() {
        // let config = this.config
        // let data = config.data || []
        // console.log(config.data, 'testIsNullData')//
        // return data.map(item => { return { ...item } })//
        let tableData = this.tableData
        let data = tableData.data
        return data//
    }
    getDefaultWidth() {
        return 100
    }
    setColumns(columns) {
        this.columns.splice(0)
        for (const col of columns) {
            this.addColumn(col)//
        }
    }
    addColumn(config) {
        let col = new Column(config, this)
        this.columns.push(col)
    }
    // loadColumns() {
    //     let columns = this.getColumns()
    //     let instance = this.getInstance()
    //     instance.updateColumns(columns)
    // }
    loadColumns() {
        let _cols = this.getColumns()
        this.templateProps.columns = _cols
    }
    async loadData(loadConfig?: any) {
        return new Promise(async (resolve, reject) => {//
            try {
                await this.runBefore({ method: 'loadData' })
                let data = this.getShowData()//
                let _data1 = data
                this.templateProps.records = _data1//
                // instance.setRecords(_data1)//
                await this.runAfter()
                resolve(data)//
            } catch (error) {
                reject(error)
            }
        })
    }
    async runBefore(config?: any) {

    }
    async runAfter(config?: any) {

    }
    registerHooks(hConfig?: any) {

    }
    getInstance() {
        let instance = this.instance
        if (instance == null) {
            // throw new Error('instance is null')
            return {} as any
        }
        return instance
    }
    setMergeConfig(config?: any) {

    }
    async addRows(rowsConfig?: { rows?: Array<any> }) {
        let rows = rowsConfig.rows || []
        if (rows == null) {
            return
        }
        let _arr = rows
        if (!Array.isArray(rows)) {
            _arr = [rows]
        } else {
            if (rows.length == 0) {
                return
            }
        }
        for (const row of _arr) {
            await this.addRow(row)
        }
        // console.log(this.getData())//
        this.loadData()//
        // let instance = this.getInstance()
        // this.loadData().then(() => {
        //     // let _d = instance.records
        //     // let last = _d.length - 1//
        //     // instance.scrollToRow(last)//////
        // })
    }
    async addRow(row: any) {
        await this.getRunBefore({ method: "addRow" })
        console.log('is push')//
        let data = this.getData()
        data.push(row)
        await this.getRunAfter({ method: "addRow" })//
    }
}