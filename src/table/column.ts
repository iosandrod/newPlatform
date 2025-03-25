import { Base } from "@/base/base";
import { Table } from "./table";
import { ColumnDefine, ListTableConstructorOptions } from "@visactor/vtable";

export class Column extends Base {
    table: Table
    config: any
    constructor(config: any, table?: any) {
        super()
        this.table = table
        this.config = config
        this.init()
    }//
    getFormitem() {

    }
    init(): void {
        super.init()//
        const config=this.config
    }
    getColumnProps() {
        let config = this.config
        let obj: ColumnDefine = {
            ...config,
            field: this.getField(),
            width: this.getColumnWidth()
        }
        return obj//
    }
    getField() {
        let config = this.config
        let field = config.field
        if (field == null) {
            field = this.id
        }
        return field//
    }
    getColumnWidth() {
        let config = this.config
        let width = config.width
        if (width == null) {
            let table = this.table
            let defaultWidth = table.getDefaultWidth()
            width = defaultWidth
        }
        return width
    }
}