import { defineComponent, inject } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { TableFlow } from './logic/tableFlow'

export default defineComponent({
  name: 'ERNode',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const flow: TableFlow = inject('flowIns', null)

    const isForeignKey = (fieldName: string): boolean => {
      return (
        props.data.foreignKeys?.some(
          (fk) =>
            fk.fromTable === props.data.tableId && fk.fromField === fieldName,
        ) ?? false
      )
    }

    const handleAddField = () => {
      // console.log('点击了新增字段按钮', props.data.tableId)
      // 可以 emit 或直接调用 flow 方法
      // flow?.addField?.(props.data.tableId)
      flow.addField({
        tableName: props.data.tableName, //
      })
    }

    return () => (
      <div class="bg-white border border-gray-300 rounded-md shadow-md w-60">
        {/* 表头 */}
        <div class="py-1 font-bold text-center text-blue-800 bg-blue-100 rounded-t">
          {props.data.tableName}
        </div>

        {/* 字段列表 */}
        <ul class="px-2 py-1 space-y-1 text-sm overflow-hidden">
          {flow.getColumnsInNode(props).map((
            field, //
          ) => (
            <li
              onClick={(e) =>
                flow.onFieldClick({
                  event: e,
                  field,
                  data: props.data,
                })
              }
              onContextmenu={(e) =>
                flow.onFieldContextClick({
                  event: e,
                  field,
                  data: props.data,
                })
              }
              key={field.field}
              class="relative flex items-center px-2 py-1 bg-white rounded hover:bg-gray-100"
            >
              <Handle
                type="target"
                id={`field-${field.field}`}
                position={Position.Left}
                style={flow.getHandleStyle()}
                class="absolute left-0 w-4 h-4 -translate-y-1/2 bg-green-500 border border-white rounded-full top-1/2"
              />

              {/* 图标 */}
              {field.isPrimary ? (
                <span class="mr-1 text-red-500">🔑</span>
              ) : isForeignKey(field.field) ? (
                <span class="mr-1 text-green-500">🔗</span>
              ) : null}

              <span class="flex-1 flex-wrap-reverse">{field.field}</span>
              <span class="text-xs flex-none text-gray-400 ">{field.type}</span>

              <Handle
                type="source"
                style={flow.getHandleStyle()}
                id={`field-${field.field}`}
                position={Position.Right}
                class="absolute right-0 w-4 h-4 -translate-y-1/2 bg-blue-500 border border-white rounded-full top-1/2"
              />
            </li>
          ))}

          {/* ➕ 新增按钮 */}
          <li
            class="relative flex items-center px-2 py-1 bg-white rounded hover:bg-gray-100 cursor-pointer"
            onClick={handleAddField}
          >
            <span class="flex-1 text-gray-500">➕ 添加字段</span>
          </li>
        </ul>
      </div>
    )
  },
}) //
