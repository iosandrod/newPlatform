import { Base } from '@/base/base'
import { TabItem } from './tabitem'
import { toRaw } from 'vue'
import { BMenu } from './bMenu'

export class Tab extends Base {
  currentItem?: any //
  scrollLeft = 0
  config: any
  isDesign = false
  tabitems: TabItem[] = []
  constructor(config) {
    super()
    this.config = config
    this.init()
  }
  getIsDesign() {
    return this.isDesign
  }
  init() {
    super.init()
    let config = this.config
    let items = config.items || []
    this.setItems(items) //
  }
  getPluginName() {
    let id = this.id
    let plugin = `Tab_${id}`
    return plugin
  }
  addItem(item) {
    let _item = new TabItem(item, this)
    this.tabitems.push(_item) //
  }
  delItem(item) {
    let index = this.tabitems.findIndex((item1) => {
      return item1 == item
    })
    if (index != -1) {
      this.tabitems.splice(index, 1)
    }
    let _index = this.tabitems.findIndex((item1) => {
      return toRaw(item1.config) == toRaw(item)
    })
    if (_index != -1) {
      this.tabitems.splice(_index, 1)
    }
  }
  setItems(tabitems) {
    //
    this.tabitems.splice(0)
    for (const tabitem of tabitems) {
      this.addItem(tabitem)
    }
  }
  getBindConfig() {
    return {
      modelValue: this.getModelValue(),
    }
  }
  getTabMinHeight() {
    return '30px'
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
    let modelValue = config.modelValue //
    return modelValue
  }
  onTabChange(id) {
    let items = this.tabitems
    let item = items.find((item) => item.getTabName() == id)
    let _config = this.config
    let onTabChange = _config.onTabChange
    this.currentItem = item //
    if (typeof onTabChange == 'function') {
      let config = item.config
      onTabChange({
        item: config, //
      }) //
    }
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
      put: false,
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
    tabitems[index2] = item1 //
  }
  openContextMenu(e, el) {
    this.currentItem = el //
    let menu: BMenu = this.getRef('contextMenu')
    if (menu == null) {
      return //
    }
    menu.open(e) //
  }
  getContextItems() {
    let config = this.config
    let _items = config.contextItems || []
    let oldItems = [
      {
        label: '关闭左侧',
        type: 'closeLeft',
        icon: 'closeLeft',
        fn: async () => {
          this.closeByCurrent('left')
        },
      },
      {
        label: '关闭右侧',
        type: 'closeRight',
        icon: 'closeRight',
        fn: async () => {
          this.closeByCurrent('right')
        },
      },
      {
        label: '关闭其他',
        type: 'closeOther',
        icon: 'closeOther',
        fn: async () => {
          this.closeByCurrent('other')
        },
      },
    ]
    let rItems = [...oldItems, ..._items]
    return rItems //
  }
  closeByCurrent(type) { }
}
