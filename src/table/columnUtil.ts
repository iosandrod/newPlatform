import {
  CheckBox,
  createGroup,
  createImage,
  createText,
} from '@visactor/vtable/es/vrender'
import { Column } from './column'
import { nextTick } from 'vue'
export function createTextArr(col: Column, value, globalValue) {
  let fSize = col.getFontSize()
  const items = []
  if (!globalValue) {
    // No highlight term: single default text
    items.push(
      createText({
        text: value,
        fontSize: fSize,
        fill: 'black',
        boundsPadding: [0, 0, 0, 0],
        lineDashOffset: 0,
      }),
    )
  } else {
    const reg = new RegExp(globalValue, 'gi')
    if (typeof value !== 'string') {
      //
      value = `${value}`
    }
    const matches = [...value.matchAll(reg)]

    if (matches.length === 0) {
      // No matches: fallback to full text
      items.push(
        createText({
          text: value,
          fontSize: fSize,
          fill: 'black',
          boundsPadding: [0, 0, 0, 0],
          lineDashOffset: 0,
        }),
      )
    } else {
      // Iterate matches, build prefix, highlight, suffix pieces
      let lastIndex = 0
      for (const match of matches) {
        const { index } = match
        const [text] = match

        // Add preceding text segment
        if (index > lastIndex) {
          items.push(
            createText({
              text: value.slice(lastIndex, index),
              fontSize: fSize,
              fill: 'black',
              boundsPadding: [0, 0, 0, 0],
              lineDashOffset: 0,
            }),
          )
        }

        // Add highlighted segment
        items.push(
          createText({
            text,
            fontSize: fSize,
            fill: 'red',
            boundsPadding: [0, 0, 0, 0],
            lineDashOffset: 0,
          }),
        )

        lastIndex = index + text.length
      }

      // Trailing segment
      if (lastIndex < value.length) {
        items.push(
          createText({
            text: value.slice(lastIndex),
            fontSize: fSize,
            fill: 'black',
            boundsPadding: [0, 0, 0, 0],
            lineDashOffset: 0,
          }),
        )
      }
    }
  }
  let _g = createGroup({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    cursor: 'pointer',
    alignItems: 'center',
    boundsPadding: [0, 0, 0, 0],
  })
  for (const item of items) {
    _g.add(item)
  } //
  _g.isText = true
  return _g //
}

export function createPreIcon(col: Column) {
  //
}

export function getLocalStrWidth(col: Column, value) {
  let _bounds = [0, 0, 0, 10]
  let fSize = col.getFontSize()
  let locationName = createText({
    text: `${value}`, //
    fontSize: fSize, //
    x: 0, //
    y: 0,
    fill: 'black',
    boundsPadding: _bounds, //
    lineDashOffset: 0,
  })
  let _width1 = locationName.clipedWidth
  return _width1
}

export function getExpandIcon(col: Column, record, height, width) {
  let _this = col
  let column = col
  let isTree = col.getIsTree()
  if (isTree) {
    let _g1 = createGroup({
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      height: height,
      //   width: width,
      x: 0,
      y: 0,
      overflow: 'hidden',
      cursor: 'pointer',
      alignItems: 'center',
      boundsPadding: [0, 0, 0, 0],
    })
    let _level = record['_level'] || 0
    let t = null
    t = _this.getExpandIcon(record['_expanded'])

    let _g2 = createGroup({
      width: 10,
      height: height / 2,
      x: 0,
      y: 0,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      overflow: 'hidden',
      alignItems: 'center',
    })
    if (record?.children?.length == 0) {
      t = null //
    }
    let icon = createImage({
      image: t,
      cursor: 'pointer',
      x: 0,
      y: 0, //
      width: 15, //
      height: 15, //
      overflow: 'hidden',
      fill: 'black',
      boundsPadding: [0, 0, 0, 0], //
      lineDashOffset: 0,
    })
    icon.isExpand = true
    icon.on('click', (args) => {
      column.table.isTreeIconClick = true //
      nextTick(() => {
        column.table.isTreeIconClick = false //
      })
    })
    _g2.add(icon)
    _g1.add(_g2)
    return _g1
  }
}

export const createImagesArr = (images,attrs) => {
  let _images = []
  for (const image of images) {
    _images.push(createImage({ image, ...attrs }))
  }
  return _images
}
