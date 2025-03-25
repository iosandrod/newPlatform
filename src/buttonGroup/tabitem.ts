import { Base } from "@/base/base"
import { Tab } from "./tab"

export class TabItem extends Base {
    index: number = 0
    config: any
    parent: TabItem
    tab: Tab
    isDrag = false
    dragConfig = { dragIndex: null, tabLeft: 0, rootWidth: 0, subLeft: 0, rootLeft: 0, startX: 0, startY: 0, currentX: 0 }
    constructor(config, t) {
        super()
        this.config = config
        this.tab = t
        this.init()
    }
    startDrag(event: MouseEvent) {
        event.stopPropagation()
        event.preventDefault()
        const tab = this.tab
        let rootDiv: HTMLDivElement = tab.getRef('root')//
        const parent = this.getRef('root').parentElement.parentElement
        const ptransform = parent.style.transform
        const regex = /translateX\((-?\d+)px\)/;
        const match = ptransform.match(regex);
        if (match) {
            const number = parseInt(match[1], 10); // match[1] 是提取到的数字部分
            tab.scrollLeft = Math.abs(number)
        }
        // console.log(parentScroll,'parentScroll')
        let position = rootDiv.getBoundingClientRect()
        let root: HTMLDivElement = this.getRef('root')
        let rootPosition = root.getBoundingClientRect()
        this.dragConfig.tabLeft = position.left
        this.tab.tabitems.forEach(item => {
            item.cacheCurrentPosition()//
        })
        this.getRef('root').style.width = `${this.dragConfig.rootWidth}px`//
        this.isDrag = true
        const x = event.clientX
        let subLeft = x - rootPosition.left
        this.dragConfig.startX = x
        this.dragConfig.currentX = x
        this.dragConfig.subLeft = subLeft
        const _event = (e) => {
            this.drag(e)
        }
        const _event1 = (e) => {
            this.endDrag(e)
            document.removeEventListener('mousemove', _event)
            document.removeEventListener('mouseup', _event1)
        }
        document.addEventListener('mousemove', _event)
        document.addEventListener('mouseup', _event1)//
    }
    drag(event: MouseEvent) {
        let x = event.clientX
        this.dragConfig.currentX = x
        let tab = this.tab
        let tabitems = tab.tabitems
        let tabLeft = this.dragConfig.tabLeft
        let targetItem = null
        for (const item of tabitems) {
            if (item == this) {
                continue
            }
            let dragConfig = item.dragConfig
            let left = dragConfig.rootLeft
            let width = dragConfig.rootWidth
            //达到元素的左半边的范围
            if (x >= left && x <= (left + width)) {
                targetItem = item
                break
            }
        }
        if (targetItem == this) {
            return
        }
        let index = tabitems.indexOf(targetItem)
        let currentIndex = tabitems.indexOf(this)
        let sArr: TabItem[] = null
        if (index < currentIndex) {
            sArr = tabitems.slice(index, currentIndex + 1).filter(item => { return item != this })
            sArr.forEach(item => {
                let root = item.getRef('root')
                root.style.transform = `translateX(${this.dragConfig.rootWidth}px)`
            })
            let _arr = tabitems.filter(item => { return !sArr.includes(item) && item != this })
            _arr.forEach(item => {
                let root = item.getRef('root')
                root.style.transform = null
            })//
        } else {
            sArr = tabitems.slice(currentIndex, index + 1).filter(item => { return item != this })
            sArr.forEach(item => {
                let root = item.getRef('root')
                root.style.transform = `translateX(${-this.dragConfig.rootWidth}px)`
            })
            let _arr = tabitems.filter(item => { return !sArr.includes(item) && item != this })
            _arr.forEach(item => {
                let root = item.getRef('root')
                root.style.transform = null
            })
        }
        console.log(index, 'testDindex')
        this.dragConfig.dragIndex = index
    }
    getSlotItemStyle() {
        let style: any = {
            width: '100%',
            height: '100%',
            position: 'relative'
        }
        if (this.isDrag) {
            style.position = 'fixed'//
            let leftNum = this.dragConfig.currentX - this.dragConfig.tabLeft - this.dragConfig.subLeft + this.tab.scrollLeft - 20
            if (leftNum < 0) {
                leftNum = 0
            }
            style.left = `${leftNum}px`
            style.zIndex = 4
        } else {

        }
        return style
    }
    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Drag end event handler
     * @param event mouse event
     */
    /******  35d3c291-cc05-44c6-820b-4c20af2df923  *******/
    endDrag(event: MouseEvent) {
        this.isDrag = false
        this.tab.tabitems.forEach(item => {
            item.getRef('root').style.transform = null
        })
        let dragConfig = this.dragConfig
        let index = dragConfig.dragIndex
        let currentIndex = this.tab.tabitems.indexOf(this)
        if (index == null || index == -1) {
            this.dragConfig.dragIndex = null
            return
         }
        if (index != currentIndex) {
            this.tab.tabitems.splice(currentIndex, 0, this.tab.tabitems.splice(index, 1)[0])//
        }
        this.dragConfig.dragIndex = null
    }
    init() {
        super.init()
    }
    getDragProps() {
        const tab = this.tab
        // let pluginName = this.tab
        let id = tab.id
        let obj = {
            id: this.id,
            swapThreshold: 1,
            itemKey: 'id',
            group: {
                name: `er-Canves-${id}`,
                pull: 'clone',
                put: false
            },
            parent: this.parent,
            list: [],
        }
        return obj
    }
    cacheCurrentPosition() {
        let root = this.getRef('root')
        let position = root.getBoundingClientRect()
        this.dragConfig.rootLeft = position.left
        this.dragConfig.rootWidth = position.width
    }
}