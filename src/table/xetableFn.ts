import _ from 'lodash'
import { getDCConfig, getDFConfig } from './colFConfig'
import { XeTable } from './xetable'
import { reactive } from 'vue'

export const initXeContextItems = (table: XeTable) => {
  let items = [
    {
      label: '复制',
      key: 'copy',
      visible: true,
      fn: () => {
        //
        let col = table.curContextCol
        let row = table.curContextRow
        let f = col?.getField()
        let v1 = null
        if (row == null) {
          v1 = f //
        } else {
          let _v = row?.[f]
          v1 = _v
        } //
        table.getSystem().copyValue(v1) //
      },
    },
    {
      label: '删除',
      key: 'delete',
      visible: () => {
        let isHeaderContext = table.isHeaderContext //
        if (isHeaderContext) {
          return false
        }
        return true
      },
    },
    {
      label: '固定设置',
      visible: () => {
        let isHeaderContext = table.isHeaderContext //
        if (!isHeaderContext) {
          return false
        }
        return true //
      },
      items: [
        {
          label: '右侧固定',
          key: 'rightFixed',
          visible: () => {
            let isHeaderContext = table.isHeaderContext //
            if (!isHeaderContext) {
              return false
            }
            return true
          },
          fn: () => {
            let curContext = table.curContextCol
            if (curContext) {
              let frozen = curContext.getIsFrozen()
              if (frozen == true) {
                curContext.setNoFrozen()
              } else {
                curContext.setFrozen('right')
              }
            }
          },
        },
        {
          label: '取消固定',
          key: 'noFixed',
          visible: () => {
            let isHeaderContext = table.isHeaderContext //
            if (!isHeaderContext) {
              return false
            }
            return true
          },
          fn: () => {
            let curContext = table.curContextCol
            if (curContext) {
              curContext.setNoFrozen()
            }
          },
        },
        {
          label: '左侧固定',
          key: 'leftFixed',
          visible: () => {
            let isHeaderContext = table.isHeaderContext //
            if (!isHeaderContext) {
              return false
            }
            return true
          },
          fn: () => {
            let curContext = table.curContextCol
            if (curContext) {
              let frozen = curContext.getIsFrozen()
              if (frozen == true) {
                curContext.setNoFrozen()
              } else {
                curContext.setFrozen('left') //
              }
            }
          },
        },
      ],
    },
    {
      label: '编辑',
      key: 'edit',
      disabled: () => {
        return false
      },
      visible: () => {
        let isHeaderContext = table.isHeaderContext //
        if (isHeaderContext) {
          return false
        }
        return true //
      },
      fn: async () => {
        let config = table.config
        let onCellCommand = config.onCellCommand
        if (typeof onCellCommand == 'function') {
          onCellCommand({
            command: 'edit',
            row: table.curContextRow, //
          }) //
        }
      },
    },
    {
      label: '全局查询',
      key: 'globalQuery',
      disabled: false, //
      visible: true,
      fn: () => {
        table.showGlobalSearch(true) //
      },
    },
    {
      label: '隐藏当前列',
      key: 'hideColumn',
      disabled: false, //
      visible: true,
      fn: () => {
        let curContextCol = table.curContextCol
        if (!curContextCol) {
          return //
        }
        let f = curContextCol.getField()
        // console.log(f, 'testF') //
        table.hiddenColumn(f) //
        //
      },
    },
    {
      label: '设计当前列', //
      key: 'designColumn',
      disabled: false, //
      visible: true,
      fn: async () => {
        let curContextCol = table.curContextCol
        let _config = curContextCol.config
        _config = reactive(_.cloneDeep(_config)) //
        let sys = table.getSystem()
        let mainD = table.getMainPageDesign() //
        let fConfig = getDFConfig(mainD, _config)
        let data1 = await sys.confirmForm(fConfig)
        let _dFn = table.config.onDesignColumn
        if (typeof _dFn == 'function') {
          _dFn(data1, curContextCol.config)
        } //
      },
    },
    {
      label: '设计表格列', //
      key: 'designAllColumns',
      disabled: false, //
      visible: true,
      fn: async () => {
        let system = table.getSystem()
        let originColumns = table.getColumns().map((col) => {
          return col.config
        }) //
        let tableName = table.getTableName()
        originColumns = _.cloneDeep(originColumns) //
        originColumns = originColumns.sort((c1, c2) => {
          let o1 = c1.order
          let o2 = c2.order
          return o1 - o2
        })
        let _config = getDCConfig(this, {
          data: originColumns,
          tableName: tableName,
          onRowDragEnd: (config) => {
            // debugger //
            let _table = config.table
            // console.log(config, 'testConfig') //
            let newRow = config.newRow
            let oldRow = config.oldRow //
            let _index = newRow._index
            let _index2 = oldRow._index
            let _data = _table.getData()
            let index1 = _data.findIndex((e) => e._index == _index)
            let index2 = _data.findIndex((e) => e._index == _index2)
            let data4 = _data.splice(index1, 1)
            _data.splice(index2, 0, data4[0]) //
            _data.forEach((e, i) => {
              e.order = Number(i) + 1 //
              e.rowState = 'change' //
            })
            // let fieldArr = _data.map((e) => e.field) //
            // console.log('fieldArr', fieldArr) //
          },
        })
        let _d: any = await system.confirmTable(_config) //
        table.onColumnsDesign(_d) //
      },
    },
    {
      label: '表格信息配置',
      key: 'refresh',
      disabled: false, //
      visible: true,
      fn: async (config) => {
        let _config = table.config
        let onTableDesign = _config.onTableDesign
        if (typeof onTableDesign == 'function') {
          await onTableDesign(config)
        }
      },
    },{
      label:"打印数据",
      fn:async (config)=>{
        const data=table.getData()
        console.log(data,'testData')//
      }
    },
    {
      label: '同步列',
      key: 'syncRealColumns',
      disabled: false, //
      visible: true,
      fn: async (config) => {
        let sys = table.getSystem()
        let mainEn = table.getMainPageDesign()
        let tableName = mainEn.getRealTableName()
        let _tableName = table.getTableName()
        if (tableName != _tableName) {
          let _columns = await table.getHttp().find('columns', {
            tableName: _tableName,
          })
          let _columns1 = table.getFlatColumns().map((col) => col.config)
          _columns1.forEach((col) => {
            let f = col.field
            let _col = _columns.find((c) => c.field == f)
            if (_col) {
              col.title = _col.title
            }
          })
          let addCols = _columns.filter((col) => {
            return _columns1.find((c) => c.field == col.field) == null
          }) //
          if (addCols.length > 0) {
            let _config = mainEn.getTableConfig(_tableName)
            // console.log(_config,'testConfig')//
            let columns = _config?.columns || []
            columns.push(...addCols) //
          }
          mainEn.saveTableDesign() //
          return
        }
        await sys.syncRealColumns({
          //
          tableName: table.getTableName(),
          columns: table.getFlatColumns().map((col) => col?.config || col), ////
        })
      }, //
    },
  ]
  let contextItems = table.config.contextItems
  if (Array.isArray(contextItems) && contextItems.length > 0) {
    items = [...items, ...contextItems] //
  }
  table.contextItems = items
}

/* 
 t_BomEntry;
 t_Bom;
 t_BomHead;
 t_ProductBom;
 t_ProductModel;
t_ProductModelEntry;
 t_ProductModelBom;

*/
