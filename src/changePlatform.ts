import { system } from './system'

function getDeviceType(width: number): 'mobile' | 'tablet' | 'pc' {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'pc'
}

function onDeviceChange(callback: (type: 'mobile' | 'tablet' | 'pc') => void) {
  let currentType = getDeviceType(window.innerWidth)
  callback(currentType)

  window.addEventListener('resize', () => {
    const newType = getDeviceType(window.innerWidth)
    if (newType !== currentType) {
      currentType = newType
      callback(currentType)
    }
  })
}

// ✅ 使用示例
onDeviceChange((type) => {
  system.currentPlatform = type
})
