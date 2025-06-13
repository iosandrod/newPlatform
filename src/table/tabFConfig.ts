import { PageDesignItem } from '@ER/pageItem'
import _ from 'lodash'
export const getDesignTableConfig = (item: PageDesignItem) => {
  let _this = item
  let _config = _this.getOptions()
  // _config = _.cloneDeep(_config) //
  _config = _.cloneDeep(_config) //
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
    'viewTableName',
    'mainRelateKey',
    'relateKey', //
    'dragConfig',
    'realTableName', //
    'platform',
    'relateConfig',
  ] //
  /* 
    'initGetData',
    'listenChanged', //
  */
  let tName = _this.getTableName()

  let mainDesign = _this.form //
  let mN = mainDesign?.getRealTableName() || null
  let fd = []
  if (mN != tName) {
    fd = [
      {
        field: 'mainRelateKey',
        label: '主单据关联字段',
        type: 'string',
        tabTitle: titles[0],
        options: {
          columnSelect: true,
          tableName: mN, //
        },
      },
      {
        field: 'relateKey',
        label: '当前关联字段',
        type: 'string',
        tabTitle: titles[0],
        options: {
          columnSelect: true,
          tableName: tName,
        },
      },
    ]
  }
  let _obj = _.pick(_config, fields)
  let _fConfig = {
    itemSpan: 12, //
    data: _obj, //
    height: 500,
    width: 800, //
    isTabForm: true,
    items: [
      {
        field: 'tableName',
        label: '表名',
        tabTitle: titles[0],
        type: 'string',
        disabled: true, //
      },
      {
        field: 'viewTableName',
        label: '视图表名',
        tabTitle: titles[0],
        type: 'string', //
      },
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
              field: 'relateKey',
              label: '当前关联字段',
              type: 'string',
              options: {
                columnSelect: true,
                tableName: tName,
              },
            },
            {
              field: 'mainRelateKey',
              label: '主单据关联字段',
              type: 'string', //
              options: {
                columnSelect: true,
                tableName: mN, //
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
            }, //
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
        label: '关联配置',
        type: 'sform',
        tabTitle: titles[0],
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
