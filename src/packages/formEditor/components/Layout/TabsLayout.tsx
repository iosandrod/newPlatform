import { defineComponent, resolveComponent, watch, useAttrs, inject } from 'vue'
import Selection from '@ER/formEditor/components/Selection/selectElement'
import LayoutDragGable from './DragGable'
import hooks from '@ER/hooks'
export default defineComponent({
  name: 'TabsLayout',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: Object,
    parent: Array,
  },
  setup(props) {
    const ns = hooks.useNamespace('TabsLayout')
    if (!props.data.options.defaultValue) {
      // eslint-disable-next-line vue/no-setup-props-destructure
      props.data.options.defaultValue = props.data.columns[0].id
    }
    let formIns: any = inject('formIns')
    let pluginName = formIns.getPluginName()
    let opt = {
      [pluginName]: true,
    }
    return () => {
      return (
        //@ts-ignore
        <Selection {...useAttrs()} data={props.data} parent={props.parent} hasCopy hasDel hasDrag hasWidthScale>
          <el-tabs class={[ns.b(), 'h-full']} vModel={props.data.options.defaultValue} type={props.data.options.type} tabPosition={props.data.options.tabPosition}>
            {props.data.columns.map((element, index0) => {
              //@ts-ignore
              return (
                //@ts-ignore
                <Selection class={[ns.e('area'), 'h-full']} tag="el-tab-pane" label={element.label} name={element.id} data={element} parent={props.data}>
                  <LayoutDragGable class="h-full" data-layout-type={'tabs-col'} data={element.list} {...opt} parent={element} />
                </Selection>
              )
            })}
          </el-tabs>
        </Selection>
      )
    }
  },
})
