import {
  defineComponent,
  resolveComponent,
  watch,
  useAttrs,
  inject,
  unref,
  onMounted,
} from 'vue'
import Selection from '@ER/formEditor/components/Selection/selectElement'
import LayoutDragGable from './DragGable'
import hooks from '@ER/hooks'
import { nextTick } from 'vue' //
export default defineComponent({
  name: 'TabsLayout',
  inheritAttrs: false,
  customOptions: {},
  components: {},
  props: {
    data: Object,
    parent: Array,
  },
  setup(props) {
    const ns = hooks.useNamespace('TabsLayout') //
    if (!props.data.options.defaultValue) {
      //默认值
      props.data.options.defaultValue = props.data.columns[0].id
    }
    let formIns: any = inject('formIns')
    let pluginName = formIns.getPluginName()
    let opt = {
      [pluginName]: true,
    } //
    let refDiv = {}
    const { isEditModel } = hooks.useTarget()
    let changeVisible = () => {
      let defaultValue = props.data.options.defaultValue
      Object.entries(refDiv).forEach(([key, value]) => {
        let _value: HTMLDivElement = value as any
        if (_value != null) {
          if (key == defaultValue) {
            _value.style.display = 'block'
          } else {
            _value.style.display = 'none' //
          }
        }
        // nextTick(() => {
        // })
      })
    }
    onMounted(() => {
      changeVisible()
    })
    watch(
      () => [props.data.options.defaultValue, props?.data?.columns?.length], //
      (newVal) => {
        setTimeout(() => {
          //
          changeVisible() //
        }, 10)
      },
    )
    return () => {
      let _class = []
      if (!unref(isEditModel)) {
        _class.push('flex flex-col')
      }
      return (
        //@ts-ignore
        <Selection
          {...useAttrs()}
          data={props.data}
          parent={props.parent}
          hasCopy
          hasDel
          hasDrag
          hasWidthScale
        >
          <div class="h-full w-full flex flex-col">
            <el-tabs
              class={[ns.b(), 'h-35']}
              vModel={props.data.options.defaultValue}
              type={props.data.options.type}
              tabPosition={props.data.options.tabPosition}
            >
              {props.data.columns.map((element, index0) => {
                let com = (
                  <el-tab-pane
                    v-slots={{
                      label: (item) => {
                        let label = element.label || '选项'
                        return (
                          <div class="h-35 px-4 py-2 border-x border-t border-gray-300 rounded-t-md text-gray-700 hover:bg-gray-100 flex justify-center items-center">
                            <div>{label}</div>
                          </div>
                        )
                      },
                    }}
                    // label={element.label}
                    name={element.id}
                  ></el-tab-pane>
                )
                return com //
              })}
            </el-tabs>
            <div class="flex-1 w-full  flex">
              {props.data.columns.map((element, index0) => {
                let com = (
                  //@ts-ignore
                  <div
                    class=" flex-1 h-full overflow-hidden" //
                    ref={(el) => {
                      let id = element.id
                      refDiv[id] = el
                      // console.log(el, 'testElement') //
                    }}
                  >
                    <Selection
                      class={[ns.e('area'), 'h-full']}
                      tag="div"
                      label={element.label}
                      name={element.id}
                      data={element}
                      v-slots={{
                        label: (item) => {
                          let label = element.label || '选项'
                          return (
                            //
                            <div class="h-30 flex items-center">
                              <div>{label}</div>
                            </div>
                          )
                        }, //
                      }}
                      _slots={['label']}
                      parent={props.data}
                    >
                      <LayoutDragGable
                        class={['h-full', ..._class]}
                        data-layout-type={'tabs-col'}
                        data={element.list}
                        {...opt}
                        parent={element}
                      />
                    </Selection>
                  </div>
                )
                return com //
              })}
            </div>
          </div>
        </Selection>
      )
    }
  },
})
