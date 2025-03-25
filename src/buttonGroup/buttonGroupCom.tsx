import { itemGroup } from "@/buttonGroup/buttonGroup";
import { defineComponent } from "vue";
import tabCom from "@/buttonGroup/tabCom";
import { ElButton } from "element-plus";
import { Button } from "./button";
export default defineComponent({
    name: "buttonGroupCom",
    components: {
        tabCom
    },
    props: {
        items: {
            default: () => []
        },
        _class: {
            type: Function
        },
        parent: {
            type: Object
        }
    },
    setup(props, { attrs, slots, emit }) {
        let group = new itemGroup(props, props._class as any);
        const ns = group.hooks.useNamespace('buttonGroupCom')
        const runBtnFn = (el: Button) => {
            console.log('我执行了')//
            el.runFn({
                parent: props.parent,
                button: el
            })
        }
        return () => {
            let com = <div>
                <tabCom {...group.getTabProps()} height={25} v-slots={{
                    item: (el: Button) => {
                        let btn = el.config.button
                        return <ElButton onClick={() => { runBtnFn(btn) }} class={ns.b()}>{btn.getLabel()}</ElButton>
                    }
                }}></tabCom>
            </div>
            return com
        };
    },
});