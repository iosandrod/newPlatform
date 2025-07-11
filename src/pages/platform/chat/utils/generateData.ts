import type { Message } from '@/chat/index'
import { generateUUID } from '@/chat/_utils'

export const contacts = [
  {
    id: 3,
    nickname: '梁宏达',
    avatar: 'https://github.com/kinggq/images/blob/main/liang.jpeg?raw=true',
    lastMessage: '老梁故事会下期节目已经准备好了',
    lastTime: 1691056800000,
    index: 'L',
    unread: 1,
  },
  {
    id: 1,
    nickname: '王局',
    avatar: 'https://github.com/kinggq/images/blob/main/wang.jpeg?raw=true',
    lastMessage: '今天吃点好的',
    lastTime: 1690639200000,
    index: 'W',
    unread: 1,
  },
  {
    id: 2,
    nickname: '小崔',
    avatar: 'https://github.com/kinggq/images/blob/main/cui.jpeg?raw=true',
    lastMessage: '夹头该死',
    lastTime: 1691056800000,
    index: 'X',
    unread: 0,
  },
]

const avatar1 = 'https://github.com/kinggq/images/blob/main/wang.jpeg?raw=true'
const avatar2 =
  'https://thirdwx.qlogo.cn/mmopen/vi_32/RMksZlPP4myx9pbGzt3PmV2FNIpia8hVHpUXbHM0RfbJtsSMEWCLicbvGuJRMpoAam3sZclNo0YtOnvJ0a8eMtyQ/132'
export const messages: Message[] = [
  {
    id: generateUUID(),
    content: `消息${generateUUID()}`,
    type: 'text',
    toContactId: 1,
    status: 'success',
    sendTime: 1690639200000,
    fromUser: {
      id: 1,
      avatar: avatar1,
    },
  },
  {
    id: generateUUID(),
    content: `消息${generateUUID()}`,
    type: 'text',
    toContactId: 1,
    status: 'success',
    sendTime: 1690624800000,
    fromUser: {
      id: 1,
      avatar: avatar1,
    },
  },
  {
    id: generateUUID(),
    content: `消息${generateUUID()}`,
    type: 'text',
    toContactId: 1,
    status: 'success',
    sendTime: 1690740000000,
    fromUser: {
      id: 1000,
      avatar: avatar2,
    },
  },
  {
    id: generateUUID(),
    content: `消息${generateUUID()}`,
    type: 'text',
    toContactId: 1,
    status: 'success',
    sendTime: 1690714800000,
    fromUser: {
      id: 1,
      avatar: avatar1,
    },
  },
  {
    id: generateUUID(),
    content: `消息${generateUUID()}`,
    type: 'text',
    toContactId: 1,
    status: 'success',
    sendTime: 1690992000000,
    fromUser: {
      id: 1,
      avatar: avatar1,
    },
  },
  {
    id: generateUUID(),
    content: `消息${generateUUID()}`,
    type: 'text',
    toContactId: 1,
    status: 'success',
    sendTime: 1690992000000,
    fromUser: {
      id: 1,
      avatar: avatar1,
    },
  },
  {
    id: generateUUID(),
    content: `消息${generateUUID()}`,
    type: 'text',
    toContactId: 1,
    status: 'success',
    sendTime: 1690992000000,
    fromUser: {
      id: 1,
      avatar: avatar1,
    },
  },
  {
    id: generateUUID(),
    content: `消息${generateUUID()}`,
    type: 'text',
    toContactId: 1,
    status: 'success',
    sendTime: 1690966800000,
    fromUser: {
      id: 1000,
      avatar: avatar2,
    },
  },
  {
    id: generateUUID(),
    content: `消息${generateUUID()}`,
    type: 'text',
    toContactId: 1,
    status: 'success',
    sendTime: 1691074800000,
    fromUser: {
      id: 1000,
      avatar: avatar2,
    },
  },
  {
    id: generateUUID(),
    content: `消息${generateUUID()}`,
    type: 'text',
    toContactId: 1,
    status: 'success',
    sendTime: 1691074800000,
    fromUser: {
      id: 1000,
      avatar: avatar2,
    },
  },
  {
    id: generateUUID(),
    content: `消息${generateUUID()}`,
    type: 'text',
    toContactId: 1,
    status: 'success',
    sendTime: 1691056800000,
    fromUser: {
      id: 1,
      avatar: avatar1,
    },
  },
  {
    id: generateUUID(),
    content: '',
    type: 'file',
    toContactId: 1,
    status: 'success',
    sendTime: 1691056800000,
    fileName: '简历.doc',
    fileSize: 18238,
    fromUser: {
      id: 1,
      avatar: avatar1,
    },
  },
  {
    id: generateUUID(),
    content: '',
    type: 'file',
    toContactId: 1,
    status: 'success',
    sendTime: 1691056800000,
    fileName: '修改简历.doc',
    fileSize: 18238,
    fromUser: {
      id: 1000,
      avatar: avatar2,
    },
  },
]
