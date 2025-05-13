import { defineComponent, PropType } from 'vue'
import { getConfig, VxeUploadProps, VxeUploadPropTypes } from 'vxe-pc-ui'
import XEUtils from 'xe-utils'
import { UpLoad } from './upload'
import VxeUpload from './xeUpload'
export default defineComponent({
  components: {
    VxeUpload,
  }, //
  props: {
    modelValue: [Array, String, Object] as PropType<
      VxeUploadPropTypes.ModelValue
    >,
    showList: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowList>,
      default: () => getConfig().upload.showList,
    },
    moreConfig: Object as PropType<VxeUploadPropTypes.MoreConfig>,
    readonly: {
      type: Boolean as PropType<VxeUploadPropTypes.Readonly>,
      default: null,
    },
    disabled: {
      type: Boolean as PropType<VxeUploadPropTypes.Disabled>,
      default: null,
    },
    mode: {
      type: String as PropType<VxeUploadPropTypes.Mode>,
      default: () => getConfig().upload.mode,
    },
    imageTypes: {
      type: Array as PropType<VxeUploadPropTypes.ImageTypes>,
      default: () => XEUtils.clone(getConfig().upload.imageTypes, true),
    },
    imageConfig: {
      type: Object as PropType<VxeUploadPropTypes.ImageConfig>,
      default: () => XEUtils.clone(getConfig().upload.imageConfig, true),
    },
    /**
     * 已废弃，被 image-config 替换
     * @deprecated
     */
    imageStyle: {
      type: Object as PropType<VxeUploadPropTypes.ImageStyle>,
      default: () => XEUtils.clone(getConfig().upload.imageStyle, true),
    },
    fileTypes: {
      type: Array as PropType<VxeUploadPropTypes.FileTypes>,
      default: () => XEUtils.clone(getConfig().upload.fileTypes, true),
    },
    dragSort: Boolean as PropType<VxeUploadPropTypes.DragSort>,
    dragToUpload: {
      type: Boolean as PropType<VxeUploadPropTypes.DragToUpload>,
      default: () => XEUtils.clone(getConfig().upload.dragToUpload, true),
    },
    pasteToUpload: {
      type: Boolean as PropType<VxeUploadPropTypes.PasteToUpload>,
      default: () => XEUtils.clone(getConfig().upload.pasteToUpload, true),
    },
    keyField: String as PropType<VxeUploadPropTypes.KeyField>,
    singleMode: Boolean as PropType<VxeUploadPropTypes.SingleMode>,
    urlMode: Boolean as PropType<VxeUploadPropTypes.UrlMode>,
    multiple: Boolean as PropType<VxeUploadPropTypes.Multiple>,
    limitSize: {
      type: [String, Number] as PropType<VxeUploadPropTypes.LimitSize>,
      default: () => getConfig().upload.limitSize,
    },
    showLimitSize: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowLimitSize>,
      default: () => getConfig().upload.showLimitSize,
    },
    limitSizeText: {
      type: [String, Number, Function] as PropType<
        VxeUploadPropTypes.LimitSizeText
      >,
      default: () => getConfig().upload.limitSizeText,
    },
    limitCount: {
      type: [String, Number] as PropType<VxeUploadPropTypes.LimitCount>,
      default: () => getConfig().upload.limitCount,
    },
    showLimitCount: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowLimitCount>,
      default: () => getConfig().upload.showLimitCount,
    },
    limitCountText: {
      type: [String, Number, Function] as PropType<
        VxeUploadPropTypes.LimitCountText
      >,
      default: () => getConfig().upload.limitCountText,
    },
    nameField: {
      type: String as PropType<VxeUploadPropTypes.NameField>,
      default: () => getConfig().upload.nameField,
    },
    typeField: {
      type: String as PropType<VxeUploadPropTypes.TypeField>,
      default: () => getConfig().upload.typeField,
    },
    urlField: {
      type: String as PropType<VxeUploadPropTypes.UrlField>,
      default: () => getConfig().upload.urlField,
    },
    sizeField: {
      type: String as PropType<VxeUploadPropTypes.SizeField>,
      default: () => getConfig().upload.sizeField,
    },
    showErrorStatus: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowErrorStatus>,
      default: () => getConfig().upload.showErrorStatus,
    },
    showProgress: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowProgress>,
      default: () => getConfig().upload.showProgress,
    },
    progressText: {
      type: [String, Number, Function] as PropType<
        VxeUploadPropTypes.ProgressText
      >,
      default: () => getConfig().upload.progressText,
    },
    autoHiddenButton: {
      type: Boolean as PropType<VxeUploadPropTypes.AutoHiddenButton>,
      default: () => getConfig().upload.autoHiddenButton,
    },
    showUploadButton: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowUploadButton>,
      default: () => getConfig().upload.showUploadButton,
    },
    buttonText: {
      type: [String, Number, Function] as PropType<
        VxeUploadPropTypes.ButtonText
      >,
      default: () => getConfig().upload.buttonText,
    },
    buttonIcon: {
      type: String as PropType<VxeUploadPropTypes.ButtonIcon>,
      default: () => getConfig().upload.buttonIcon,
    },
    showButtonText: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowButtonText>,
      default: () => getConfig().upload.showButtonText,
    },
    showButtonIcon: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowButtonIcon>,
      default: () => getConfig().upload.showButtonIcon,
    },
    showRemoveButton: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowRemoveButton>,
      default: () => getConfig().upload.showRemoveButton,
    },
    showDownloadButton: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowDownloadButton>,
      default: () => getConfig().upload.showDownloadButton,
    },
    showPreview: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowPreview>,
      default: () => getConfig().upload.showPreview,
    },
    showTip: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowTip>,
      default: () => null,
    },
    tipText: [String, Number, Function] as PropType<VxeUploadPropTypes.TipText>,
    hintText: String as PropType<VxeUploadPropTypes.HintText>,
    previewMethod: Function as PropType<VxeUploadPropTypes.PreviewMethod>,
    uploadMethod: Function as PropType<VxeUploadPropTypes.UploadMethod>,
    beforeRemoveMethod: Function as PropType<
      VxeUploadPropTypes.BeforeRemoveMethod
    >,
    removeMethod: Function as PropType<VxeUploadPropTypes.RemoveMethod>,
    beforeDownloadMethod: Function as PropType<
      VxeUploadPropTypes.BeforeDownloadMethod
    >,
    downloadMethod: Function as PropType<VxeUploadPropTypes.DownloadMethod>,
    getUrlMethod: Function as PropType<VxeUploadPropTypes.GetUrlMethod>,
    getThumbnailUrlMethod: Function as PropType<
      VxeUploadPropTypes.GetThumbnailUrlMethod
    >,
    size: {
      type: String as PropType<VxeUploadPropTypes.Size>,
      default: () => getConfig().upload.size || getConfig().size,
    },
  },
  setup(props, ctx) {
    let _upload = new UpLoad(props)
    return () => {
      let com = (
        <VxeUpload
          {..._upload.config}
          uploadMethod={(config) => {
            return _upload.upload(config)
          }}
          mode="image"
        ></VxeUpload>
      ) //
      return com //
    }
  },
})
