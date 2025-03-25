import { nanoid } from "nanoid"
import { reactive, shallowRef, toRaw } from "vue"
import { uniqueId } from 'xe-utils'
import { FormInstance } from 'element-plus'
import hooks from '@ER/hooks'
import { Base as _Base } from '@/base/base'

export const Base = _Base