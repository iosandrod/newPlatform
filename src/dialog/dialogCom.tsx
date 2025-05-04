import ModalCom from './ModalCom'
import {
  defineComponent,
  h,
  Teleport,
  ref,
  Ref,
  inject,
  computed,
  reactive,
  provide,
  nextTick,
  watch,
  PropType,
  VNode,
  onMounted,
  onUnmounted,
  createCommentVNode,
} from 'vue'
import XEUtils from 'xe-utils'
// import { getDomNode, getEventTargetNode, toCssUnit } from '../../ui/src/dom'
import {
  getDomNode,
  getEventTargetNode,
  toCssUnit,
} from 'vxe-pc-ui/packages/ui/src/dom'
// import { getLastZIndex, nextZIndex, getFuncText, handleBooleanDefaultValue } from '../../ui/src/utils'
import {
  getLastZIndex,
  nextZIndex,
  getFuncText,
  handleBooleanDefaultValue,
} from 'vxe-pc-ui/packages/ui/src/utils'
import {
  VxeUI,
  getConfig,
  getIcon,
  getI18n,
  globalEvents,
  GLOBAL_EVENT_KEYS,
  createEvent,
  useSize,
} from 'vxe-pc-ui/packages/ui'
import VxeButtonComponent from 'vxe-pc-ui/packages/button/src/button'
import VxeLoadingComponent from 'vxe-pc-ui/packages/loading/index'
// import { getSlotVNs } from '../../ui/src/vn'
import { getSlotVNs } from 'vxe-pc-ui/packages/ui/src/vn'
// import { warnLog, errLog } from '../../ui/src/log'
import { warnLog, errLog } from 'vxe-pc-ui/packages/ui/src/log'

