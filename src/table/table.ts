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
    hooksManager: { [key: string]: Array<any> } = {}
    constructor(config) {
        super()
        this.config = config
        this.init()//
    }
    init() {
        super.init()//
        let config = this.config
        let columns = config.columns || []
        this.setColumns(columns)//
    }//
    getTableName() {

    }
    render() {
        const rootDiv = this.getRef('root')
        let _instance = this.instance
        if (_instance != null) {
            return
        }
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
        let options = {
            records: [
                { gender: '男', name: '张三', age: 20, city: '北京' },
                { gender: '女', name: '李四', age: 21, city: '上海' },
                { gender: '男', name: '王五', age: 22, city: '广州' },
                { gender: '女', name: '赵六', age: 23, city: '深圳' },
                { gender: '男', name: '孙七', age: 24, city: '成都' },
                { gender: '女', name: '周八', age: 25, city: '重庆' },
                { gender: '男', name: '吴九', age: 26, city: '西安' }
            ],
            columns: [
                {
                    field: 'name',
                    title: '姓名',
                    width: 200,
                    // customLayout: args => {
                    //     const { table, row, col, rect, value } = args;
                    //     const { height, width } = rect ?? table.getCellRect(col, row);
                    //     const container = new VTable.CustomLayout.Group({
                    //         height,
                    //         width,
                    //         display: 'flex',
                    //         alignItems: 'center',
                    //         //@ts-ignore
                    //         vue: {
                    //             element: h('div', { style: {} }, ['123123']),//
                    //             container: table.bodyDomContainer
                    //         } 
                    //     });

                    //     return {
                    //         rootContainer: container,
                    //         renderDefault: false
                    //     };
                    // }
                },
                { field: 'age', title: '年龄', width: 150 },
                { field: 'city', title: '城市', width: 200 },
                {
                    field: 'gender',
                    title: '性别',
                    width: 100,
                    headerCustomLayout: args => {
                      const { table, row, col, rect, value } = args;
                      const { height, width } = rect ?? table.getCellRect(col, row);

                      const container = new VTable.CustomLayout.Group({
                        height,
                        width,
                        display: 'flex',
                        alignItems: 'center',
                        // vue: {
                        //   element: h(ArcoDesignVue.Tag, { color: 'green' }, value),
                        //   container: table.headerDomContainer
                        // }
                      });
                      return {
                        rootContainer: container,
                        renderDefault: false
                      };
                    },
                    customLayout: args => {
                      const { table, row, col, rect, value } = args;
                      const { height, width } = rect ?? table.getCellRect(col, row);

                      const container = new VTable.CustomLayout.Group({
                        height,
                        width,
                        display: 'flex',
                        alignItems: 'center',
                        //@ts-ignore
                        vue: {
                          element: h('div', { color: value === '女' ? 'magenta' : 'arcoblue' }, value),
                          container: table.bodyDomContainer
                        }
                      });

                      return {
                        rootContainer: container,
                        renderDefault: false
                      };
                    }
                },
                {
                    field: 'comment', 
                    title: '评论',
                    width: 300,
                    // customLayout: args => {
                    //   const { table, row, col, rect, value } = args;
                    //   const { height, width } = rect ?? table.getCellRect(col, row);

                    //   const container = new VTable.CustomLayout.Group({
                    //     height,
                    //     width,
                    //     display: 'flex',
                    //     alignItems: 'center',
                    //     vue: {
                    //       element: h(
                    //         ArcoDesignVue.Comment,
                    //         { author: 'Socrates', content: value, datetime: '1 hour' },
                    //         {
                    //           actions: () => [
                    //             h('span', { key: 'heart', style: { cursor: 'pointer' } }, [h('span', 'Like')]),
                    //             h('span', { key: 'star', style: { cursor: 'pointer' } }, [h('span', 'Collect')]),
                    //             h('span', { key: 'reply', style: { cursor: 'pointer' } }, [h('span', 'Reply')])
                    //           ],
                    //           avatar: () => [
                    //             h(
                    //               ArcoDesignVue.Avatar,
                    //               {},
                    //               {
                    //                 default: () => [
                    //                   h('img', {
                    //                     alt: 'avatar',
                    //                     src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
                    //                   })
                    //                 ]
                    //               }
                    //             )
                    //           ]
                    //         }
                    //       ),
                    //       container: table.bodyDomContainer
                    //     }
                    //   });

                    //   return {
                    //     rootContainer: container,
                    //     renderDefault: false
                    //   };
                    // }
                }
            ],
            defaultHeaderRowHeight: 40,
            defaultRowHeight: 80,
            customConfig: {
                createReactContainer: true
            }
        }
        return options
    }
    getData() {
        let config = this.config
        let data = config.data
        if (data == null) {
            data = []
            config.data = data
        }
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
    loadColumns() {
        let columns = this.getColumns()
        let instance = this.getInstance()
        instance.updateColumns(columns)
    }
    async loadData(loadConfig?: any) {
        return new Promise(async (resolve, reject) => {//
            try {
                await this.runBefore({ method: 'loadData' })
                let data = this.getData()//
                let instance = this.getInstance()
                let _data1 = data.map(item => {
                    return customRef((tra, tri) => {
                        return {
                            get() {
                                tra()
                                return item
                            },
                            set() {
                                tri()
                            }
                        }
                    }).value
                })
                instance.setRecords(_data1)//
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
            throw new Error('instance is null')
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
        let instance = this.getInstance()
        this.loadData().then(() => {
            let _d = instance.records
            let last = _d.length - 1//
            instance.scrollToRow(last)//////
        })
    }
    async addRow(row: any) {
        await this.getRunBefore({ method: "addRow" })
        let data = this.getData()
        data.push(row)
        await this.getRunAfter({ method: "addRow" })//
    }
}