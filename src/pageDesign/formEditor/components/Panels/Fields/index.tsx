import hooks from '@ER/hooks'
import utils from '@ER/utils'
import { dragGableWrap } from '@ER/formEditor/components/Layout/DragGable'
import { inject, ref, reactive, nextTick, defineComponent } from 'vue'
import _ from 'lodash'
import Icon from '@ER/icon'
import ControlInsertionPlugin from '../../Layout/ControlInsertionPlugin'
import { nanoid } from 'nanoid'
import { ElAside } from 'element-plus'
import {menuProps} from 'element-plus'

export default defineComponent({
  name: 'Fields',
  components: {
    dragGableWrap,
  },
  inheritAttrs: false,
  customOptions: {},
  props: {
    type: {
      type: Number,
      default: 1
    },
    visible: {}
  },
  setup(props) {
    const ER: any = inject('Everright')
    const ns = hooks.useNamespace('Fields')
    const {
      t
    } = hooks.useI18n()
    const {
      state,
      setSelection
    } = hooks.useTarget()
    const addStore = (element) => {
      //添加一个layout
      const newElement = reactive(ER.wrapElement(_.cloneDeep(element)))
      state.store.push(newElement)
      utils.addContext({ node: newElement, parent: state.store })
      nextTick(() => {
        
      })
    }
    const slots = {
      item: ({ element }) => {
        return (
          <li class={[ER.props.checkFieldsForNewBadge(element) ? ns.is('new') : '']} onClick={() => addStore(element)}>
            <Icon class={[ns.e('icon')]} icon={element.icon}></Icon>
            <span>{utils.fieldLabel(t, element)}</span>
          </li>
        )
      }
    }
    const handleClone = (element) => {
      // return wrapElement(element)
      return _.cloneDeep(element)
    }
    const handleMove = (evt, originalEvent) => {
      return true
    }
    let formIns: any = inject('formIns')
    let pluginName = formIns.getPluginName()
    let id = formIns.id
    const dragOptions = {
      [pluginName]: true,
      dataSource: 'block',
      direction: 'horizontal',
      scroll: false,
      plugins: [ControlInsertionPlugin(ER)]
    }
    return () => {
      return (
        <ElAside class={[ns.b()]} width={ER.props.fieldsPanelWidth}>
          <el-scrollbar>
            <el-menu
              default-openeds={ER.props.fieldsPanelDefaultOpeneds}>
              {ER.props.fieldsConfig.map((element, index) => {
                return (
                  <el-sub-menu
                    index={element.id}
                    v-slots={{
                      title() {
                        return t(`er.fields.${element.id}`)
                      },
                      default() {
                        return (
                          <dragGableWrap
                            class={[ns.e('dragContent')]}
                            list={element.list}
                            clone={handleClone}
                            tag="ul"
                            sort={false}
                            move={handleMove}
                            {...dragOptions}
                            group={
                              { name: `er-Canves-${id}`, pull: 'clone', put: false }
                            }
                            item-key="null"
                            v-slots={slots}
                          >
                          </dragGableWrap>
                        )
                      }
                    }}
                  >
                  </el-sub-menu>
                )
              })}
            </el-menu>
          </el-scrollbar>
        </ElAside>
      )
    }
  }
}
)