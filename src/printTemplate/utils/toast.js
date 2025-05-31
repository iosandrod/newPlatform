import Toast from '@/printTemplate/components/RoyUI/RoyToast'

export default function toast(message = '', type = 'warning', duration = 3000) {
  return Toast({
    status: type,
    message: message,
    duration: duration
  })
}
