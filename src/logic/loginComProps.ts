import {
  Edge,
  Elements,
  EdgeTypesObject,
  NodeTypesObject,
  ConnectionMode,
  ConnectionLineType,
  ConnectionLineOptions,
  ValidConnectionFunc,
  SnapGrid,
  EdgeUpdatable,
  ViewportTransform,
  CoordinateExtent,
  CoordinateExtentRange,
  PanOnScrollMode,
  Connector,
  DefaultEdgeOptions,
} from '@vue-flow/core'
import { KeyFilter } from '@vueuse/core'
import { PropType, CSSProperties } from 'vue'
type PropOptions<T> = {
  default?: T
} & Omit<Partial<PropType<T>>, 'default'>
export const flowProps = {
  id: String,
  nodes: Array,
  edges: Array as PropType<Edge[]>,
  modelValue: Object as PropType<Elements<any, any, any, any>>,
  edgeTypes: Object as PropType<EdgeTypesObject>,
  nodeTypes: Object as PropType<NodeTypesObject>,
  connectionMode: String as PropType<ConnectionMode>,
  connectionLineType: [String, null] as PropType<ConnectionLineType | null>,
  connectionLineStyle: {
    default: undefined,
  } as PropOptions<CSSProperties | null>,
  connectionLineOptions: {
    default: undefined,
  } as PropOptions<ConnectionLineOptions>,
  connectionRadius: Number,
  isValidConnection: {
    default: undefined,
  } as PropOptions<ValidConnectionFunc | null>,
  deleteKeyCode: {
    default: undefined,
  } as PropOptions<KeyFilter | null>,
  selectionKeyCode: {
    default: undefined,
  } as PropOptions<false | KeyFilter | null>,
  multiSelectionKeyCode: {
    default: undefined,
  } as PropOptions<KeyFilter | null>,
  zoomActivationKeyCode: {
    default: undefined,
  } as PropOptions<KeyFilter | null>,
  panActivationKeyCode: {
    default: undefined,
  } as PropOptions<KeyFilter | null>,
  snapToGrid: {
    default: undefined,
  } as PropOptions<boolean>,
  snapGrid: {},
  onlyRenderVisibleElements: {
    default: undefined,
  } as PropOptions<boolean>,
  edgesUpdatable: {
    default: undefined,
  } as PropOptions<EdgeUpdatable>,
  nodesDraggable: {
    default: undefined,
  } as PropOptions<boolean>,
  nodesConnectable: {
    default: undefined,
  } as PropOptions<boolean>,
  nodeDragThreshold: Number,
  elementsSelectable: {
    default: undefined,
  } as PropOptions<boolean>,
  selectNodesOnDrag: {
    default: undefined,
  } as PropOptions<boolean>,
  panOnDrag: {
    default: undefined,
  } as PropOptions<boolean | number[]>,
  minZoom: Number,
  maxZoom: Number,
  defaultViewport: {},
  translateExtent: {},
  nodeExtent: [Array, Object] as PropType<
    CoordinateExtent | CoordinateExtentRange
  >,
  defaultMarkerColor: String,
  zoomOnScroll: {
    default: undefined,
  } as PropOptions<boolean>,
  zoomOnPinch: {
    default: undefined,
  } as PropOptions<boolean>,
  panOnScroll: {
    default: undefined,
  } as PropOptions<boolean>,
  panOnScrollSpeed: Number,
  panOnScrollMode: String as PropType<PanOnScrollMode>,
  paneClickDistance: Number,
  zoomOnDoubleClick: {
    default: undefined,
  } as PropOptions<boolean>,
  preventScrolling: {
    default: undefined,
  } as PropOptions<boolean>,
  selectionMode: String as PropType<SelectionMode>,
  edgeUpdaterRadius: Number,
  fitViewOnInit: {
    default: undefined,
  } as PropOptions<boolean>,
  connectOnClick: {
    default: undefined,
  } as PropOptions<boolean>,
  applyDefault: {
    default: undefined,
  } as PropOptions<boolean>,
  autoConnect: {
    default: undefined,
  } as PropOptions<boolean | Connector>,
  noDragClassName: String,
  noWheelClassName: String,
  noPanClassName: String,
  defaultEdgeOptions: Object as PropType<DefaultEdgeOptions>,
  elevateEdgesOnSelect: {
    default: undefined,
  } as PropOptions<boolean>,
  elevateNodesOnSelect: {
    default: undefined,
  } as PropOptions<boolean>,
  disableKeyboardA11y: {
    default: undefined,
  } as PropOptions<boolean>,
  edgesFocusable: {
    default: undefined,
  } as PropOptions<boolean>,
  nodesFocusable: {
    default: undefined,
  } as PropOptions<boolean>,
  autoPanOnConnect: {
    default: undefined,
  } as PropOptions<boolean>,
  autoPanOnNodeDrag: {
    default: undefined,
  } as PropOptions<boolean>,
  autoPanSpeed: Number,
}
