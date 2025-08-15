import { PageDesignItem } from '@ER/pageItem'
import _ from 'lodash'
import { reactive } from 'vue'
export const getDataSourceConfig = (item: PageDesignItem, _config = {}) => {
  let _item = {
    ..._config,
    field: 'dataSource',
    label: '表格数据源', //
    // tabTitle: titles[0],
    type: 'sform', //
    options: {
      itemSpan: 12,
      items: [
        {
          field: 'dataSourceType',
          label: '数据类型', //
          type: 'select', //
          options: {
            options: [
              {
                label: '普通类型',
                value: 'normal', //
              },
              {
                label: '函数类型',
                value: 'function',
              },
              {
                label: '接口类型',
                value: 'api', //
              }, //
              {
                label: '视图类型',
                value: 'view', //
              },
              {
                label: 'SQL类型',
                value: 'sql', //
              },
            ],
          },
        },
        {
          field: 'dataSource',
          label: '数据源',
          type: 'code', //
        },
        {
          field: 'viewTable',
          label: '视图表',
          type: 'select', //
          options: {
            optionsField: 'sysViewTable', //
          },
        },
      ],
    },
  }
  return [_item] //
}
export const getDesignTableConfig = (item: PageDesignItem) => {
  let _this = item
  let _config = _this.getOptions()
  // _config = _.cloneDeep(_config) //
  _config = reactive(_.cloneDeep(_config)) //
  let titles = ['基本信息', '高级配置']
  let fields = [
    'tableName',
    'treeConfig',
    'showCheckboxColumn',
    'showRowSeriesNumber',
    'contextItems',
    'detailTableConfig',
    'keyColumn',
    'keyCodeColumn', //
    'onCurRowChange', //
    'rowHeight', //
    'dataSource',
    'mainRelateKey',
    'relateKey', //
    'dragConfig',
    'realTableName', //
    'platform',
    'relateConfig',
    'dataSource', //
  ] //
  /* 
    'initGetData',
    'listenChanged', //
  */
  let tName = _this.getTableName() //
  let mainDesign = _this.form //
  // debugger //
  let mN = mainDesign?.getRealTableName() || null
  let fd = []
  if (mN != tName) {
  }
  let _obj = reactive(_.pick(_config, fields)) //
  let _fConfig = {
    itemSpan: 12, //
    data: _obj, //
    height: 700,
    width: 800, //
    isTabForm: true,
    tableName: _this.form.getTableName(), //
    items: [
      {
        field: 'tableName',
        label: '表名',
        tabTitle: titles[0],
        type: 'string',
        disabled: true, //
      }, //
      ...getDataSourceConfig(item, { tabTitle: titles[0] }),
      {
        field: 'realTableName',
        label: '实际表名',
        tabTitle: titles[0],
        type: 'string', //
      },
      {
        field: 'detailTableConfig',
        label: '详情表配置',
        tabTitle: titles[1],
        type: 'sform',
        options: {
          itemSpan: 12,
          items: [
            {
              field: 'tableName',
              label: '表名',
              type: 'select',
              itemChange: (config) => {
                // debugger //
                let form = config.form
                if (form) {
                  form.initColumnSelect() //
                }
              },
              options: {
                options: (config) => {
                  // return []
                  let page = config?.page
                  if (page == null) {
                    return []
                  }
                  let allNames = page.getAllEntityNames()
                  return allNames //
                }, //
              }, //
            },
            {
              field: 'relateKey',
              label: '当前关联字段',
              type: 'select', //
              options: {
                columnSelect: true,
                tableName: tName,
              },
            },
            {
              field: 'mainRelateKey',
              label: '主单据关联字段',
              type: 'select', //
              options: {
                columnSelect: true,
                tableName: (config) => {
                  // debugger //
                  // debugger //
                  let data = config.data
                  let tableName = data?.tableName || tName //
                  return tableName //
                }, //
              }, //
            },
          ],
        },
      },
      {
        field: 'treeConfig',
        label: '树形表格配置',
        type: 'sform',
        tabTitle: titles[0],
        disabled: false,
        options: {
          itemSpan: 12, //
          items: [
            {
              field: 'id',
              label: '树主键',
              type: 'string',
              options: {
                columnSelect: true,
                tableName: tName,
              },
            },
            {
              field: 'parentId',
              label: '父主键',
              type: 'string',
              options: {
                columnSelect: true,
                tableName: tName, //
              }, //
            },
            {
              field: 'rootId',
              label: '根节点',
              type: 'string', //
            },
            {
              field: 'expand',
              label: '默认展开',
              type: 'select',
              options: {
                options: [
                  {
                    label: '展开全部',
                    value: 'all',
                  },
                  {
                    label: '展开第一级',
                    value: 'first',
                  },
                  {
                    label: '展开第二级',
                    value: 'second',
                  },
                  {
                    label: '不展开',
                    value: 'none', //
                  },
                ],
              },
            },
            {
              field: 'autoColumnSize',
              label: '列适应',
              type: 'boolean',
              options: {},
            },
          ],
        },
      },
      {
        field: 'showCheckboxColumn',
        label: '是否显示复选框',
        tabTitle: titles[0],
        type: 'boolean',
      },
      {
        field: 'showRowSeriesNumber',
        tabTitle: titles[0],
        label: '是否显示行号',
        type: 'boolean',
      },
      {
        field: 'dragConfig',
        label: '拖拽配置',
        type: 'sform',
        tabTitle: titles[0],
        options: {
          itemSpan: 12,
          items: [
            {
              field: 'dragRowAfterFn',
              label: '拖拽行后回调',
              type: 'code',
              options: {
                //
                tableName: tName,
              },
            },
            {
              field: 'dragRowFn',
              label: '拖拽行回调',
              type: 'code',
              options: {
                //
                tableName: tName, //
              },
            },
            {
              field: 'enableDragRow',
              label: '是否启用行拖拽',
              type: 'boolean',
              options: {},
            },
            {
              field: 'enableDragCol',
              label: '是否启用列拖拽',
              type: 'boolean',
              options: {},
            },
            {
              field: 'enableResizeColumn',
              label: '是否启用列宽调整',
              type: 'boolean', //
              options: {},
            },
          ],
        },
      },
      {
        field: 'rowHeight',
        label: '行高',
        type: 'number',
        options: {
          min: 10, //
        },
        tabTitle: titles[0], //
      },
      ...fd, //
      {
        field: 'keyColumn',
        tabTitle: titles[0],
        label: '主键字段',
        type: 'string',
        options: {
          columnSelect: true,
          tableName: tName, //
        },
      },
      {
        field: 'keyCodeColumn',
        label: '单据字段',
        tabTitle: titles[0],
        type: 'string',
        options: {
          columnSelect: true,
          tableName: tName, //
        },
      },
      {
        field: 'platform',
        label: '页面平台', //
        type: 'select', //
        options: {
          options: [
            {
              label: 'PC端',
              value: 'pc',
            },
            {
              label: '移动端',
              value: 'mobile',
            }, //
          ],
        },
        tabTitle: titles[0], //
      },
      {
        field: 'relateConfig',
        label: '类型表配置',
        type: 'sform',
        tabTitle: titles[1],
        options: {
          itemSpan: 12,
          items: [
            {
              field: 'initGetData',
              label: '首次加载数据',
              type: 'boolean',
              tabTitle: titles[0], //
            },
            {
              field: 'listenChanged', //监听
              label: '监听表格更新',
              type: 'boolean',
              tabTitle: titles[0], //
            },
            {
              field: 'curRowChange',
              label: '行更新获取数据',
              type: 'boolean', //
              tabTitle: titles[0],
            },
            {
              field: 'relateOneRow',
              label: '关联一行',
              type: 'boolean',
              tabTitle: titles[0], //
            },
            {
              field: 'relateKey',
              label: '关联字段',
              type: 'string',
              tabTitle: titles[0],
              options: {
                columnSelect: true,
                tableName: tName, //
              },
            },
            {
              field: 'mainRelateKey',
              label: '主表关联字段',
              type: 'string',
              tabTitle: titles[0],
              options: {
                columnSelect: true,
                tableName: mN, // //
                allowCreate: true,
              },
            },
            {
              field: 'mainRelateSearchKey',
              label: '主表关联搜索字段',
              type: 'string',
              tabTitle: titles[0],
              options: {
                //
              },
            },
          ],
        },
      },
      // {
      //   field: 'initGetData',
      //   label: '首次加载数据',
      //   type: 'boolean',
      //   tabTitle: titles[0], //
      // },
      // {
      //   field: 'listenChanged', //监听
      //   label: '监听表格更新',
      //   type: 'boolean',
      //   tabTitle: titles[0], //
      // },
      {
        field: 'onCurRowChange',
        label: '当前行变化事件',
        type: 'code', //
        tabTitle: titles[1], //
      },
      {
        field: 'contextItems',
        label: '右键菜单配置', //
        type: 'stable',
        tabTitle: titles[1], //
        span: 24, //
        options: {
          showTable: true,
          tableState: 'edit',
          columns: [
            {
              field: 'label',
              title: '菜单名称',
              type: 'string',
              editType: 'string',
            },
            {
              field: 'fn',
              title: '菜单事件',
              type: 'string',
              editType: 'code', //
            },
          ],
        }, //
      },
    ],
  }
  return _fConfig
}
