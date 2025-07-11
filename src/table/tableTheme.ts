import { ITableThemeDefine } from '@visactor/vtable/es/ts-types'
import { Table } from './table'

export const createTheme = (table: Table) => {
  let selectStyle = null
  if (table?.config?.hiddenSelect) {
    selectStyle = {
      cellBgColor: 'rgba(0, 0, 255,0.0)',
      cellBorderColor: 'rgba(0, 0, 255, 0)',
      // cellBorderColor:'rgba(0, 0, 255, 0)',
      cellBorderLineWidth: 2,
      selectionFillMode: 'overlay',
    } //
  } else {
    selectStyle = {
      cellBgColor: 'rgba(0, 0, 255,0.0)',
      cellBorderColor: 'rgba(69, 120, 169, 1)', //
      // cellBorderColor:'rgba(0, 0, 255, 0)',
      cellBorderLineWidth: 2,
      selectionFillMode: 'overlay',
    }
  }
  let obj: ITableThemeDefine = {
    defaultStyle: {
      //
      fontSize: 16,
      fontFamily: 'Arial,sans-serif',
      bgColor: 'RGB(248, 248, 248)',
      color: '#000',
      borderColor: 'RGB(236, 241, 245)',
      // borderLineWidth: 1,
      borderLineDash: [],
      padding: [10, 16, 10, 16],
      textAlign: 'left',
      textBaseline: 'middle',
      textOverflow: 'ellipsis',
      autoWrapText: false,
      lineClamp: 'auto',
      linkColor: '#3772ff',
      cursor: 'auto',
      marked: false,
      underline: false,
      lineThrough: false,
    },

    headerStyle: {
      fontSize: 16,
      fontFamily: 'Arial,sans-serif',
      fontWeight: 'bold',
      bgColor: '#ECF1F5',
      color: '#000',
      borderColor: '#E1E4E8',
      borderLineWidth: 1,
      borderLineDash: [],
      hover: {
        cellBgColor: '#CCE0FF',
        inlineColumnBgColor: '#F3F8FF',
        inlineRowBgColor: '#F3F8FF',
      },
      select: {
        // inlineColumnBgColor: 'rgba(26, 26, 255, 0.1)',
        // inlineRowBgColor: 'rgba(26, 26, 255, 0.1)',
        inlineColumnBgColor: 'rgba(0, 0, 0, 0)',
        inlineRowBgColor: 'rgba(0, 0, 0, 0)',
      },
      padding: [10, 16, 10, 16],
      textAlign: 'left',
      textBaseline: 'middle',
      textOverflow: 'ellipsis',
      autoWrapText: false,
      lineClamp: 'auto',
      linkColor: '#3772ff',
      cursor: 'auto',
      marked: false,
      underline: false,
      lineThrough: false,
    },
    cornerHeaderStyle: {
      fontSize: 16,
      fontFamily: 'Arial,sans-serif',
      fontWeight: 'bold',
      bgColor: '#ECF1F5',
      color: '#000',
      borderColor: '#E1E4E8',
      borderLineWidth: 1,
      borderLineDash: [],
      select: {
        // inlineColumnBgColor: 'rgba(26, 26, 255, 0.1)',
        // inlineRowBgColor: 'rgba(26, 26, 255, 0.1)',
        inlineColumnBgColor: 'rgba(26, 26, 255, 0)',
        inlineRowBgColor: 'rgba(26, 26, 255, 0)',
      },
      padding: [10, 16, 10, 16],
      textAlign: 'left',
      textBaseline: 'middle',
      textOverflow: 'ellipsis',
      autoWrapText: false,
      lineClamp: 'auto',
      linkColor: '#3772ff',
      cursor: 'auto',
      marked: false,
      underline: false,
      lineThrough: false,
    },
    cornerRightTopCellStyle: null,
    cornerLeftBottomCellStyle: null,
    cornerRightBottomCellStyle: null,
    rightFrozenStyle: null,
    bottomFrozenStyle: null,

    rowHeaderStyle: {
      fontSize: 16,
      fontFamily: 'Arial,sans-serif',
      fontWeight: 'bold',
      bgColor: '#ECF1F5',
      color: '#000',
      borderColor: '#E1E4E8',
      borderLineWidth: 1,
      borderLineDash: [],
      hover: {
        cellBgColor: '#CCE0FF',
        inlineColumnBgColor: '#F3F8FF',
        inlineRowBgColor: '#F3F8FF',
      },
      select: {
        inlineColumnBgColor: 'rgba(26, 26, 255, 0.1)',
        inlineRowBgColor: 'rgba(26, 26, 255, 0.1)',
      },
      padding: [10, 16, 10, 16],
      textAlign: 'left',
      textBaseline: 'middle',
      textOverflow: 'ellipsis',
      autoWrapText: false,
      lineClamp: 'auto',
      linkColor: '#3772ff',
      cursor: 'auto',
      marked: false,
      underline: false,
      lineThrough: false,
    },
    bodyStyle: {
      // strokeColor: 'black',
      fontSize: 14,
      fontFamily: 'Arial,sans-serif',
      color: '#000',
      borderColor: '#E1E4E8',
      borderLineWidth: 1,
      borderLineDash: [],
      hover: {
        // cellBgColor: '#CCE0FF',
        // cellBgColor: '#000000',
        inlineColumnBgColor: '#F3F8FF',
        inlineRowBgColor: '#F3F8FF',
      },
      select: {
        inlineColumnBgColor: 'rgba(26, 26, 255, 0.0)',
        inlineRowBgColor: 'rgba(26, 26, 255, 0.0)',
      },
      padding: [10, 16, 10, 16], //
      textAlign: 'left',
      textBaseline: 'middle',
      textOverflow: 'ellipsis',
      autoWrapText: false,
      lineClamp: 'auto',
      linkColor: '#3772ff',
      cursor: 'auto',
      marked: false,
      underline: false,
      lineThrough: false,
    },
    groupTitleStyle: null,
    scrollStyle: {
      scrollSliderColor: '#C0C0C0',
      // visible: 'none', //
      horizontalVisible: 'none',
      verticalVisible: 'always',
      width: 7,
      hoverOn: true,
      barToSide: false,
      // horizontalPadding: 60, //
      // verticalPadding: 0,
    },
    tooltipStyle: null,
    frameStyle: {
      // borderColor: '#E1E4E8',
      // innerBorder: true,
      // borderColor:'red',
      // borderLineWidth: 1,
      borderLineWidth: 0,
      borderLineDash: [],
      shadowBlur: 0,
      shadowColor: 'black',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      cornerRadius: 0,
    },
    columnResize: {
      lineColor: '#416EFF',
      bgColor: '#D9E2FF',
      lineWidth: 1,
      width: 3,
      resizeHotSpotSize: 16,
      labelColor: '#FFF',
      labelFontSize: 10,
      labelFontFamily: 'sans-serif',
      labelBackgroundFill: '#3073F2',
      labelBackgroundCornerRadius: 5,
      labelVisible: true,
      visibleOnHover: false,
    },
    dragHeaderSplitLine: {
      lineColor: 'blue',
      lineWidth: 2,
      shadowBlockColor: 'rgba(204,204,204,0.3)',
    },
    frozenColumnLine: {
      shadow: {
        width: 3,
        startColor: 'rgba(225, 228, 232, 0.6)',
        endColor: 'rgba(225, 228, 232, 0.6)',
      },
    },
    selectionStyle: selectStyle,
    axisStyle: null,
    checkboxStyle: {},
    radioStyle: null,
    switchStyle: null,
    buttonStyle: null,
    textPopTipStyle: {
      visible: true,
      position: 'auto',
      padding: 8,
      titleStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        fill: '#4E5969',
      },
      contentStyle: {
        fontSize: 12,
        fill: '#4E5969',
      },
      panel: {
        visible: true,
        fill: '#fff',
        stroke: '#ffffff',
        lineWidth: 0,
        cornerRadius: 3,
        shadowBlur: 12,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        size: 0,
        space: 12,
      },
    },
  }
  return obj
}

export const createFooterTheme = (table?: any) => {
  let _theme = createTheme(table)
  _theme.scrollStyle.horizontalPadding = 0 //
  _theme.scrollStyle.visible = 'always'
  _theme.scrollStyle.verticalVisible = 'always' //
  _theme.scrollStyle.horizontalVisible = 'always'
  return _theme
}
