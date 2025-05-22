import {
  withModifiers,
  resolveComponent,
  ref,
  useSlots,
  onMounted,
  useAttrs,
  unref,
  onBeforeUnmount,
  inject,
  computed,
  onUnmounted,
} from 'vue'
import { isHTMLTag } from '@vue/shared'
import hooks from '@ER/hooks'
import utils from '@ER/utils'
import _ from 'lodash'
import Icon from '@ER/icon'
import { Form } from '@ER/form'
export default {
  name: 'SelectElement',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: Object,
    tag: {
      type: String,
      default: 'div',
    },
    parent: Object,
    hasMask: {
      type: Boolean,
      default: false,
    },
    hasDrag: {
      type: Boolean,
      default: false,
    },
    hasDel: {
      type: Boolean,
      default: false,
    },
    hasCopy: {
      type: Boolean,
      default: false,
    },
    hasTableCellOperator: {
      type: Boolean,
      default: false,
    },
    hasWidthScale: {
      type: Boolean,
      default: false,
    },
    hasInserColumn: {
      type: Boolean,
      default: false,
    },
    hasInserRow: {
      type: Boolean,
      default: false,
    },
    hasAddCol: {
      type: Boolean,
      default: false,
    },
    formitem: {
      type: Object,
    },
  },
  setup(props) {
    const ER: any = inject('Everright')
    const formIns: Form = inject('formIns') //
    const { t } = hooks.useI18n()
    const ns = hooks.useNamespace('selectElement')
    const isHover = ref(false)
    const isInlineChildren = formIns.checkIslineChildren(props.data)
    const { target, state, isEditModel, isSelectRoot, isPc } = hooks.useTarget()
    const id = hooks.useCss(props.data, state.platform)
    const visible = ref(false)
    const slots = useSlots()
    const isWarning = ref(false)
    const isField = utils.checkIsField(props.data)
    let type = props.data.type
    const handleClick = (e) => {
      formIns.setSelection(props.data) //
    }
    // console.log(props.data, 'test pData') //
    if (props.data.type == 'entity') {
      let style = props.data.style
      if (style) {
        style.minHeight = '200px' //
      }
    }
    if (props.data.type && isField) {
      state.validateStates.push({
        data: props.data,
        isWarning,
      })
    }

    const handleCommand = (command) => {
      const [fn, param] = command.split(' ')
      props.data.context[fn](param)
    }
    const isShowCell = ref(false)
    const actionStrategies = {
      delete: () => {
        formIns.deleteNode(props)
      },
      copy: () => {
        formIns.copyNode(props) //
      },
      top: () => {
        formIns.topNode(props) //
      },
      plus: () => {
        props.data.context.appendCol()
      },
      enterForm: () => {
        formIns.enterForm(props)
      },
      designForm: () => {
        formIns.designForm(props)
      },
      dragWidth: () => {
        formIns.dragWidth(props)
      },
      tableInsertRow: () => {
        formIns.tableInsertRow(props)
      },
      tableInsertCol: () => {
        formIns.tableInsertCol(props)
      },
    }
    const handleAction = (type) => {
      const iconActionMap = {
        1: 'delete', // 删除
        2: 'copy', // 复制
        3: 'tableInsertRow', // 插入行
        4: 'tableInsertCol', // 插入列
        5: 'top', // 置顶/选择父级
        6: 'plus', // 添加列
        7: 'enterForm',
        8: 'designForm',
        widthScale: 'dragWidth', // 调整宽度（特殊情况，无 action 数字）
      }
      let actionString = iconActionMap[type]
      actionStrategies[actionString]?.()
    }
    const elementRef = ref()
    const registerRef = (el) => {
      elementRef.value = el
      if (props.data.context) {
        props.data.context.getHoverDiv = () => el
      }
    }
    onUnmounted(() => {
      // props.data.context.getHoverDiv = null //
    })
    let widthScaleElement = ref()
    let isScale = ref(false)
    let isShowWidthScale = computed(() => {
      let s = false //
      let type = props.data.type
      if (type == 'col') {
        s = true
      } //
      let inline = props?.data?.context?.parent
      let parent = inline?.context?.parent
      if (parent?.type == 'col') {
        s = true
      }
      return s
    })
    const isShowHeightScale = computed(() => {
      let store = formIns.state.store ////
      let data = props.data
      let parent = data.context.parent
      if (store.findIndex((e) => e.id === parent.id) !== -1) return true //
      return false //
    })
    const heightScaleElement = ref()
    onMounted(() => {
      if (!unref(isEditModel)) return false
      let hoverEl = elementRef.value.$el || elementRef.value
      let widthScaleEl = widthScaleElement.value
      hoverEl.addEventListener('mouseover', (e) => {
        if (!state.widthScaleLock) {
          isHover.value = true
        }
        e.stopPropagation()
      })
      hoverEl.addEventListener('mouseout', (e) => {
        if (isShowCell.value) return false
        isHover.value = false
        e.stopPropagation()
      })
      //显示宽度更改按钮
      if (isShowWidthScale.value) {
        if (widthScaleEl == null) return
        widthScaleEl.addEventListener('mousedown', (e) => {
          let offsetParent = hoverEl.offsetParent
          let offsetParentWidth = offsetParent.offsetWidth //
          let columnWidth = offsetParentWidth / 24
          state.widthScaleLock = isScale.value = true
          const oldX = e.clientX
          const oldWidth = hoverEl.offsetWidth
          const onMouseMove = (e) => {
            //如果不是lineChildren
            if (props.data.type == 'col') {
              let offset = Math.ceil(
                (oldWidth +
                  Math.round((e.clientX - oldX) / columnWidth) * columnWidth) /
                  columnWidth,
              )
              if (offset >= 24) {
                offset = 24
              }
              if (offset <= 3) {
                offset = 3
              }
              let isCol = props.data.type == 'col'
              if (isCol) {
                let allCols = props.data?.context?.parent?.columns || []
                let allSpan = allCols
                  .filter((col) => col.id !== props.data.id)
                  .map((col) => col.options.span)
                  .reduce((pre, cur) => {
                    let num = pre + cur
                    return num
                  }, 0) //
                let _allSpan = allSpan + offset
                if (_allSpan > 24) {
                  return //
                }
                props.data.options.span = offset
              }
            } else {
              const curNewWidth = oldWidth + e.clientX - oldX
              let curWidth = Math.round(
                (curNewWidth / hoverEl.parentNode.offsetWidth) * 100,
              ) //百分比
              if (curWidth <= 25) {
                curWidth = 25
              }
              let inline = props?.data?.context?.parent
              let parent = inline?.context?.parent
              // debugger//
              if (parent?.type == 'col') {
                //重新设定
                let hoverEl = parent.context?.getHoverDiv()
                hoverEl = hoverEl?.$el || hoverEl //
                let offsetParent = hoverEl.offsetParent
                let offsetParentWidth = offsetParent.offsetWidth //
                let columnWidth = offsetParentWidth / 24
                let allCols = parent?.context?.parent?.columns || []
                let allSpan = allCols
                  .filter((col) => col.id != parent.id)
                  .map((col) => col.options.span)
                  .reduce((pre, cur) => {
                    let num = pre + cur
                    return num
                  }, 0)
                let offset = Math.ceil(
                  (oldWidth +
                    Math.round((e.clientX - oldX) / columnWidth) *
                      columnWidth) /
                    columnWidth,
                )
                if (offset >= 24) {
                  offset = 24
                }
                if (offset <= 3) {
                  offset = 3
                }
                let _allSpan = allSpan + offset
                if (_allSpan > 24) {
                  return //
                }
                parent.options.span = offset //
              }
            }
          }
          const onMouseUp = () => {
            document.removeEventListener('mouseup', onMouseUp)
            document.removeEventListener('mousemove', onMouseMove)
            state.widthScaleLock = isScale.value = false
          }
          document.addEventListener('mouseup', onMouseUp)
          document.addEventListener('mousemove', onMouseMove)
        })
      }
    })
    onMounted(() => {
      if (!unref(isEditModel)) return false
      const heightScaleEl = heightScaleElement.value
      const hoverEl = elementRef.value.$el || elementRef.value
      //显示宽度更改按钮
      if (isShowHeightScale.value && heightScaleEl) {
        //
        heightScaleEl.addEventListener('mousedown', (e) => {
          let offsetParent = hoverEl.offsetParent
          let offsetParentWidth = offsetParent.offsetWidth //
          let columnWidth = offsetParentWidth / 24
          state.heightScaleLock = isScale.value = true
          const oldY = e.clientY
          const oldHeight = hoverEl.offsetHeight
          let _newHeight = null
          const onMouseMove = (e) => {
            const isRootEl =
              formIns.state.store.findIndex(
                (e) => e.id === props.data.context.parent.id,
              ) !== -1
            if (!isRootEl) {
              return //
            }
            let newY = e.clientY
            let subHeight = newY - oldY
            hoverEl.style.height = oldHeight + subHeight + 'px' //
            _newHeight = oldHeight + subHeight + 'px'
          }

          const onMouseUp = () => {
            document.removeEventListener('mouseup', onMouseUp)
            document.removeEventListener('mousemove', onMouseMove)
            state.heightScaleLock = isScale.value = false
            if (_newHeight != null) {
              // hoverEl.style.height = null
              formIns.syncHeightByPlatform(
                props.data,
                state.platform,
                false,
                _newHeight,
              )
            }
          }
          document.addEventListener('mouseup', onMouseUp)
          document.addEventListener('mousemove', onMouseMove)
        })
      }
    })
    const TagComponent = isHTMLTag(props.tag)
      ? props.tag
      : resolveComponent(props.tag)
    const Selected = computed(() => {
      return target.value.id === props.data.id && ns.is('Selected')
    })
    const isShowCopy = computed(() =>
      isInlineChildren
        ? props.hasCopy &&
          props.data.context.parent.columns.length < ER.props.inlineMax
        : props.hasCopy,
    )
    return () => {
      let maskNode = <div class={[ns.e('mask')]}></div>
      let _attrs = useAttrs()

      let _slots = useSlots()
      let _slots1 = {
        ..._slots,
        default: () => {
          let dComArr = []
          let defaultCom = _slots.default()
          let arr = []
          arr.push(defaultCom)
          if (unref(isEditModel)) {
            if (ER.props.dragMode === 'icon') {
              let _com = (
                <div class={[ns.e('topLeft')]}>
                  {props.hasDrag && (
                    <Icon
                      class={['ER-handle', ns.e('dragIcon')]}
                      icon="Rank"
                    ></Icon>
                  )}
                </div>
              )
              arr.push(_com)
            } //
            let iconArr = []
            let selectParentIcon = (
              <Icon
                class={['handle', ns.e('selectParent')]}
                onClick={withModifiers(
                  (e) => {
                    handleAction(5)
                  },
                  ['stop'],
                )}
                icon="top"
              ></Icon>
            )
            iconArr.push(selectParentIcon)
            if (isShowCopy.value) {
              let copyIcon = (
                <Icon
                  class={['handle', ns.e('copy')]}
                  onClick={withModifiers(
                    (e) => {
                      handleAction(6)
                    },
                    ['stop'],
                  )}
                  icon="copy"
                ></Icon>
              )
              iconArr.push(copyIcon)
            }
            if (props.hasDel) {
              let delIcon = (
                <Icon
                  class={[ns.e('copy')]}
                  onClick={withModifiers(
                    (e) => {
                      handleAction(1)
                    },
                    ['stop'],
                  )}
                  icon="delete"
                ></Icon>
              )
              iconArr.push(delIcon)
            }
            if (props.data.type == 'Sform') {
              let _icon = (
                <Icon
                  class={[ns.e('copy')]}
                  onClick={withModifiers(
                    (e) => {
                      handleAction(7)
                    },
                    ['stop'],
                  )}
                  icon="config"
                ></Icon>
              )
              iconArr.push(_icon)
            }
            if (props.data.type == 'dform') {
              let _icon = (
                <Icon
                  class={[ns.e('copy')]}
                  onClick={withModifiers(
                    (e) => {
                      handleAction(8)
                    },
                    ['stop'],
                  )} //
                  icon="config"
                ></Icon> //设置子表
              )
              iconArr.push(_icon)
            }
            if (isShowWidthScale.value == true) {
              let _icon = (
                <div
                  ref={(el) => {
                    widthScaleElement.value = el
                  }}
                >
                  <Icon class={[ns.e('widthScale')]} icon="dragWidth"></Icon>
                </div>
              )
              iconArr.push(_icon)
            }
            if (isShowHeightScale.value) {
              let _icon = (
                <div ref={(el) => (heightScaleElement.value = el)}>
                  <Icon class={[ns.e('heightScale')]} icon="dragHeight"></Icon>
                </div>
              )
              iconArr.push(_icon)
            }
            if (props.hasAddCol) {
              let _icon = (
                <Icon
                  class={[ns.e('addCol')]}
                  onClick={withModifiers(
                    (e) => {
                      handleAction(6)
                    },
                    ['stop'],
                  )}
                  icon="plus"
                ></Icon>
              )
              iconArr.push(_icon)
            }//
            let _com = <div class={[ns.e('bottomRight')]}>{iconArr}</div>
            arr.push(_com)
            if (props.hasMask) {
              arr.push(maskNode) //
            }
          }
          return arr
        },
      }
      return (
        <TagComponent
          class={['ER-element', id.value]}
          {..._attrs}
          v-slots={_slots1} //////
          // @ts-ignore
          class={[
            ns.b(),
            'overflow-x-hidden',
            'w-full',
            unref(isEditModel) &&
              ER.props.dragMode === 'full' &&
              props.hasDrag &&
              'ER-handle',
            !isField && ns.e('borderless'),
            unref(isEditModel) && ns.e('editor'),
            unref(isEditModel) && Selected.value,
            unref(isEditModel) && isHover.value && ns.e('hover'),
            unref(isEditModel) && isScale.value && ns.e('isScale'),
            unref(isEditModel) && isWarning.value && ns.is('Warning'),
          ]}
          ref={registerRef}
          onClick={unref(isEditModel) && withModifiers(handleClick, ['stop'])}
        ></TagComponent>
      )
    }
  },
}
