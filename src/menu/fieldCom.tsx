import { defineComponent, inject, provide } from 'vue'
import menuCom from './menuCom'
import { dragGableWrap } from '@ER/formEditor/components/Layout/DragGable'
import { MenuItem } from './menuitem'
import formCom from '@ER/formCom'
import { Form } from '@ER/form'
import hooks from '@ER/hooks'
import utils from '@ER/utils'
import { ref, reactive, nextTick } from 'vue'
import _ from 'lodash'
import Icon from '@ER/icon'
import ControlInsertionPlugin from '@ER/formEditor/components/Layout/ControlInsertionPlugin'
import { nanoid } from 'nanoid'
import { ElAside } from 'element-plus'
import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
export default defineComponent({
  name: 'fieldCom',
  components: {
    menuCom,
    dragGableWrap,
    buttonGroupCom,
  },
  props: {
    buttons: {
      type: Array,
    },
  },
  setup(props) {
    const ER: any = inject('Everright')
    const ns = hooks.useNamespace('Fields')
    const { t } = hooks.useI18n()
    const { state, setSelection } = hooks.useTarget()
    let formIns: Form = inject('formIns')
    const addStore = (element) => {
      // debugger //
      //在根部进行控制
      let _el = _.cloneDeep(element)
      let newElement = reactive(ER.wrapElement(_el, true, true, true, true))
      let items = formIns.items //
      let hasItem = items.find((item) => {
        let f = item.getField()
        if (f != null && f == element.field) {
          return true
        }
      })
      if (hasItem) {
        formIns.getSystem().confirmErrorMessage('该字段已存在,请勿重复添加') //
        return
      }
      state.store.push(newElement) //
      utils.addContext({ node: newElement, parent: state.store, form: formIns })
    }
    const slots = {
      item: ({ element }) => {
        let t1 = utils.fieldLabel(t, element)
        if (t1 == '' || t1 == null) {
          t1 = element.label //
        }
        let fieldTitle = element.fieldTitle
        if (fieldTitle != null) {
          t1 = fieldTitle //
        }
        let _com = (
          <li class={[]} onClick={() => addStore(element)}>
            <Icon class={[ns.e('icon')]} icon={element.icon}></Icon>
            <span>{t1}</span>
          </li>
        )
        return _com
      },
    }
    const handleClone = (element) => {
      // return wrapElement(element)
      return _.cloneDeep(element)
    }
    const handleMove = (evt, originalEvent) => {
      return true
    }
    let pluginName = formIns.getPluginName()
    let id = formIns.id
    const dragOptions = {
      [pluginName]: true,
      dataSource: 'block',
      direction: 'horizontal',
      scroll: false,
      plugins: [ControlInsertionPlugin(ER)],
    }
    const registerMenu = (el) => {
      formIns.registerRef('fieldMenu', el) //
    }
    const fieldsConfig = formIns.getDesignFieldConfig() //
    let btng = props.buttons
    return () => {
      let btnCom = null
      if (Array.isArray(btng) && btng.length > 0) {
        btnCom = <ButtonGroupCom items={btng}></ButtonGroupCom> //
      }
      let com = (
        <ElAside class={[ns.b()]} width={ER.props.fieldsPanelWidth}>
          {btnCom}
          <div class="overflow-y-auto">
            <menuCom
              items={fieldsConfig}
              ref={registerMenu}
              defaultOpeneds={ER.config.fieldsPanelDefaultOpeneds}
              v-slots={{
                subItemTitle: (item) => {
                  let config = item.config //
                  let id = config.id
                  let value = t(`er.fields.${id}`)
                  return <span>{value}</span>
                },
                drag: (item) => {
                  let config = item.config
                  let list = config.children || config.list || [] //
                  let com1 = (
                    <dragGableWrap
                      class={[ns.e('dragContent')]}
                      list={list}
                      clone={handleClone}
                      tag="ul"
                      sort={false}
                      move={handleMove}
                      {...dragOptions}
                      group={{
                        name: `er-Canves-${id}`,
                        pull: 'clone',
                        put: false,
                      }}
                      item-key="null"
                      v-slots={slots}
                    ></dragGableWrap>
                  )
                  return (
                    <div style={{ maxHeight: '300px' }} class="overflow-auto ">
                      {com1}
                    </div>
                  )
                },
              }}
            ></menuCom>
          </div>
        </ElAside>
      )
      return com
    }
  },
})
