import { Base } from "@ER/base"
import { Menu } from "./menu"

export class MenuItem extends Base {
    config: any
    menu: Menu
    menuitems: MenuItem[] = []
    constructor(config, menu: any) {
        super()
        this.config = config
        this.menu = menu
        this.init()
    }
    init() {
        super.init()
    }
    getProps() {
        let id = this.id
        let config = this.config
        let _id = config.id
        if (_id != null) {
            id = _id
        }
        const obj = {
            index: id
        }
        return obj
    }
}