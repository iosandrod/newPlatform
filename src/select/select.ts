import {
  defineComponent,
  h,
  Teleport,
  PropType,
  ref,
  Ref,
  inject,
  computed,
  provide,
  onUnmounted,
  reactive,
  nextTick,
  watch,
  onMounted,
} from 'vue'
import XEUtils from 'xe-utils'
import {
  getConfig,
  getIcon,
  getI18n,
  globalEvents,
  GLOBAL_EVENT_KEYS,
  createEvent,
  useSize,
  renderEmptyElement,
} from 'vxe-pc-ui' //
import {
  getEventTargetNode,
  getAbsolutePos,
} from 'vxe-pc-ui/packages/ui/src/dom'
import {
  getLastZIndex,
  nextZIndex,
  getFuncText,
} from 'vxe-pc-ui/packages/ui/src/utils'
import { getSlotVNs } from 'vxe-pc-ui/packages/ui/src/vn'
import VxeInputComponent from 'vxe-pc-ui/packages/input/index'

import type {
  VxeSelectPropTypes,
  VxeSelectConstructor,
  SelectInternalData,
  SelectReactData,
  VxeSelectDefines,
  ValueOf,
  VxeSelectEmits,
  VxeComponentSlotType,
  VxeInputConstructor,
  SelectMethods,
  SelectPrivateRef,
  VxeSelectMethods,
  VxeOptgroupProps,
  VxeOptionProps,
  VxeDrawerConstructor,
  VxeDrawerMethods,
  VxeFormDefines,
  VxeFormConstructor,
  VxeFormPrivateMethods,
  VxeModalConstructor,
  VxeModalMethods,
  VxeInputEvents,
} from 'vxe-pc-ui/types'
import type {
  VxeTableConstructor,
  VxeTablePrivateMethods,
} from 'vxe-pc-ui/types/components/table'

function isOptionVisible(option: any) {
  return option.visible !== false
}

function getOptUniqueId() {
  return XEUtils.uniqueId('opt_')
}

