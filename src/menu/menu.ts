import { Base } from "@/base/base";
import { } from 'element-plus'
import { MenuItem } from "./menuitem";
export class Menu extends Base {
    config: any
    menuitems: MenuItem[] = []
    constructor(config) {
        super()
        this.config = config
        this.init()
    }
    init() {
        super.init()
        const config = this.config
        const children = config.children || []//
        this.setMenuItems(children)
    }
    setMenuItems(items) {
        this.menuitems.splice(0)
        for (const item of items) {
            this.addMenuItem(item)
        }
    }
    addMenuItem(itemConfig: any) {
        let item = new MenuItem(itemConfig, this)
        let menuitems = this.menuitems
        menuitems.push(item)// 
    }
    removeMenuItem(id: any) {

    }
}
