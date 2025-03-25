import { defineComponent, inject, watch } from "vue";
import { Bread } from "./bread";
import { ElBreadcrumb, ElBreadcrumbItem, breadcrumbProps } from 'element-plus'
export default defineComponent({
    name: "BreakCom",
    props: {
        ...breadcrumbProps, itemClick: {
            type: Function,
            default: () => { }
        }, items: {
            type: Array,
            default: () => []
        }
    },
    setup(props, { emit, attrs, slots }) {
        const itemClick = props.itemClick
        const breadIns = new Bread(props)
        watch(() => [props.items, props.items?.length], ([newValue, length]) => {
            breadIns.setBreadItems(newValue)////
        })
        return () => {
            const itemArr = breadIns.breaditems.map((item) => {
                let value = item.getBindValue()
                let _slots = {
                    default: () => {
                        let oldDefault = slots.default
                        if (oldDefault != null) {
                            return oldDefault(item)
                        }
                        return <div></div>
                    }
                }
                let com = <ElBreadcrumbItem onClick={() => { itemClick && itemClick(item) }} v-slots={_slots} {...value}></ElBreadcrumbItem>
                return com
            })
            let com = <ElBreadcrumb {...props}>
                {itemArr}
            </ElBreadcrumb>
            return com
        };
    },
});


