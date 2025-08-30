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
        let field = curContextCol.getField()
        //当前编辑字段
        mainD.currentDField = field
        mainD.currentDTableName = table.getTableName() //
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
        let _config = getDCConfig(table, {
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
    },
    {
      label: '打印数据',
      fn: async (config) => {
        const data = table.getData()
        // console.log(data, 'testData') //
        let data1 //
        let tableName = table.getTableName()
        let sql = `SELECT * FROM ss_grid_bs INNER JOIN ss_grid_bh ON ss_grid_bs.grid_id =ss_grid_bh.grid_id WHERE ss_grid_bs.grid_id LIKE 'av_${tableName}'` //
        let _d = await table.getHttp().runSql(sql) //
        console.log(_d, 'testData1') //
      },
    },
    {
      label: '同步编辑',
      fn: async () => {
        let tableName = table.getTableName()
        let editItems = [] //
      }, //
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
              col.hidden = _col.hidden //
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

/* 
SELECT *FROM "columns" WHERE "tableName"='ss_table_column';
COMMENT ON COLUMN ss_table_column.column_id IS '列ID';
COMMENT ON COLUMN ss_table_column.is_primary_key IS '是否主键';
COMMENT ON COLUMN ss_table_column.table_id IS '所属表ID';
COMMENT ON COLUMN ss_table_column.data_type IS '数据类型';
COMMENT ON COLUMN ss_table_column.is_unique IS '是否唯一';
COMMENT ON COLUMN ss_table_column.data_precision IS '数据精度';
COMMENT ON COLUMN ss_table_column.data_length IS '数据长度';
COMMENT ON COLUMN ss_table_column.table_column_rmk4 IS '备注4';
COMMENT ON COLUMN ss_table_column.crt_user IS '创建人';
COMMENT ON COLUMN ss_table_column.upd_time IS '更新时间';
COMMENT ON COLUMN ss_table_column.upd_user IS '更新人';
COMMENT ON COLUMN ss_table_column.upd_user_no IS '更新人编号';
COMMENT ON COLUMN ss_table_column.upd_user_name IS '更新人姓名';
COMMENT ON COLUMN ss_table_column.crt_host IS '创建主机';
COMMENT ON COLUMN ss_table_column.ref_field_name IS '引用字段名称';
COMMENT ON COLUMN ss_table_column.upd_host IS '更新主机';
COMMENT ON COLUMN ss_table_column.column_seq IS '列顺序';
COMMENT ON COLUMN ss_table_column.crt_user_no IS '创建人编号';
COMMENT ON COLUMN ss_table_column.is_not_copy IS '是否不可复制';
COMMENT ON COLUMN ss_table_column.table_column_rmk3 IS '备注3';
COMMENT ON COLUMN ss_table_column.ref_field IS '引用字段';
COMMENT ON COLUMN ss_table_column.table_column_rmk1 IS '备注1';
COMMENT ON COLUMN ss_table_column.value_in IS '输入值范围';
COMMENT ON COLUMN ss_table_column.value_default IS '默认值';
COMMENT ON COLUMN ss_table_column.not_null IS '是否非空';
COMMENT ON COLUMN ss_table_column.value_min IS '最小值';
COMMENT ON COLUMN ss_table_column.value_max IS '最大值';
COMMENT ON COLUMN ss_table_column.crt_time IS '创建时间';
COMMENT ON COLUMN ss_table_column.ref_table IS '引用表';
COMMENT ON COLUMN ss_table_column.table_column_rmk2 IS '备注2';
COMMENT ON COLUMN ss_table_column.crt_user_name IS '创建人姓名';

 */
