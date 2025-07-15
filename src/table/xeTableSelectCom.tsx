import { defineComponent, onMounted, ref, Teleport, watchEffect } from 'vue'
import { XeTable } from './xetable'

export default defineComponent({
  name: 'XeTableSelectCom',
  props: {
    tableIns: {},
  },
  setup(props) {
    let tableIns: XeTable = props.tableIns as any //
    let leftRef = null
    let topRef = null
    let rightRef = null
    let bottomRef = null
    let root = null
    let tele = ref(null)
    onMounted(() => {
      let ins = tableIns.getInstance()
      let el: HTMLDivElement = ins.getEl()
      let tableWrap = el.querySelector('.vxe-table--body-inner-wrapper')
      tele.value = tableWrap
    })
    let data = {
      width: 100,
      height: 90,
    }
    const color = 'red'
    let borderWidth = ref(2)
    watchEffect(() => {})
    return () => {
      if (tele.value == null) {
        return
      }
      let left = ( //
        <div
          style={{
            position: 'absolute',
            background: color,
            left: '0px',
            top: '0px',
            width: `${borderWidth.value}px`,
            height: `${data.height}px`,
          }}
          ref={(e) => (leftRef = e)}
        ></div>
      )
      let top = (
        <div
          style={{
            position: 'absolute',
            background: color,
            left: '0px',
            top: '0px',
            height: `${borderWidth.value}px`,
            width: `${data.width}px`,
          }}
          ref={(e) => (topRef = e)}
        ></div>
      )
      let right = (
        <div
          style={{
            background: color,
            left: `${data.width}px`,
            top: '0px',
            width: `${borderWidth.value}px`,
            height: `${data.height + 1}px`,
            position: 'absolute',
          }}
          ref={(e) => (rightRef = e)}
        ></div>
      )
      let bottom = (
        <div
          style={{
            background: color,
            left: '0px',
            top: `${data.height - 1}px`,
            height: `${borderWidth.value}px`,
            width: `${data.width}px`,
            position: 'absolute', //
          }}
          ref={(e) => (bottomRef = e)}
        ></div>
      ) //
      let teCom = (
        <Teleport to={tele.value}>
          <div
            style={{
              left: '0px',
              top: '0px',
              width: '0px',
              height: '0px',
              //   transform: 'translateX(1px)',
            }}
            ref={(e) => {
              root = e
            }}
            class="er-h-0 absolute er-w-0 bg-red"
          >
            {left}
            {top}
            {right}
            {bottom}
          </div>
        </Teleport>
      )
      return teCom
    }
  },
})
