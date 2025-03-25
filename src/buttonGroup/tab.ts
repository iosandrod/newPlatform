import { Base } from "@/base/base";
import { TabItem } from "./tabitem";

export class Tab extends Base {
    scrollLeft = 0
    config: any
    isDesign = false
    tabitems: TabItem[] = []
    constructor(config) {
        super()
        this.config = config
        this.init()
    }
    init() {
        super.init()
        let config = this.config
        let items = config.items || []
        this.setTabItems(items)//
    }
    getPluginName() {
        let id = this.id
        let plugin = `Tab_${id}`
        return plugin
    }
    addNewTabitem(item) {
        let _item = new TabItem(item, this)
        this.tabitems.push(_item)//
    }
    setTabItems(tabitems) {
        this.tabitems.splice(0)
        for (const tabitem of tabitems) {
            this.addNewTabitem(tabitem)
        }
    }
    getBindConfig() {
        return {
            modelValue: this.getModelValue()
        }
    }
    getTabHeight() {
        let config = this.config
        let height = config.height
        if (!height) {
            height = 'auto'
        } else {
            height = height + 'px'
        }
        return height
    }
    getModelValue() {
        let config = this.config
        let modelValue = config.modelValue
        return modelValue
    }
    getDragProps() {
        let obj: any = {}
        let list = this.tabitems
        let id = this.id
        obj.list = list
        obj.id = id
        obj.group = {
            name: `er-Canves-${id}`,
            pull: 'clone',
            put: false
        }
        obj.itemKey = 'id'
        obj.swapThreshold = 1
        return obj
    }
    swapElement(item1, item2) {
        if (item1 == item2) {
            return
        }
        let tabitems = this.tabitems
        let index1 = tabitems.indexOf(item1)
        let index2 = tabitems.indexOf(item2)
        tabitems[index1] = item2
        tabitems[index2] = item1//
    }
}

