import { defineComponent, inject, provide } from "vue";
import menuCom from "./menuCom";
import { dragGableWrap } from "@ER/formEditor/components/Layout/DragGable";
import { MenuItem } from "./menuitem";
import formCom from "@ER/formCom";
import { Form } from "@ER/form";
import hooks from '@ER/hooks'
import utils from '@ER/utils'
import { ref, reactive, nextTick, } from 'vue'
import _ from 'lodash'
import Icon from '@ER/icon'
import ControlInsertionPlugin from '@ER/formEditor/components/Layout/ControlInsertionPlugin'
import { nanoid } from 'nanoid'
import { ElAside } from 'element-plus'
export default defineComponent({
    name: "fieldCom",
    components: {
        menuCom,
        dragGableWrap
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
        let formIns: Form = inject('formIns')
        let pluginName = formIns.getPluginName()
        let id = formIns.id
        const dragOptions = {
            [pluginName]: true,
            dataSource: 'block',
            direction: 'horizontal',
            scroll: false,
            plugins: [ControlInsertionPlugin(ER)]
        }
        const registerMenu = (el) => {
            formIns
        }
        return () => {
            let com = <ElAside class={[ns.b()]} width={ER.props.fieldsPanelWidth}>
                <el-scrollbar>
                    <menuCom ref={registerMenu} defaultOpeneds={ER.props.fieldsPanelDefaultOpeneds} v-slots={{
                        subItemTitle: (item) => {
                            let config = item.config
                            let id = config.id
                            let value=t(`er.fields.${id}`)
                            return <span>{value}</span>
                        },
                        drag: (item) => {
                            let config = item.config
                            let list = config.list || []
                            let com1 = <dragGableWrap
                                class={[ns.e('dragContent')]}
                                list={list}
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
                            ></dragGableWrap>
                            return com1
                        }
                    }}></menuCom>
                </el-scrollbar>
            </ElAside>
            return com
        }
    },
});