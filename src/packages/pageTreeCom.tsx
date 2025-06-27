import { computed, defineComponent } from 'vue'
import { Form } from './form'

export default defineComponent({
  name: 'pageTreeCom',
  props: {
    formIns: {},
  },
  setup(props, ctx) {
    let fIns: Form = props.formIns as any
    let fn = (nodeArr) => {
      return nodeArr.map((node) => {
        if (typeof node == 'string') {
          return
        }
        if (node == null) {
          return
        }
        let columns = node.columns || []
        let list = node.list || []
        let rows = node.rows || []
        let _children = null
        if (Array.isArray(columns) && columns.length > 0) {
          _children = fn(columns)
        } else if (Array.isArray(list) && list.length > 0) {
          _children = fn(list)
        } else if (Array.isArray(rows) && rows.length > 0) {
          _children = fn(rows)
        }
        _children = _children || []
        _children = _children.filter((e) => e != null)
        let _node = {
          ...node,
          children: _children,
        }
        return _node
      })
    }
    let treeData = computed(() => {
      let state = fIns.state.store
      let _v = fn(state)
      return _v
    })
    return () => (
      <div>
        <erTable
          isTree={true}
          treeConfig={{
            id: 'id',
            parentId: 'pid', //
          }}
          data={treeData.value} //
          showCheckboxColumn={false}
          showRowSeriesNumber={false} //
          columns={[
            {
              field: 'id',
              title: 'id',
              width: 100,
              type: 'string',
              tree: true, //
            },
            {
              field: 'type',
              title: '类型', //
              width: 100,
              type: 'string',
            },
          ]}
        ></erTable>
      </div>
    )
  },
})
