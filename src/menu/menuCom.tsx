import { defineComponent, provide } from "vue";
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { Menu } from "./menu";
import { fieldsConfig } from "@ER/formEditor/componentsConfig";
import { MenuItem } from "./menuitem";
import { } from 'vue'
import { menuProps } from 'element-plus'
const subMenu = defineComponent({
    name: "subMenu",
    components: {

    },
    props: {
        item: {},
        ...menuProps
    },
    setup(props, { expose, slots, emit, attrs }) {
        const item: MenuItem = props.item as any
        return () => {
            const _config = item?.getProps()
            let menuitems = item?.menuitems || []
            let items = menuitems.map(item => {
                let dragSlot = slots.drag
                if (dragSlot != null) {
                    return dragSlot(item)
                }
                return <subMenu item={item} v-slots={slots}></subMenu>//
            })
            return <ElSubMenu {..._config} v-slots={
                {
                    default: () => {
                        if (items.length == 0) {
                            if (slots.drag != null) {
                                return slots.drag(item)
                            }
                            return <ElMenuItem {..._config} v-slots={{
                                title: () => {
                                    let itemSlots = slots.itemTitle
                                    if (itemSlots != null) {
                                        return itemSlots(item)
                                    } else {
                                        return <div></div>
                                    }
                                },
                                default: () => {
                                    let itemSlots = slots.item
                                    if (itemSlots != null) {
                                        return itemSlots(item)
                                    } else {
                                        return <div></div>
                                    }
                                }
                            }}></ElMenuItem>
                        } else {
                            return items//
                        }//
                    },
                    title: () => {//
                        let itemSlots = slots.subItemTitle
                        if (itemSlots != null) {
                            return itemSlots(item)
                        } else {
                            return <div></div>
                        }
                    }
                }
            }>
                {items}
            </ElSubMenu>
        }
    }
})
export default defineComponent({
    components: {
        subMenu
    },
    props: {
        ...menuProps,
        defaultOpeneds: {
            
        }
    },
    setup(props, { expose, slots }) {
        const menuIns = new Menu({ children: JSON.parse(JSON.stringify(fieldsConfig)) })
        provide('menuIns', menuIns)
        expose(menuIns)//
        return () => {
            const children = menuIns.menuitems
            const items = children.map(item => {
                return <subMenu item={item} v-slots={slots}></subMenu>
            })
            let com = <ElMenu {...props}>
                {items}
            </ElMenu>
            return com
        }
    }
})

