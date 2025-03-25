import { computed, inject } from 'vue'
import locale from '@ER/formEditor/locale/index'
import utils from '@ER/utils'
import { get, template, isEmpty } from 'lodash'

// const transferData = (lang, path, options = {}) => {
//   let result = ''
//   if (isEmpty(options)) {
//     result = get(locale[lang.value], path, '')
//   } else {
//     result = template(get(locale[lang.value], path, ''))(options)
//   }
//   return result
// }
export const useI18n = (props?:any) => {
  const ER = inject('Everright', { props })
  const lang = computed(() => {
    return ER.props.lang
  })
  return {
    lang,
    t (path, options?:any) {
      return utils.transferData(lang.value, path, locale, options)
    }
  }
}
