<template>
  <vue-list-table :options="option" ref="tableRef" />
</template>


<script setup>
import { ref, h } from 'vue'
import  {VTable} from '@visactor/vue-vtable'
const tableRef = ref(null)
const option = ref({
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
          vue: {
            element: null,
            container: table.headerDomContainer
          }
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
          vue: {
            element: h('div',{style:{background:"red"},},[value]),
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
      customLayout: args => {
        const { table, row, col, rect, value } = args;
        const { height, width } = rect ?? table.getCellRect(col, row);

        const container = new VTable.CustomLayout.Group({
          height,
          width,
          display: 'flex',
          alignItems: 'center',
          vue: {
            element: h(
              'div',
              { author: 'Socrates', content: value, datetime: '1 hour' },
              {
                actions: () => [
                  h('span', { key: 'heart', style: { cursor: 'pointer' } }, [h('span', 'Like')]),
                  h('span', { key: 'star', style: { cursor: 'pointer' } }, [h('span', 'Collect')]),
                  h('span', { key: 'reply', style: { cursor: 'pointer' } }, [h('span', 'Reply')])
                ],
                avatar: () => [
                  h(
                    'div',
                    {},
                    {
                      default: () => [
                        h('img', {
                          alt: 'avatar',
                          src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
                        })
                      ]
                    }
                  )
                ]
              }
            ),
            container: table.bodyDomContainer
          }
        });

        return {
          rootContainer: container,
          renderDefault: false
        };
      }
    }
  ],
  defaultHeaderRowHeight: 40,
  defaultRowHeight: 80,
  customConfig: { 
    createReactContainer: true
  }
}
)
</script>