import type {
  VxeModalConstructor,
  VxeModalPropTypes,
  ModalReactData,
  ModalInternalData,
  VxeModalEmits,
  VxeModalPrivateComputed,
  ModalEventTypes,
  VxeButtonInstance,
  ModalMethods,
  ModalPrivateRef,
  VxeModalMethods,
  ValueOf,
  VxeDrawerConstructor,
  VxeDrawerMethods,
  VxeFormConstructor,
  VxeFormPrivateMethods,
} from 'vxe-pc-ui/types'
// import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'
import type {
  VxeTableConstructor,
  VxeTablePrivateMethods,
} from 'vxe-pc-ui/types/components/table'
import { Dialog } from './dialog'
import { PageDesign } from '@ER/pageDesign'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
export const getDialogDefaultProps = () => {
  return {
    modelValue: Boolean as PropType<VxeModalPropTypes.ModelValue>,
    id: String as PropType<VxeModalPropTypes.ID>,
    type: {
      type: String as PropType<VxeModalPropTypes.Type>,
      default: 'modal',
    },
    loading: {
      type: Boolean as PropType<VxeModalPropTypes.Loading>,
      default: null,
    },
    status: String as PropType<VxeModalPropTypes.Status>,
    iconStatus: String as PropType<VxeModalPropTypes.IconStatus>,
    className: String as PropType<VxeModalPropTypes.ClassName>,
    top: {
      type: [Number, String] as PropType<VxeModalPropTypes.Top>,
      default: () => getConfig().modal.top,
    },
    position: [String, Object] as PropType<VxeModalPropTypes.Position>,
    title: String as PropType<VxeModalPropTypes.Title>,
    duration: {
      type: [Number, String] as PropType<VxeModalPropTypes.Duration>,
      default: () => getConfig().modal.duration,
    },
    content: [Number, String] as PropType<VxeModalPropTypes.Content>,
    showCancelButton: {
      type: Boolean as PropType<VxeModalPropTypes.ShowCancelButton>,
      default: null,
    },
    cancelButtonText: {
      type: String as PropType<VxeModalPropTypes.CancelButtonText>,
      default: () => getConfig().modal.cancelButtonText,
    },
    showConfirmButton: {
      type: Boolean as PropType<VxeModalPropTypes.ShowConfirmButton>,
      default: () => getConfig().modal.showConfirmButton,
    },
    confirmButtonText: {
      type: String as PropType<VxeModalPropTypes.ConfirmButtonText>,
      default: () => getConfig().modal.confirmButtonText,
    },
    lockView: {
      type: Boolean as PropType<VxeModalPropTypes.LockView>,
      default: () => getConfig().modal.lockView,
    },
    lockScroll: Boolean as PropType<VxeModalPropTypes.LockScroll>,
    mask: {
      type: Boolean as PropType<VxeModalPropTypes.Mask>,
      default: () => getConfig().modal.mask,
    },
    maskClosable: {
      type: Boolean as PropType<VxeModalPropTypes.MaskClosable>,
      default: () => getConfig().modal.maskClosable,
    },
    escClosable: {
      type: Boolean as PropType<VxeModalPropTypes.EscClosable>,
      default: () => getConfig().modal.escClosable,
    },
    cancelClosable: {
      type: Boolean as PropType<VxeModalPropTypes.CancelClosable>,
      default: () => getConfig().modal.cancelClosable,
    },
    confirmClosable: {
      type: Boolean as PropType<VxeModalPropTypes.ConfirmClosable>,
      default: () => getConfig().modal.confirmClosable,
    },
    resize: Boolean as PropType<VxeModalPropTypes.Resize>,
    showHeader: {
      type: Boolean as PropType<VxeModalPropTypes.ShowHeader>,
      default: () => getConfig().modal.showHeader,
    },
    showFooter: {
      type: Boolean as PropType<VxeModalPropTypes.ShowFooter>,
      default: () => getConfig().modal.showFooter,
    },
    showZoom: Boolean as PropType<VxeModalPropTypes.ShowZoom>,
    zoomConfig: Object as PropType<VxeModalPropTypes.ZoomConfig>,
    showMaximize: {
      type: Boolean as PropType<VxeModalPropTypes.ShowMaximize>,
      default: () => handleBooleanDefaultValue(getConfig().modal.showMaximize),
    },
    showMinimize: {
      type: Boolean as PropType<VxeModalPropTypes.ShowMinimize>,
      default: () => handleBooleanDefaultValue(getConfig().modal.showMinimize),
    },
    showClose: {
      type: Boolean as PropType<VxeModalPropTypes.ShowClose>,
      default: () => getConfig().modal.showClose,
    },
    dblclickZoom: {
      type: Boolean as PropType<VxeModalPropTypes.DblclickZoom>,
      default: () => getConfig().modal.dblclickZoom,
    },
    width: [Number, String] as PropType<VxeModalPropTypes.Width>,
    height: [Number, String] as PropType<VxeModalPropTypes.Height>,
    minWidth: {
      type: [Number, String] as PropType<VxeModalPropTypes.MinWidth>,
      default: () => getConfig().modal.minWidth,
    },
    minHeight: {
      type: [Number, String] as PropType<VxeModalPropTypes.MinHeight>,
      default: () => getConfig().modal.minHeight,
    },
    zIndex: Number as PropType<VxeModalPropTypes.ZIndex>,
    marginSize: {
      type: [Number, String] as PropType<VxeModalPropTypes.MarginSize>,
      default: () => getConfig().modal.marginSize,
    },
    fullscreen: Boolean as PropType<VxeModalPropTypes.Fullscreen>,
    draggable: {
      type: Boolean as PropType<VxeModalPropTypes.Draggable>,
      default: () => getConfig().modal.draggable,
    },
    remember: {
      type: Boolean,
      default: () => getConfig().modal.remember,
    },
    destroyOnClose: {
      type: Boolean as PropType<VxeModalPropTypes.DestroyOnClose>,
      default: () => getConfig().modal.destroyOnClose,
    },
    showTitleOverflow: {
      type: Boolean as PropType<VxeModalPropTypes.ShowTitleOverflow>,
      default: () => getConfig().modal.showTitleOverflow,
    },
    transfer: {
      type: Boolean as PropType<VxeModalPropTypes.Transfer>,
      default: () => getConfig().modal.transfer,
    },
    storage: {
      type: Boolean as PropType<VxeModalPropTypes.Storage>,
      default: () => getConfig().modal.storage,
    },
    storageKey: {
      type: String as PropType<VxeModalPropTypes.StorageKey>,
      default: () => getConfig().modal.storageKey,
    },
    padding: {
      type: Boolean as PropType<VxeModalPropTypes.Padding>,
      default: () => getConfig().modal.padding,
    },
    size: {
      type: String as PropType<VxeModalPropTypes.Size>,
      default: () => getConfig().modal.size || getConfig().size,
    },
    beforeHideMethod: Function as PropType<VxeModalPropTypes.BeforeHideMethod>,
    slots: Object as PropType<VxeModalPropTypes.Slots>,

    /**
     * 已废弃
     * @deprecated
     */
    message: [Number, String] as PropType<VxeModalPropTypes.Message>,
    /**
     * 已废弃
     * @deprecated
     */
    animat: {
      type: Boolean as PropType<VxeModalPropTypes.Animat>,
      default: () => getConfig().modal.animat,
    },
    /*
     */
    onShow: {
      type: Function,
    },
    onHide: {
      type: Function,
    },
    onBeforeHide: {
      type: Function,
    },
    onConfirm: {
      type: Function,
    },
    onCancel: {
      type: Function,
    },
    onClose: {
      type: Function,
    },
    onZoom: {
      type: Function,
    },
    onResize: {
      type: Function,
    },
    onMove: {
      type: Function,
    },
    dialogIns: {
      type: Object,
    },
    createFn: {
      type: Function, //
    },
    createName: {},
    formConfig: {},
    tableConfig: {},
  } //
}
export const allActiveModals: VxeModalConstructor[] = []
export default defineComponent({
  name: 'DialogCom',
  emits: [
    'update:modelValue',
    'show',
    'hide',
    'before-hide',
    'close',
    'confirm',
    'cancel',
    'zoom',
    'resize',
    'move',
  ],
  components: {
    buttonGroupCom, //
    ModalCom, //
  },
  props: getDialogDefaultProps(), //
  setup(props, { slots, expose, emit }) {
    let _dialog: any = props.dialogIns //
    let dialog: Dialog = null as any
    if (_dialog != null) {
      dialog = _dialog
      let config = dialog.config
      Object.entries(props).forEach(([key, value]) => {
        //@ts-ignore
        let oldValue = config[key]
        if (oldValue == null) {
          config[key] = value
        }
      }) //
    } else {
      dialog = new Dialog(props)
    }
    expose({ _instance: dialog }) //
    let registerDialog = (e) => {
      dialog.registerRef('modal', e) //
    }
    let registerRoot = (e) => dialog.registerRef('root', e) //
    let registerInnerCom = (e) => dialog.registerRef('innerCom', e) ////
    return () => {
      let com = (
        <div>
          <ModalCom
            v-slots={{
              default: () => {
                let _com = slots?.default?.(dialog) //
                let insConfig = dialog.getInnerInstance()
                let component = null
                let props = null
                if (insConfig != null) {
                  component = insConfig.component
                  props = insConfig.props
                }
                if (_com == null) {
                  if (component) {
                    _com = (
                      <component ref={registerInnerCom} {...props}></component>
                    )
                  }
                } //
                let outCom = (
                  <div
                    class="w-full h-full"
                    onClick={(e) => {
                      // e.stopPropagation()
                      // e.preventDefault()
                    }}
                    ref={registerRoot}
                  >
                    {_com}
                  </div> //
                )
                return outCom
              },
              header: () => {
                let title = <div>{dialog.getTitle()}</div>
                let rightController = (
                  <div>
                    <div
                      class={['pointer']} //
                      onMousedown={(e: MouseEvent) => {
                        e.stopPropagation() //
                      }}
                      onClick={(e: MouseEvent) => {
                        dialog.close() ////
                      }}
                    >
                      X
                    </div>
                  </div>
                )
                let com = (
                  <div
                    class={[
                      'flex-row',
                      'justify-between',
                      'w-full',
                      'pl-20 pr-20',
                    ]}
                  >
                    {title}
                    {rightController}
                  </div>
                ) //
                return com
              },
              footer: () => {
                let btnG = (
                  <buttonGroupCom
                    buttonWidth={50}
                    items={[
                      {
                        label: '取消',
                        fn: () => {
                          // console.log('取消')
                          dialog.close() //
                        },
                      },
                      {
                        label: '确定',
                        fn: () => {
                          dialog.confirm() //
                        },
                      },
                    ]}
                  ></buttonGroupCom>
                )
                let com = <div class="flex-row justify-end">{btnG}</div> //
                return com //
              },
            }}
            {...props}
            modelValue={dialog.getModelValue()}
            ref={registerDialog}
            width={dialog.getWidth()}
            height={dialog.getHeight()}
            onHide={() => dialog.onVisibleChange(false)}
            onShow={() => dialog.onVisibleChange(true)}
            resize={true} //
            minHeight={dialog.getMinHeight()}
            minWidth={dialog.getMinWidth()}
            showFooter={true} //
          ></ModalCom>
        </div>
      )
      return com
    }
  },
}) //
