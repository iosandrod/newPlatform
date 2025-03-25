import _ from 'lodash'
import * as useCss from './use-css'
import * as useLogic from './use-logic'
import * as useI18n from './use-i18n'
import * as useProps from './use-props'
import * as useTarget from './use-target'
import * as useHistory from './use-history'
import * as useFetch from './use-fetch'
import * as useNamespace from './use-namespace'
// const importModules = import.meta.glob('./*/index.js', { eager: true })
const modules = {
    ...useNamespace,
    ...useCss,
    ...useLogic,
    ...useI18n,
    ...useProps,
    ...useTarget,
    ...useHistory,
    ...useFetch
}
export default modules//