import {
  defineComponent,
  h,
  Teleport,
  ref,
  onUnmounted,
  reactive,
  inject,
  computed,
  nextTick,
  watch,
  createCommentVNode,
} from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, globalEvents, createEvent, useSize } from 'vxe-pc-ui/es/ui'
import { getAbsolutePos, getEventTargetNode } from 'vxe-pc-ui/es/ui/src/dom'
import { getLastZIndex, nextZIndex } from 'vxe-pc-ui/es/ui/src/utils'
export default defineComponent({
  name: 'VxePulldown',
  props: {
    modelValue: Boolean,
    disabled: Boolean,
    placement: String,
    trigger: {
      type: String,
      default: getConfig().pulldown.trigger,
    },
    size: { type: String, default: () => getConfig().size },
    options: Array,
    className: {
      type: [String, Function],
      default: getConfig().pulldown.className,
    },
    popupClassName: [String, Function],
    showPopupShadow: Boolean,
    destroyOnClose: {
      type: Boolean,
      default: getConfig().pulldown.destroyOnClose,
    },
    transfer: {
      type: Boolean,
      default: null,
    },
    hiddenBefore: {
      type: Function,
    },
  },
  emits: [
    'update:modelValue',
    'click',
    'option-click',
    'show-panel',
    'hide-panel',
    'visible-change',
  ],
  setup(props, context) {
    const { slots, emit } = context
    const $xeModal = inject('$xeModal', null)
    const $xeDrawer = inject('$xeDrawer', null)
    const $xeTable = inject('$xeTable', null)
    const $xeForm = inject('$xeForm', null)
    const xID = XEUtils.uniqueId()
    const { computeSize } = useSize(props)
    const reactData = reactive({
      initialized: false,
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false,
    })
    const internalData = {
      hpTimeout: undefined,
    }
    const refElem = ref()
    const refPulldownContent = ref()
    const refPulldownPanel = ref()
    const computeBtnTransfer = computed(() => {
      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().pulldown.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return transfer
    })
    const refMaps = {
      refElem,
    }
    const $xePulldown: any = {
      xID,
      props,
      context,
      reactData,
      internalData,
      getRefMaps: () => refMaps,
    }
    let pulldownMethods = {}
    const updateZindex = () => {
      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }
    const isPanelVisible = () => {
      return reactData.visiblePanel
    }
    /**
     * 手动更新位置
     */
    const updatePlacement = () => {
      return nextTick().then(() => {
        const { placement } = props
        const { panelIndex, visiblePanel } = reactData
        const btnTransfer = computeBtnTransfer.value
        if (visiblePanel) {
          const targetElem = refPulldownContent.value
          const panelElem = refPulldownPanel.value
          if (panelElem && targetElem) {
            const targetHeight = targetElem.offsetHeight
            const targetWidth = targetElem.offsetWidth
            const panelHeight = panelElem.offsetHeight
            const panelWidth = panelElem.offsetWidth
            const marginSize = 5
            const panelStyle: any = {
              zIndex: panelIndex,
            }
            const {
              boundingTop,
              boundingLeft,
              visibleHeight,
              visibleWidth,
            } = getAbsolutePos(targetElem)
            let panelPlacement = 'bottom'
            if (btnTransfer) {
              let left = boundingLeft
              let top = boundingTop + targetHeight
              if (placement === 'top') {
                panelPlacement = 'top'
                top = boundingTop - panelHeight
              } else if (!placement) {
                // 如果下面不够放，则向上
                if (top + panelHeight + marginSize > visibleHeight) {
                  panelPlacement = 'top'
                  top = boundingTop - panelHeight
                }
                // 如果上面不够放，则向下（优先）
                if (top < marginSize) {
                  panelPlacement = 'bottom'
                  top = boundingTop + targetHeight
                }
              }
              // 如果溢出右边
              if (left + panelWidth + marginSize > visibleWidth) {
                left -= left + panelWidth + marginSize - visibleWidth
              }
              // 如果溢出左边
              if (left < marginSize) {
                left = marginSize
              }
              Object.assign(panelStyle, {
                left: `${left}px`,
                top: `${top}px`,
                minWidth: `${targetWidth}px`,
              })
            } else {
              if (placement === 'top') {
                panelPlacement = 'top'
                panelStyle.bottom = `${targetHeight}px`
              } else if (!placement) {
                // 如果下面不够放，则向上
                if (boundingTop + targetHeight + panelHeight > visibleHeight) {
                  // 如果上面不够放，则向下（优先）
                  if (boundingTop - targetHeight - panelHeight > marginSize) {
                    panelPlacement = 'top'
                    panelStyle.bottom = `${targetHeight}px`
                  }
                }
              }
            }
            reactData.panelStyle = panelStyle
            reactData.panelPlacement = panelPlacement
          }
        }
        return nextTick()
      })
    }
    /**
     * 显示下拉面板
     */
    const showPanel = () => {
      if (!reactData.initialized) {
        reactData.initialized = true
      }
      return new Promise((resolve) => {
        if (!props.disabled) {
          if (internalData.hpTimeout) {
            clearTimeout(internalData.hpTimeout)
          }
          reactData.isActivated = true
          reactData.isAniVisible = true
          setTimeout(() => {
            reactData.visiblePanel = true
            emit('update:modelValue', true)
            updatePlacement()
            setTimeout(() => {
              resolve(updatePlacement())
            }, 40)
          }, 10)
          updateZindex()
          dispatchEvent('visible-change', { visible: true }, null)
        } else {
          nextTick(() => {
            resolve(null)
          })
        }
      })
    }
    /**
     * 隐藏下拉面板
     */
    const hidePanel = () => {
      // if (1 == 1) {
      //   return
      // }
      reactData.visiblePanel = false
      dispatchEvent('visible-change', { visible: false }, null)
      emit('update:modelValue', false)
      return new Promise((resolve) => {
        if (reactData.isAniVisible) {
          internalData.hpTimeout = setTimeout(() => {
            reactData.isAniVisible = false
            nextTick(() => {
              resolve(null)
            })
          }, 350)
        } else {
          nextTick(() => {
            resolve(null)
          })
        }
      })
    }
    /**
     * 切换下拉面板
     */
    const togglePanel = () => {
      if (reactData.visiblePanel) {
        return hidePanel()
      }
      return showPanel()
    }
    const handleOptionEvent = (evnt, option) => {
      if (!option.disabled) {
        if (reactData.visiblePanel) {
          hidePanel()
          dispatchEvent('hide-panel', {}, evnt)
        }
        dispatchEvent('option-click', { option }, evnt)
      }
    }
    const clickTargetEvent = (evnt) => {
      const { trigger } = props
      if (trigger === 'click') {
        if (reactData.visiblePanel) {
          hidePanel()
          dispatchEvent('hide-panel', {}, evnt)
        } else {
          showPanel()
          dispatchEvent('show-panel', {}, evnt)
        }
      }
      dispatchEvent('click', { $pulldown: $xePulldown }, evnt)
    }
    const handleGlobalMousewheelEvent = (evnt) => {
      const { disabled } = props
      const { visiblePanel } = reactData
      const panelElem = refPulldownPanel.value
      if (!disabled) {
        if (visiblePanel) {
          if (getEventTargetNode(evnt, panelElem).flag) {
            updatePlacement()
          } else {
            hidePanel()
            dispatchEvent('hide-panel', {}, evnt)
          }
        }
      }
    }
    const handleGlobalMousedownEvent = async (evnt) => {
      const { disabled } = props
      const { visiblePanel } = reactData

      const el = refElem.value
      const panelElem = refPulldownPanel.value
      if (!disabled) {
        reactData.isActivated =
          getEventTargetNode(evnt, el).flag ||
          getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          const hiddenBefore = props.hiddenBefore
          if (typeof hiddenBefore == 'function') {
            let flag = await hiddenBefore(evnt)
            if (flag === false) {
              return
            } //
          } //
          hidePanel()
          dispatchEvent('hide-panel', {}, evnt)
        }
      }
    }
    const handleGlobalBlurEvent = (evnt) => {
      // if (reactData.visiblePanel) {
      //   reactData.isActivated = false
      //   hidePanel()
      //   dispatchEvent('hide-panel', {}, evnt)
      // }
    }
    const dispatchEvent = (type, params, evnt) => {
      emit(type, createEvent(evnt, { $pulldown: $xePulldown }, params))
    }
    pulldownMethods = {
      dispatchEvent,
      isPanelVisible,
      togglePanel,
      showPanel,
      hidePanel,
    }
    Object.assign($xePulldown, pulldownMethods)
    watch(
      () => props.modelValue,
      (value) => {
        reactData.isActivated = !!value
        if (value) {
          showPanel()
        } else {
          hidePanel()
        }
      },
    )
    // onUnmounted(() => {
    //   debugger //
    // })
    nextTick(() => {
      if (props.modelValue) {
        showPanel()
      }
      globalEvents.on($xePulldown, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xePulldown, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xePulldown, 'blur', handleGlobalBlurEvent)
    })
    onUnmounted(() => {
      globalEvents.off($xePulldown, 'mousewheel')
      globalEvents.off($xePulldown, 'mousedown')
      globalEvents.off($xePulldown, 'blur')
    })
    const renderDefaultPanel = (options) => {
      const optionSlot = slots.option
      return h(
        'div',
        {
          class: 'vxe-pulldown--panel-list',
        },
        options
          ? options.map((item) => {
              return h(
                'div',
                {
                  class: 'vxe-pulldown--panel-item',
                  onClick(evnt) {
                    handleOptionEvent(evnt, item)
                  },
                },
                optionSlot
                  ? optionSlot({ $pulldown: $xePulldown, option: item })
                  : `${item.label || ''}`,
              )
            })
          : [],
      )
    }
    const renderVN = () => {
      const {
        className,
        options,
        popupClassName,
        showPopupShadow,
        destroyOnClose,
        disabled,
      } = props
      const {
        initialized,
        isActivated,
        isAniVisible,
        visiblePanel,
        panelStyle,
        panelPlacement,
      } = reactData
      const btnTransfer = computeBtnTransfer.value
      const vSize = computeSize.value
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const dropdownSlot = slots.dropdown
      return h(
        'div',
        {
          ref: refElem,
          class: [
            'vxe-pulldown',
            'w-full', //
            className
              ? XEUtils.isFunction(className)
                ? className({ $pulldown: $xePulldown })
                : className
              : '',
            {
              [`size--${vSize}`]: vSize,
              'is--visible': visiblePanel,
              'is--disabled': disabled, //
              'is--active': isActivated,
            },
          ],
        },
        [
          h(
            'div',
            {
              ref: refPulldownContent,
              class: 'vxe-pulldown--content',
              onClick: clickTargetEvent,
            },
            defaultSlot ? defaultSlot({ $pulldown: $xePulldown }) : [],
          ),
          h(
            Teleport,
            {
              to: 'body',
              disabled: btnTransfer ? !initialized : true,
            },
            [
              h(
                'div',
                {
                  ref: refPulldownPanel,
                  class: [
                    'vxe-table--ignore-clear vxe-pulldown--panel',
                    popupClassName
                      ? XEUtils.isFunction(popupClassName)
                        ? popupClassName({ $pulldown: $xePulldown })
                        : popupClassName
                      : '',
                    {
                      [`size--${vSize}`]: vSize,
                      'is--shadow': showPopupShadow,
                      'is--transfer': btnTransfer,
                      'ani--leave': isAniVisible,
                      'ani--enter': visiblePanel,
                    },
                  ],
                  placement: panelPlacement,
                  style: panelStyle,
                },
                [
                  h(
                    'div',
                    {
                      class: 'vxe-pulldown--panel-wrapper',
                    },
                    initialized &&
                      (destroyOnClose ? visiblePanel || isAniVisible : true)
                      ? [
                          headerSlot
                            ? h(
                                'div',
                                {
                                  class: 'vxe-pulldown--panel-header',
                                },
                                headerSlot({ $pulldown: $xePulldown }),
                              )
                            : createCommentVNode(),
                          h(
                            'div',
                            {
                              class: 'vxe-pulldown--panel-body',
                            },
                            dropdownSlot
                              ? dropdownSlot({ $pulldown: $xePulldown })
                              : [renderDefaultPanel(options)],
                          ),
                          footerSlot
                            ? h(
                                'div',
                                {
                                  class: 'vxe-pulldown--panel-footer',
                                },
                                footerSlot({ $pulldown: $xePulldown }),
                              )
                            : createCommentVNode(),
                        ]
                      : [],
                  ),
                ],
              ),
            ],
          ),
        ],
      )
    }
    $xePulldown.renderVN = renderVN
    return $xePulldown
  },
  render() {
    return this.renderVN()
  },
})