export default defineComponent({
  name: 'VxeSelect',
  props: {
    enableOther: {
      type: Boolean,
      default: false,
    }, //
    modelValue: [String, Number, Boolean, Array] as PropType<
      VxeSelectPropTypes.ModelValue
    >,
    defaultConfig: Object as PropType<VxeSelectPropTypes.DefaultConfig>,
    clearable: Boolean as PropType<VxeSelectPropTypes.Clearable>,
    placeholder: String as PropType<VxeSelectPropTypes.Placeholder>,
    readonly: {
      type: Boolean as PropType<VxeSelectPropTypes.Readonly>,
      default: null,
    },
    loading: Boolean as PropType<VxeSelectPropTypes.Loading>,
    disabled: {
      type: Boolean as PropType<VxeSelectPropTypes.Disabled>,
      default: null,
    },
    multiple: Boolean as PropType<VxeSelectPropTypes.Multiple>,
    multiCharOverflow: {
      type: [Number, String] as PropType<VxeSelectPropTypes.MultiCharOverflow>,
      default: () => getConfig().select.multiCharOverflow,
    },
    prefixIcon: String as PropType<VxeSelectPropTypes.PrefixIcon>,
    allowCreate: {
      type: Boolean as PropType<VxeSelectPropTypes.AllowCreate>,
      default: () => getConfig().select.allowCreate,
    },
    placement: String as PropType<VxeSelectPropTypes.Placement>,
    options: Array as PropType<VxeSelectPropTypes.Options>,
    optionProps: Object as PropType<VxeSelectPropTypes.OptionProps>,
    optionGroups: Array as PropType<VxeSelectPropTypes.OptionGroups>,
    optionGroupProps: Object as PropType<VxeSelectPropTypes.OptionGroupProps>,
    optionConfig: Object as PropType<VxeSelectPropTypes.OptionConfig>,
    className: [String, Function] as PropType<VxeSelectPropTypes.ClassName>,
    popupClassName: [String, Function] as PropType<
      VxeSelectPropTypes.PopupClassName
    >,
    max: {
      type: [String, Number] as PropType<VxeSelectPropTypes.Max>,
      default: null,
    },
    size: {
      type: String as PropType<VxeSelectPropTypes.Size>,
      default: () => getConfig().select.size || getConfig().size,
    },
    filterable: Boolean as PropType<VxeSelectPropTypes.Filterable>,
    filterMethod: Function as PropType<VxeSelectPropTypes.FilterMethod>,
    remote: Boolean as PropType<VxeSelectPropTypes.Remote>,
    // 已废弃，被 remote-config.queryMethod 替换
    remoteMethod: Function as PropType<VxeSelectPropTypes.RemoteMethod>,
    remoteConfig: Object as PropType<VxeSelectPropTypes.RemoteConfig>,
    emptyText: String as PropType<VxeSelectPropTypes.EmptyText>,
    transfer: {
      type: Boolean as PropType<VxeSelectPropTypes.Transfer>,
      default: null,
    },
    virtualYConfig: Object as PropType<VxeSelectPropTypes.VirtualYConfig>,
    scrollY: Object as PropType<VxeSelectPropTypes.ScrollY>,

    // 已废弃，被 option-config.keyField 替换
    optionId: {
      type: String as PropType<VxeSelectPropTypes.OptionId>,
      default: () => getConfig().select.optionId,
    },
    // 已废弃，被 option-config.useKey 替换
    optionKey: Boolean as PropType<VxeSelectPropTypes.OptionKey>,
  },
  emits: [
    'input',
    'update:modelValue',
    'change',
    'clear',
    'blur',
    'focus',
    'click',
    'scroll',
    'visible-change',
  ] as any,
  setup(props, context) {
    const { slots, emit } = context

    const $xeModal = inject<(VxeModalConstructor & VxeModalMethods) | null>(
      '$xeModal',
      null,
    )
    const $xeDrawer = inject<(VxeDrawerConstructor & VxeDrawerMethods) | null>(
      '$xeDrawer',
      null,
    )
    const $xeTable = inject<
      (VxeTableConstructor & VxeTablePrivateMethods) | null
    >('$xeTable', null)
    const $xeForm = inject<(VxeFormConstructor & VxeFormPrivateMethods) | null>(
      '$xeForm',
      null,
    )
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>(
      'xeFormItemInfo',
      null,
    )

    const xID = XEUtils.uniqueId()

    const refElem = ref() as Ref<HTMLDivElement>
    const refInput = ref() as Ref<VxeInputConstructor>
    const refInpSearch = ref() as Ref<VxeInputConstructor>
    const refVirtualWrapper = ref() as Ref<HTMLDivElement>
    const refOptionPanel = ref() as Ref<HTMLDivElement>
    const refVirtualBody = ref() as Ref<HTMLDivElement>

    const { computeSize } = useSize(props)

    const reactData = reactive<SelectReactData>({
      initialized: false,
      scrollYLoad: false,
      bodyHeight: 0,
      topSpaceHeight: 0,
      optList: [],
      afterVisibleList: [],
      staticOptions: [],
      reactFlag: 0,

      currentOption: null,
      searchValue: '',
      searchLoading: false,

      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      triggerFocusPanel: false,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false,
    })

    const internalData: SelectInternalData = {
      synchData: [],
      fullData: [],
      optAddMaps: {},
      optGroupKeyMaps: {},
      optFullValMaps: {},
      remoteValMaps: {},

      lastScrollLeft: 0,
      lastScrollTop: 0,
      scrollYStore: {
        startIndex: 0,
        endIndex: 0,
        visibleSize: 0,
        offsetSize: 0,
        rowHeight: 0,
      },

      lastScrollTime: 0,
      hpTimeout: undefined,
    }

    const refMaps: SelectPrivateRef = {
      refElem,
    }

    const $xeSelect = ({
      xID,
      props,
      context,
      reactData,
      internalData,
      getRefMaps: () => refMaps,
    } as unknown) as VxeSelectConstructor & VxeSelectMethods

    const computeFormReadonly = computed(() => {
      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.props.readonly
        }
        return false
      }
      return readonly
    })

    const computeIsDisabled = computed(() => {
      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.props.disabled
        }
        return false
      }
      return disabled
    })

    const computeBtnTransfer = computed(() => {
      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().select.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return transfer
    })

    const computeInpPlaceholder = computed(() => {
      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().select.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.base.pleaseSelect')
    })

    const computeDefaultOpts = computed(() => {
      return Object.assign({}, props.defaultConfig)
    })
    const computePropsOpts = computed(() => {
      return Object.assign({}, props.optionProps)
    })

    const computeGroupPropsOpts = computed(() => {
      return Object.assign({}, props.optionGroupProps)
    })

    const computeLabelField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.label || 'label'
    })

    const computeValueField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.value || 'value'
    })

    const computeGroupLabelField = computed(() => {
      const groupPropsOpts = computeGroupPropsOpts.value
      return groupPropsOpts.label || 'label'
    })

    const computeGroupOptionsField = computed(() => {
      const groupPropsOpts = computeGroupPropsOpts.value
      return groupPropsOpts.options || 'options'
    })

    const computeIsMaximize = computed(() => {
      const { modelValue, multiple, max } = props
      if (multiple && max) {
        return (
          (XEUtils.isArray(modelValue)
            ? modelValue.length
            : XEUtils.eqNull(modelValue)
            ? 0
            : 1) >= XEUtils.toNumber(max)
        )
      }
      return false
    })

    const computeSYOpts = computed(() => {
      return Object.assign(
        {} as { gt: number },
        getConfig().select.virtualYConfig || getConfig().select.scrollY,
        props.virtualYConfig || props.scrollY,
      )
    })

    const computeRemoteOpts = computed(() => {
      return Object.assign(
        {},
        getConfig().select.remoteConfig,
        props.remoteConfig,
      )
    })

    const computeOptionOpts = computed(() => {
      return Object.assign(
        {},
        getConfig().select.optionConfig,
        props.optionConfig,
      )
    })

    const computeMultiMaxCharNum = computed(() => {
      return XEUtils.toNumber(props.multiCharOverflow)
    })

    const computeSelectLabel = computed(() => {
      const { modelValue, remote, multiple } = props
      const multiMaxCharNum = computeMultiMaxCharNum.value
      if (XEUtils.eqNull(modelValue)) {
        return ''
      }
      const vals = XEUtils.isArray(modelValue) ? modelValue : [modelValue]
      if (remote) {
        return vals.map((val) => getRemoteSelectLabel(val)).join(', ')
      }
      return vals
        .map((val) => {
          const label = getSelectLabel(val)
          if (
            multiple &&
            multiMaxCharNum > 0 &&
            label.length > multiMaxCharNum
          ) {
            return `${label.substring(0, multiMaxCharNum)}...`
          }
          return label
        })
        .join(', ')
    })

    const callSlot = <T>(
      slotFunc:
        | ((params: T) => VxeComponentSlotType | VxeComponentSlotType[])
        | string
        | null,
      params: T,
    ) => {
      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc(params))
        }
      }
      return []
    }

    const dispatchEvent = (
      type: ValueOf<VxeSelectEmits>,
      params: Record<string, any>,
      evnt: Event | null,
    ) => {
      emit(type, createEvent(evnt, { $select: $xeSelect }, params))
    }

    const emitModel = (value: any) => {
      emit('update:modelValue', value)
    }

    const getOptKey = () => {
      const optionOpts = computeOptionOpts.value
      return optionOpts.keyField || props.optionId || '_X_OPTION_KEY'
    }

    const getOptId = (option: any) => {
      const optid = option[getOptKey()]
      return optid ? encodeURIComponent(optid) : ''
    }

    const getRemoteSelectLabel = (value: any) => {
      const { remoteValMaps } = internalData
      const labelField = computeLabelField.value
      const remoteItem = remoteValMaps[value]
      const item = remoteItem ? remoteItem.item : null
      return XEUtils.toValueString(item ? item[labelField] : value)
    }

    const getSelectLabel = (value: any) => {
      const { optFullValMaps } = internalData
      const labelField = computeLabelField.value
      const cacheItem = reactData.reactFlag ? optFullValMaps[value] : null
      let _value = cacheItem
        ? cacheItem.item[labelField as 'label']
        : XEUtils.toValueString(value) //
      return _value
    }

    const cacheItemMap = (datas: any[]) => {
      const groupOptionsField = computeGroupOptionsField.value
      const valueField = computeValueField.value
      const key = getOptKey()
      const groupKeyMaps: Record<string, any> = {}
      const fullKeyMaps: Record<string, VxeSelectDefines.OptCacheItem> = {}
      const list: any[] = []
      const handleOptItem = (item: any) => {
        list.push(item)
        let optid = getOptId(item)
        if (!optid) {
          optid = getOptUniqueId()
          item[key] = optid
        }
        fullKeyMaps[item[valueField]] = {
          key: optid,
          item,
          _index: -1,
        }
      }
      datas.forEach((group: any) => {
        handleOptItem(group)
        if (group[groupOptionsField]) {
          groupKeyMaps[group[key]] = group
          group[groupOptionsField].forEach(handleOptItem)
        }
      })
      internalData.fullData = list
      internalData.optGroupKeyMaps = groupKeyMaps
      internalData.optFullValMaps = fullKeyMaps
      reactData.reactFlag++
      handleOption()
    }

    /**
     * 处理选项，当选项被动态显示/隐藏时可能会用到
     */
    const handleOption = () => {
      const { modelValue, filterable, filterMethod } = props
      const { searchValue } = reactData
      const { fullData, optFullValMaps } = internalData
      const labelField = computeLabelField.value
      const valueField = computeValueField.value
      const searchStr = `${searchValue || ''}`.toLowerCase()
      let avList: any[] = []
      if (filterable && filterMethod) {
        avList = fullData.filter(
          (option) =>
            isOptionVisible(option) &&
            filterMethod({
              $select: $xeSelect,
              group: null,
              option,
              searchValue,
              value: modelValue,
            }),
        )
      } else if (filterable) {
        avList = fullData.filter(
          (option) =>
            isOptionVisible(option) &&
            (!searchStr ||
              `${option[labelField]}`.toLowerCase().indexOf(searchStr) > -1),
        )
      } else {
        avList = fullData.filter(isOptionVisible)
      }
      avList.forEach((item, index) => {
        const cacheItem = optFullValMaps[item[valueField]]
        if (cacheItem) {
          cacheItem._index = index
        }
      })
      reactData.afterVisibleList = avList
      return nextTick()
    }

    const setCurrentOption = (option: any) => {
      if (option) {
        reactData.currentOption = option
      }
    }

    const updateZIndex = () => {
      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const updatePlacement = () => {
      return nextTick().then(() => {
        const { placement } = props
        const { panelIndex } = reactData
        const el = refElem.value
        const panelElem = refOptionPanel.value
        const btnTransfer = computeBtnTransfer.value
        if (panelElem && el) {
          const targetHeight = el.offsetHeight
          const targetWidth = el.offsetWidth
          const panelHeight = panelElem.offsetHeight
          const panelWidth = panelElem.offsetWidth
          const marginSize = 5
          const panelStyle: { [key: string]: any } = {
            zIndex: panelIndex,
          }
          const {
            boundingTop,
            boundingLeft,
            visibleHeight,
            visibleWidth,
          } = getAbsolutePos(el)
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
          return nextTick()
        }
      })
    }

    const showOptionPanel = () => {
      const { loading, filterable, remote } = props
      const { fullData, hpTimeout } = internalData
      const isDisabled = computeIsDisabled.value
      const remoteOpts = computeRemoteOpts.value
      if (!loading && !isDisabled) {
        if (hpTimeout) {
          clearTimeout(hpTimeout)
          internalData.hpTimeout = undefined
        }
        if (!reactData.initialized) {
          reactData.initialized = true
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        if (filterable) {
          if (
            remote &&
            remoteOpts.enabled &&
            remoteOpts.autoLoad &&
            !fullData.length
          ) {
            triggerSearchEvent()
          } else {
            handleOption()
            updateYData()
          }
        }
        setTimeout(() => {
          reactData.visiblePanel = true
          handleFocusSearch()
          recalculate().then(() => refreshScroll())
        }, 10)
        setTimeout(() => {
          recalculate().then(() => refreshScroll())
        }, 100)
        updateZIndex()
        updatePlacement()
        dispatchEvent('visible-change', { visible: true }, null)
      }
    }

    const hideOptionPanel = () => {
      reactData.searchValue = ''
      reactData.searchLoading = false
      reactData.visiblePanel = false
      //@ts-ignore
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
      dispatchEvent('visible-change', { visible: false }, null)
    }

    const changeEvent = (evnt: Event, selectValue: any) => {
      emitModel(selectValue)
      if (selectValue !== props.modelValue) {
        dispatchEvent('change', { value: selectValue }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(
            evnt,
            formItemInfo.itemConfig.field,
            selectValue,
          )
        }
      }
    }

    const clearValueEvent = (evnt: Event, selectValue: any) => {
      internalData.remoteValMaps = {}
      changeEvent(evnt, selectValue)
      dispatchEvent('clear', { value: selectValue }, evnt)
    }

    const clearEvent: VxeInputEvents.Clear = (params) => {
      const { $event } = params
      clearValueEvent($event, null)
      hideOptionPanel()
    }

    const changeOptionEvent = (evnt: Event, option: any) => {
      const { modelValue, multiple } = props
      const { remoteValMaps } = internalData
      const valueField = computeValueField.value
      const selectValue = option[valueField]
      const remoteItem = remoteValMaps[selectValue]
      if (remoteItem) {
        remoteItem.item = option
      } else {
        remoteValMaps[selectValue] = {
          key: getOptId(option),
          item: option,
          _index: -1,
        }
      }
      if (multiple) {
        let multipleValue: any[] = []
        const selectVals = XEUtils.eqNull(modelValue)
          ? []
          : XEUtils.isArray(modelValue)
          ? modelValue
          : [modelValue]
        const index = XEUtils.findIndexOf(
          selectVals,
          (val) => val === selectValue,
        )
        if (index === -1) {
          multipleValue = selectVals.concat([selectValue])
        } else {
          multipleValue = selectVals.filter((val) => val !== selectValue)
        }
        changeEvent(evnt, multipleValue)
      } else {
        changeEvent(evnt, selectValue)
        hideOptionPanel()
      }
      reactData.reactFlag++
    }

    const handleGlobalMousewheelEvent = (evnt: MouseEvent) => {
      const { visiblePanel } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        if (visiblePanel) {
          const panelElem = refOptionPanel.value
          if (getEventTargetNode(evnt, panelElem).flag) {
            updatePlacement()
          } else {
            hideOptionPanel()
          }
        }
      }
    }

    const handleGlobalMousedownEvent = (evnt: MouseEvent) => {
      const { visiblePanel } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const el = refElem.value
        const panelElem = refOptionPanel.value
        reactData.isActivated =
          getEventTargetNode(evnt, el).flag ||
          getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          hideOptionPanel()
        }
      }
    }

    const validOffsetOption = (option: any) => {
      const isDisabled = option.disabled
      const optid = getOptId(option)
      if (!isDisabled && !hasOptGroupById(optid)) {
        return true
      }
      return false
    }

    const findOffsetOption = (option: any, isDwArrow: boolean) => {
      const { allowCreate } = props
      const { afterVisibleList, optList } = reactData
      const { optFullValMaps, optAddMaps } = internalData
      const valueField = computeValueField.value
      let fullList = afterVisibleList
      let offsetAddIndex = 0
      if (allowCreate && optList.length) {
        const firstItem = optList[0]
        const optid = getOptId(firstItem)
        if (optAddMaps[optid]) {
          offsetAddIndex = 1
          fullList = [optAddMaps[optid]].concat(fullList)
        }
      }
      if (!option) {
        if (isDwArrow) {
          for (let i = 0; i < fullList.length; i++) {
            const item = fullList[i]
            if (validOffsetOption(item)) {
              return item
            }
          }
        } else {
          for (let len = fullList.length - 1; len >= 0; len--) {
            const item = fullList[len]
            if (validOffsetOption(item)) {
              return item
            }
          }
        }
      }
      let avIndex = 0
      const cacheItem = option ? optFullValMaps[option[valueField]] : null
      if (cacheItem) {
        avIndex = cacheItem._index + offsetAddIndex
      }
      if (avIndex > -1) {
        if (isDwArrow) {
          for (let i = avIndex + 1; i <= fullList.length - 1; i++) {
            const item = fullList[i]
            if (validOffsetOption(item)) {
              return item
            }
          }
        } else {
          if (avIndex > 0) {
            for (let len = avIndex - 1; len >= 0; len--) {
              const item = fullList[len]
              if (validOffsetOption(item)) {
                return item
              }
            }
          }
        }
      }
      return null
    }

    const handleGlobalKeydownEvent = (evnt: KeyboardEvent) => {
      const { clearable } = props
      const { visiblePanel, currentOption } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const isTab = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.TAB)
        const isEnter = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ENTER)
        const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
        const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
        const isDwArrow = globalEvents.hasKey(
          evnt,
          GLOBAL_EVENT_KEYS.ARROW_DOWN,
        )
        const isDel = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.DELETE)
        const isSpacebar = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.SPACEBAR)
        if (isTab) {
          reactData.isActivated = false
        }
        if (visiblePanel) {
          if (isEsc || isTab) {
            hideOptionPanel()
          } else if (isEnter) {
            evnt.preventDefault()
            evnt.stopPropagation()
            changeOptionEvent(evnt, currentOption)
          } else if (isUpArrow || isDwArrow) {
            evnt.preventDefault()
            let offsetOption = findOffsetOption(currentOption, isDwArrow)
            // 如果不匹配，默认最接近一个
            if (!offsetOption) {
              offsetOption = findOffsetOption(null, isDwArrow)
            }
            if (offsetOption) {
              setCurrentOption(offsetOption)
              handleScrollToOption(offsetOption, isDwArrow)
            }
          } else if (isSpacebar) {
            evnt.preventDefault()
          }
        } else if (
          (isUpArrow || isDwArrow || isEnter || isSpacebar) &&
          reactData.isActivated
        ) {
          evnt.preventDefault()
          showOptionPanel()
        }
        if (reactData.isActivated) {
          if (isDel && clearable) {
            clearValueEvent(evnt, null)
          }
        }
      }
    }

    const handleGlobalBlurEvent = () => {
      hideOptionPanel()
    }

    const handleFocusSearch = () => {
      if (props.filterable) {
        nextTick(() => {
          const inpSearch = refInpSearch.value
          if (inpSearch) {
            inpSearch.focus()
          }
        })
      }
    }

    const focusEvent = (evnt: FocusEvent) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          reactData.triggerFocusPanel = true
          showOptionPanel()
          setTimeout(() => {
            reactData.triggerFocusPanel = false
          }, 500)
        }
      }
      dispatchEvent('focus', {}, evnt)
    }

    const clickEvent = (evnt: MouseEvent) => {
      togglePanelEvent(evnt)
      dispatchEvent(
        'click',
        { triggerButton: false, visible: reactData.visiblePanel },
        evnt,
      )
    }
    const inputChangeEvent = (evnt: Event) => {
      //@ts-ignore
      dispatchEvent('input', {}, evnt)
    }

    const blurEvent = (evnt: FocusEvent) => {
      reactData.isActivated = false
      dispatchEvent('blur', {}, evnt)
    }

    const suffixClickEvent = (evnt: MouseEvent) => {
      togglePanelEvent(evnt)
      dispatchEvent(
        'click',
        { triggerButton: true, visible: reactData.visiblePanel },
        evnt,
      )
    }

    const modelSearchEvent = (value: string) => {
      reactData.searchValue = value
    }

    const focusSearchEvent = () => {
      reactData.isActivated = true
    }

    const handleSearchEvent = () => {
      const { modelValue, remote, remoteMethod } = props
      const { searchValue } = reactData
      const remoteOpts = computeRemoteOpts.value
      const queryMethod = remoteOpts.queryMethod || remoteMethod
      if (remote && queryMethod && remoteOpts.enabled) {
        reactData.searchLoading = true
        Promise.resolve(
          //@ts-ignore
          queryMethod({ $select: $xeSelect, searchValue, value: modelValue }),
        )
          .then(() => nextTick())
          .catch(() => nextTick())
          .finally(() => {
            reactData.searchLoading = false
            handleOption()
            updateYData()
          })
      } else {
        handleOption()
        updateYData()
      }
    }

    const triggerSearchEvent = XEUtils.debounce(handleSearchEvent, 350, {
      trailing: true,
    })

    const togglePanelEvent = (params: any) => {
      const { $event } = params
      $event.preventDefault()
      if (reactData.triggerFocusPanel) {
        reactData.triggerFocusPanel = false
      } else {
        if (reactData.visiblePanel) {
          hideOptionPanel()
        } else {
          showOptionPanel()
        }
      }
    }

    const checkOptionDisabled = (
      isSelected: any,
      option: VxeOptionProps,
      group?: VxeOptgroupProps,
    ) => {
      if (option.disabled) {
        return true
      }
      if (group && group.disabled) {
        return true
      }
      const isMaximize = computeIsMaximize.value
      if (isMaximize && !isSelected) {
        return true
      }
      return false
    }

    const updateYSpace = () => {
      const { scrollYLoad, afterVisibleList } = reactData
      const { scrollYStore } = internalData
      reactData.bodyHeight = scrollYLoad
        ? afterVisibleList.length * scrollYStore.rowHeight
        : 0
      reactData.topSpaceHeight = scrollYLoad
        ? Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0)
        : 0
    }

    const handleData = () => {
      const { filterable, allowCreate } = props
      const { scrollYLoad, afterVisibleList, searchValue } = reactData
      const { optAddMaps, scrollYStore } = internalData
      const labelField = computeLabelField.value
      const valueField = computeValueField.value
      const restList = scrollYLoad
        ? afterVisibleList.slice(scrollYStore.startIndex, scrollYStore.endIndex)
        : afterVisibleList.slice(0)
      if (filterable && allowCreate && searchValue) {
        if (!restList.some((option) => option[labelField] === searchValue)) {
          const addItem =
            optAddMaps[searchValue] ||
            reactive({
              [getOptKey()]: searchValue,
              [labelField]: searchValue,
              [valueField]: searchValue,
            })
          optAddMaps[searchValue] = addItem
          restList.unshift(addItem)
        }
      }
      reactData.optList = restList
      return nextTick()
    }

    const updateYData = () => {
      handleData()
      updateYSpace()
    }

    const computeScrollLoad = () => {
      return nextTick().then(() => {
        const { scrollYLoad } = reactData
        const { scrollYStore } = internalData
        const virtualBodyElem = refVirtualBody.value
        const sYOpts = computeSYOpts.value
        let rowHeight = 0
        let firstItemElem: HTMLElement | undefined
        if (virtualBodyElem) {
          if (sYOpts.sItem) {
            firstItemElem = virtualBodyElem.querySelector(
              sYOpts.sItem,
            ) as HTMLElement
          }
          if (!firstItemElem) {
            firstItemElem = virtualBodyElem.children[0] as HTMLElement
          }
        }
        if (firstItemElem) {
          rowHeight = firstItemElem.offsetHeight
        }
        rowHeight = Math.max(20, rowHeight)
        scrollYStore.rowHeight = rowHeight
        // 计算 Y 逻辑
        if (scrollYLoad) {
          const scrollBodyElem = refVirtualWrapper.value
          const visibleYSize = Math.max(
            8,
            scrollBodyElem
              ? Math.ceil(scrollBodyElem.clientHeight / rowHeight)
              : 0,
          )
          const offsetYSize = Math.max(
            0,
            Math.min(2, XEUtils.toNumber(sYOpts.oSize)),
          )
          scrollYStore.offsetSize = offsetYSize
          scrollYStore.visibleSize = visibleYSize
          scrollYStore.endIndex = Math.max(
            scrollYStore.startIndex,
            visibleYSize + offsetYSize,
            scrollYStore.endIndex,
          )
          updateYData()
        } else {
          updateYSpace()
        }
      })
    }

    const handleScrollToOption = (option: any, isDwArrow?: boolean) => {
      const { scrollYLoad } = reactData
      const { optFullValMaps, scrollYStore } = internalData
      const valueField = computeValueField.value
      const cacheItem = optFullValMaps[option[valueField]]
      if (cacheItem) {
        const optid = cacheItem.key
        const avIndex = cacheItem._index
        if (avIndex > -1) {
          const optWrapperElem = refVirtualWrapper.value
          const panelElem = refOptionPanel.value
          const optElem = panelElem.querySelector(
            `[optid='${optid}']`,
          ) as HTMLElement
          if (optWrapperElem) {
            if (optElem) {
              const wrapperHeight = optWrapperElem.offsetHeight
              const offsetPadding = 1
              if (isDwArrow) {
                if (
                  optElem.offsetTop +
                    optElem.offsetHeight -
                    optWrapperElem.scrollTop >
                  wrapperHeight
                ) {
                  optWrapperElem.scrollTop =
                    optElem.offsetTop + optElem.offsetHeight - wrapperHeight
                } else if (
                  optElem.offsetTop + offsetPadding <
                    optWrapperElem.scrollTop ||
                  optElem.offsetTop + offsetPadding >
                    optWrapperElem.scrollTop + optWrapperElem.clientHeight
                ) {
                  optWrapperElem.scrollTop = optElem.offsetTop - offsetPadding
                }
              } else {
                if (
                  optElem.offsetTop + offsetPadding <
                    optWrapperElem.scrollTop ||
                  optElem.offsetTop + offsetPadding >
                    optWrapperElem.scrollTop + optWrapperElem.clientHeight
                ) {
                  optWrapperElem.scrollTop = optElem.offsetTop - offsetPadding
                } else if (
                  optElem.offsetTop +
                    optElem.offsetHeight -
                    optWrapperElem.scrollTop >
                  wrapperHeight
                ) {
                  optWrapperElem.scrollTop =
                    optElem.offsetTop + optElem.offsetHeight - wrapperHeight
                }
              }
            } else if (scrollYLoad) {
              if (isDwArrow) {
                optWrapperElem.scrollTop =
                  avIndex * scrollYStore.rowHeight -
                  optWrapperElem.clientHeight +
                  scrollYStore.rowHeight
              } else {
                optWrapperElem.scrollTop = avIndex * scrollYStore.rowHeight
              }
            }
          }
        }
      }
    }

    /**
     * 如果有滚动条，则滚动到对应的位置
     * @param {Number} scrollLeft 左距离
     * @param {Number} scrollTop 上距离
     */
    const scrollTo = (scrollLeft: number | null, scrollTop?: number | null) => {
      const scrollBodyElem = refVirtualWrapper.value
      if (scrollBodyElem) {
        if (XEUtils.isNumber(scrollLeft)) {
          scrollBodyElem.scrollLeft = scrollLeft
        }
        if (XEUtils.isNumber(scrollTop)) {
          scrollBodyElem.scrollTop = scrollTop
        }
      }
      if (reactData.scrollYLoad) {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            nextTick(() => {
              resolve()
            })
          }, 50)
        })
      }
      return nextTick()
    }

    /**
     * 刷新滚动条
     */
    const refreshScroll = () => {
      const { lastScrollLeft, lastScrollTop } = internalData
      return clearScroll().then(() => {
        if (lastScrollLeft || lastScrollTop) {
          internalData.lastScrollLeft = 0
          internalData.lastScrollTop = 0
          return scrollTo(lastScrollLeft, lastScrollTop)
        }
      })
    }

    /**
     * 重新计算列表
     */
    const recalculate = () => {
      const el = refElem.value
      if (el && el.clientWidth && el.clientHeight) {
        return computeScrollLoad()
      }
      return Promise.resolve()
    }

    const loadYData = (evnt: Event) => {
      const { scrollYStore } = internalData
      const {
        startIndex,
        endIndex,
        visibleSize,
        offsetSize,
        rowHeight,
      } = scrollYStore
      const scrollBodyElem = evnt.target as HTMLDivElement
      const scrollTop = scrollBodyElem.scrollTop
      const toVisibleIndex = Math.floor(scrollTop / rowHeight)
      const offsetStartIndex = Math.max(0, toVisibleIndex - 1 - offsetSize)
      const offsetEndIndex = toVisibleIndex + visibleSize + offsetSize
      if (
        toVisibleIndex <= startIndex ||
        toVisibleIndex >= endIndex - visibleSize - 1
      ) {
        if (startIndex !== offsetStartIndex || endIndex !== offsetEndIndex) {
          scrollYStore.startIndex = offsetStartIndex
          scrollYStore.endIndex = offsetEndIndex
          updateYData()
        }
      }
    }

    // 滚动、拖动过程中不需要触发
    const isVMScrollProcess = () => {
      const delayHover = 250
      const { lastScrollTime } = internalData
      return !!(lastScrollTime && Date.now() < lastScrollTime + delayHover)
    }

    const scrollEvent = (evnt: Event) => {
      const scrollBodyElem = evnt.target as HTMLDivElement
      const scrollTop = scrollBodyElem.scrollTop
      const scrollLeft = scrollBodyElem.scrollLeft
      const isX = scrollLeft !== internalData.lastScrollLeft
      const isY = scrollTop !== internalData.lastScrollTop
      internalData.lastScrollTop = scrollTop
      internalData.lastScrollLeft = scrollLeft
      if (reactData.scrollYLoad) {
        loadYData(evnt)
      }
      internalData.lastScrollTime = Date.now()
      dispatchEvent('scroll', { scrollLeft, scrollTop, isX, isY }, evnt)
    }

    /**
     * 加载数据
     * @param {Array} datas 数据
     */
    const loadData = (datas: any[]) => {
      cacheItemMap(datas || [])
      const { isLoaded, fullData, scrollYStore } = internalData
      const defaultOpts = computeDefaultOpts.value
      const sYOpts = computeSYOpts.value
      const valueField = computeValueField.value
      Object.assign(scrollYStore, {
        startIndex: 0,
        endIndex: 1,
        visibleSize: 0,
      })
      internalData.synchData = datas || []
      // 如果gt为0，则总是启用
      reactData.scrollYLoad =
        !!sYOpts.enabled &&
        sYOpts.gt > -1 &&
        (sYOpts.gt === 0 || sYOpts.gt <= fullData.length)
      handleData()
      if (!isLoaded) {
        const { selectMode } = defaultOpts
        if (datas.length > 0 && XEUtils.eqNull(props.modelValue)) {
          if (selectMode === 'first' || selectMode === 'last') {
            const selectItem = XEUtils[selectMode](datas)
            if (selectItem) {
              nextTick(() => {
                if (XEUtils.eqNull(props.modelValue)) {
                  emitModel(selectItem[valueField])
                }
              })
            }
          }
          internalData.isLoaded = true
        }
      }
      return computeScrollLoad().then(() => {
        refreshScroll()
      })
    }

    const clearScroll = () => {
      const scrollBodyElem = refVirtualWrapper.value
      if (scrollBodyElem) {
        scrollBodyElem.scrollTop = 0
        scrollBodyElem.scrollLeft = 0
      }
      internalData.lastScrollTop = 0
      internalData.lastScrollLeft = 0
      return nextTick()
    }

    const hasOptGroupById = (optid: any) => {
      const { optGroupKeyMaps } = internalData
      return !!optGroupKeyMaps[optid]
    }

    const selectMethods: SelectMethods = {
      dispatchEvent,
      loadData,
      reloadData(datas) {
        internalData.isLoaded = false
        clearScroll()
        return loadData(datas)
      },
      isPanelVisible() {
        return reactData.visiblePanel
      },
      togglePanel() {
        if (reactData.visiblePanel) {
          hideOptionPanel()
        } else {
          showOptionPanel()
        }
        return nextTick()
      },
      hidePanel() {
        if (reactData.visiblePanel) {
          hideOptionPanel()
        }
        return nextTick()
      },
      showPanel() {
        if (!reactData.visiblePanel) {
          showOptionPanel()
        }
        return nextTick()
      },
      refreshOption() {
        handleOption()
        updateYData()
        return nextTick()
      },
      focus() {
        const $input = refInput.value
        reactData.isActivated = true
        // $input.blur()
        $input.focus() //
        return nextTick()
      },
      blur() {
        const $input = refInput.value
        $input.blur()
        reactData.isActivated = false
        return nextTick()
      },
      recalculate,
      clearScroll,
    }

    Object.assign($xeSelect, selectMethods)

    const renderOption = (list: VxeOptionProps[], group?: VxeOptgroupProps) => {
      const { allowCreate, optionKey, modelValue } = props
      const { currentOption } = reactData
      const { optAddMaps } = internalData
      const optionOpts = computeOptionOpts.value
      const labelField = computeLabelField.value
      const valueField = computeValueField.value
      const groupLabelField = computeGroupLabelField.value
      const { useKey } = optionOpts
      const optionSlot = slots.option
      return list.map((option, cIndex) => {
        const { slots, className } = option
        const optid = getOptId(option)
        const optionValue = option[valueField as 'value']
        const isOptGroup = hasOptGroupById(optid)
        const isAdd = !!(allowCreate && optAddMaps[optid])
        const isSelected =
          !isAdd &&
          (XEUtils.isArray(modelValue)
            ? modelValue.indexOf(optionValue) > -1
            : modelValue === optionValue)
        const isVisible = isAdd || !isOptGroup || isOptionVisible(option)
        const isDisabled =
          !isAdd && checkOptionDisabled(isSelected, option, group)
        const defaultSlot = slots ? slots.default : null
        const optParams = { option, group: null, $select: $xeSelect }
        const optVNs = optionSlot
          ? callSlot(optionSlot, optParams)
          : defaultSlot
          ? callSlot(defaultSlot, optParams)
          : getFuncText(
              option[(isOptGroup ? groupLabelField : labelField) as 'label'],
            )
        return isVisible
          ? h(
              'div',
              {
                key: useKey || optionKey ? optid : cIndex,
                class: [
                  'vxe-select-option',
                  className
                    ? XEUtils.isFunction(className)
                      ? className(optParams)
                      : className
                    : '',
                  {
                    'vxe-select-optgroup': isOptGroup,
                    'is--disabled': isDisabled,
                    'is--selected': isSelected,
                    'is--add': isAdd,
                    'is--hover':
                      currentOption && getOptId(currentOption) === optid,
                  },
                ],
                // attrs
                optid: optid,
                // event
                onMousedown: (evnt: MouseEvent) => {
                  const isLeftBtn = evnt.button === 0
                  if (isLeftBtn) {
                    evnt.stopPropagation()
                  }
                },
                onClick: (evnt: MouseEvent) => {
                  if (!isDisabled && !isOptGroup) {
                    changeOptionEvent(evnt, option)
                  }
                },
                onMouseenter: () => {
                  if (!isDisabled && !isOptGroup && !isVMScrollProcess()) {
                    setCurrentOption(option)
                  }
                },
              },
              allowCreate
                ? [
                    h(
                      'span',
                      {
                        key: 1,
                        class: 'vxe-select-option--label',
                      },
                      optVNs,
                    ),
                    isAdd
                      ? h(
                          'span',
                          {
                            key: 2,
                            class: 'vxe-select-option--add-icon',
                          },
                          [
                            h('i', {
                              class: getIcon().ADD_OPTION,
                            }),
                          ],
                        )
                      : renderEmptyElement($xeSelect),
                  ]
                : optVNs,
            )
          : renderEmptyElement($xeSelect)
      })
    }

    const renderOpts = () => {
      const { optList, searchLoading } = reactData
      if (searchLoading) {
        return [
          h(
            'div',
            {
              class: 'vxe-select--search-loading',
            },
            [
              h('i', {
                class: ['vxe-select--search-icon', getIcon().SELECT_LOADED],
              }),
              h(
                'span',
                {
                  class: 'vxe-select--search-text',
                },
                getI18n('vxe.select.loadingText'),
              ),
            ],
          ),
        ]
      }
      if (optList.length) {
        return renderOption(optList)
      }
      return [
        h(
          'div',
          {
            class: 'vxe-select--empty-placeholder',
          },
          props.emptyText || getI18n('vxe.select.emptyText'),
        ),
      ]
    }

    const renderVN = () => {
      const { className, popupClassName, loading, filterable } = props
      const {
        initialized,
        isActivated,
        isAniVisible,
        visiblePanel,
        bodyHeight,
        topSpaceHeight,
      } = reactData
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const selectLabel = computeSelectLabel.value
      const btnTransfer = computeBtnTransfer.value
      const formReadonly = computeFormReadonly.value
      const inpPlaceholder = computeInpPlaceholder.value
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const prefixSlot = slots.prefix
      if (formReadonly) {
        return h(
          'div',
          {
            ref: refElem,
            class: ['vxe-select--readonly', className],
          },
          [
            h(
              'div',
              {
                class: 'vxe-select-slots',
                ref: 'hideOption',
              },
              defaultSlot ? defaultSlot({}) : [],
            ),
            h(
              'span',
              {
                class: 'vxe-select-label',
              },
              selectLabel,
            ),
          ],
        )
      }
      return h(
        'div',
        {
          ref: refElem,
          class: [
            'vxe-select',
            className
              ? XEUtils.isFunction(className)
                ? className({ $select: $xeSelect })
                : className
              : '',
            {
              [`size--${vSize}`]: vSize,
              'is--visible': visiblePanel,
              'is--disabled': isDisabled,
              'is--filter': filterable,
              'is--loading': loading,
              'is--active': isActivated,
            },
          ],
        },
        [
          h(
            'div',
            {
              class: 'vxe-select-slots',
              ref: 'hideOption',
            },
            defaultSlot ? defaultSlot({}) : [],
          ),
          h(
            VxeInputComponent,
            {
              style: {
                height: '100%',
              },
              ref: refInput,
              clearable: props.clearable,
              placeholder: inpPlaceholder,
              readonly: false, //
              disabled: isDisabled,
              type: 'text',
              prefixIcon: props.prefixIcon,
              suffixIcon: loading
                ? getIcon().SELECT_LOADED
                : visiblePanel
                ? getIcon().SELECT_OPEN
                : getIcon().SELECT_CLOSE,
              autoFocus: false,
              modelValue: selectLabel,
              onClear: clearEvent,
              onClick: clickEvent,
              onChange: inputChangeEvent,
              onFocus: focusEvent,
              onBlur: blurEvent,
              onSuffixClick: suffixClickEvent,
            },
            prefixSlot
              ? {
                  prefix: () => prefixSlot({}),
                }
              : {},
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
                  ref: refOptionPanel,
                  class: [
                    'vxe-table--ignore-clear vxe-select--panel',
                    popupClassName
                      ? XEUtils.isFunction(popupClassName)
                        ? popupClassName({ $select: $xeSelect })
                        : popupClassName
                      : '',
                    {
                      [`size--${vSize}`]: vSize,
                      'is--transfer': btnTransfer,
                      'ani--leave': !loading && isAniVisible,
                      'ani--enter': !loading && visiblePanel,
                    },
                  ],
                  placement: reactData.panelPlacement,
                  style: reactData.panelStyle,
                },
                initialized && (visiblePanel || isAniVisible)
                  ? [
                      h(
                        'div',
                        {
                          class: 'vxe-select--panel-wrapper',
                        },
                        [
                          filterable
                            ? h(
                                'div',
                                {
                                  class: 'vxe-select--panel-search',
                                },
                                [
                                  h(VxeInputComponent, {
                                    ref: refInpSearch,
                                    class: 'vxe-select-search--input',
                                    modelValue: reactData.searchValue,
                                    clearable: true,
                                    disabled: false,
                                    readonly: false,
                                    placeholder: getI18n('vxe.select.search'),
                                    prefixIcon: getIcon().INPUT_SEARCH,
                                    'onUpdate:modelValue': modelSearchEvent,
                                    onFocus: focusSearchEvent,
                                    onChange: triggerSearchEvent,
                                    onSearch: triggerSearchEvent,
                                  }),
                                ],
                              )
                            : renderEmptyElement($xeSelect),
                          headerSlot
                            ? h(
                                'div',
                                {
                                  class: 'vxe-select--panel-header',
                                },
                                headerSlot({}),
                              )
                            : renderEmptyElement($xeSelect),
                          h(
                            'div',
                            {
                              class: 'vxe-select--panel-body',
                            },
                            [
                              h(
                                'div',
                                {
                                  ref: refVirtualWrapper,
                                  class: 'vxe-select-option--wrapper',
                                  onScroll: scrollEvent,
                                },
                                [
                                  h('div', {
                                    class: 'vxe-select--y-space',
                                    style: {
                                      height: bodyHeight
                                        ? `${bodyHeight}px`
                                        : '',
                                    },
                                  }),
                                  h(
                                    'div',
                                    {
                                      ref: refVirtualBody,
                                      class: 'vxe-select--body',
                                      style: {
                                        marginTop: topSpaceHeight
                                          ? `${topSpaceHeight}px`
                                          : '',
                                      },
                                    },
                                    renderOpts(),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          footerSlot
                            ? h(
                                'div',
                                {
                                  class: 'vxe-select--panel-footer',
                                },
                                footerSlot({}),
                              )
                            : renderEmptyElement($xeSelect),
                        ],
                      ),
                    ]
                  : [],
              ),
            ],
          ),
        ],
      )
    }

    watch(
      () => reactData.staticOptions,
      (val) => {
        loadData(val)
      },
    )

    watch(
      () => props.options,
      (val) => {
        loadData(val || [])
      },
    )

    watch(
      () => props.optionGroups,
      (val) => {
        loadData(val || [])
      },
    )

    onMounted(() => {
      nextTick(() => {
        const { options, optionGroups } = props
        if (optionGroups) {
          loadData(optionGroups)
        } else if (options) {
          loadData(options)
        }
      })
      globalEvents.on($xeSelect, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xeSelect, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeSelect, 'keydown', handleGlobalKeydownEvent)
      globalEvents.on($xeSelect, 'blur', handleGlobalBlurEvent)
    })

    onUnmounted(() => {
      globalEvents.off($xeSelect, 'mousewheel')
      globalEvents.off($xeSelect, 'mousedown')
      globalEvents.off($xeSelect, 'keydown')
      globalEvents.off($xeSelect, 'blur')
    })

    provide('$xeSelect', $xeSelect)

    $xeSelect.renderVN = renderVN

    return $xeSelect
  },
  render() {
    return this.renderVN()
  },
})
