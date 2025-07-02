// // 文件名：ERNode.tsx

// import { defineComponent } from 'vue'
// import { Handle, Position } from '@vue-flow/core'

// export default defineComponent({
//   name: 'ERNode',
//   props: {
//     data: {
//       type: Object, //
//       required: true,
//     },
//   },
//   setup(props) {
//     return () => {
//       let com = (
//         <div class="bg-white border border-gray-300 rounded-md shadow-md w-60">
//           {/* 表头 */}
//           <div class="py-1 font-bold text-center text-blue-800 bg-blue-100 rounded-t">
//             {props.data.label}
//           </div>

//           {/* 字段列表 */}
//           <ul class="px-2 py-1 space-y-1 text-sm">
//             {props.data.columns.map((field) => (
//               <li
//                 key={field.field}
//                 class="relative flex items-center px-2 py-1 bg-white rounded hover:bg-gray-100"
//               >
//                 {/* 左侧 Handle */}
//                 <Handle
//                   type="target"
//                   id={`field-${field.field}`}
//                   position={Position.Left}
//                   class="absolute left-0 w-4 h-4 -translate-y-1/2 bg-green-500 border border-white rounded-full top-1/2"
//                 />

//                 {/* 图标 */}
//                 {field.isPrimary ? (
//                   <span class="mr-1 text-red-500">🔑</span>
//                 ) : field.isForeign ? (
//                   <span class="mr-1 text-green-500">🔗</span>
//                 ) : null}

//                 {/* 字段名 + 类型 */}
//                 <span class="flex-1">{field.field}</span>
//                 <span class="text-xs text-gray-400">{field.type}</span>

//                 {/* 右侧 Handle */}
//                 <Handle
//                   type="source"
//                   id={`field-${field.field}`}
//                   position={Position.Right}
//                   class="absolute right-0 w-4 h-4 -translate-y-1/2 bg-blue-500 border border-white rounded-full top-1/2"
//                 />
//               </li>
//             ))}
//           </ul>
//         </div>
//       )
//       return com //
//     }
//   },
// })

import { defineComponent, inject } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { TableFlow } from './logic/tableFlow'

type Field = {
  name: string
  type: string
  field: string //
  isPrimary?: boolean
}

type ForeignKey = {
  fromTable: string
  fromField: string
  toTable: string
  toField: string
}

export default defineComponent({
  name: 'ERNode',
  props: {
    data: {
      type: Object, //
      required: true,
    },
  },
  setup(props) {
    console.log('ERNode props', props) //
    let flow: TableFlow = inject('flowIns', null) //
    const isForeignKey = (fieldName: string): boolean => {
      return (
        props.data.foreignKeys?.some(
          (fk) =>
            fk.fromTable === props.data.tableId && fk.fromField === fieldName,
        ) ?? false
      )
    }

    return () => (
      <div class="bg-white border border-gray-300 rounded-md shadow-md w-60">
        {/* 表头 */}
        <div class="py-1 font-bold text-center text-blue-800 bg-blue-100 rounded-t">
          {props.data.tableName}
        </div>

        {/* 字段列表 */}
        <ul class="px-2 py-1 space-y-1 text-sm">
          {props.data.data.columns.map((field) => (
            <li
              key={field.field}
              class="relative flex items-center px-2 py-1 bg-white rounded hover:bg-gray-100"
            >
              <Handle
                type="target"
                id={`field-${field.field}`}
                position={Position.Left}
                style={flow.getHandleStyle()} //
                class="absolute left-0 w-4 h-4 -translate-y-1/2 bg-green-500 border border-white rounded-full top-1/2"
              />

              {/* 图标 */}
              {field.isPrimary ? (
                <span class="mr-1 text-red-500">🔑</span>
              ) : isForeignKey(field.field) ? (
                <span class="mr-1 text-green-500">🔗</span>
              ) : null}

              <span class="flex-1">{field.field}</span>
              <span class="text-xs text-gray-400">{field.type}</span>

              <Handle
                type="source"
                style={flow.getHandleStyle()} //
                id={`field-${field.field}`}
                position={Position.Right}
                class="absolute right-0 w-4 h-4 -translate-y-1/2 bg-blue-500 border border-white rounded-full top-1/2"
              />
            </li>
          ))}
        </ul>
      </div>
    )
  },
})
