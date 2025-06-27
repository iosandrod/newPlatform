import { Base } from '@ER/base'
import { Message } from './naive-chat/types'
import { Contact } from './contact/types'
import { NaiveChatType } from '.'

export class ChatClass extends Base {
  //
  config: any
  constructor(config) {
    super()
    this.config = config //
  }
  getNaiveChatRef(): NaiveChatType {
    let naiveChatRef = this.getRef('naiveChatRef')
    return naiveChatRef
  }
  handleAppendMessage(msg?: Message) {
    if (msg == null) {
      msg = {
        id: 'id1',
        content: '最近忙什么呢?',
        type: 'text',
        toContactId: 3,
        fromUser: {
          id: 3,
          nickname: '梁宏达',
          avatar: 'http://rz1wa9fyb.hb-bkt.clouddn.com/liang.jpeg',
        },
        sendTime: Date.now(), //
        status: 'success',
        fileName: undefined,
      }
    }
    this.getNaiveChatRef()?.appendMessage(msg)
  }
  handleRemoveMessage() {
    const naiveChatRef = this.getNaiveChatRef()
    const lastMessage = naiveChatRef?.getCurrentLastMessage()
    if (lastMessage?.id) {
      const r = naiveChatRef?.removeOneMessage(
        lastMessage.toContactId,
        lastMessage.id,
      )
      if (!r) alert('删除失败')
    } else {
      alert('删除失败了')
    }
  }
  getUserInfo() {
    let config = this.config
    let userInfo = config.userInfo
    return userInfo
  }
  handleSendMessage() {
    const naiveChatRef = this.getNaiveChatRef()
    const c = naiveChatRef?.getCurrentContact()
    if (!c?.id) return alert('先开启一个好友的聊天窗口')
    let userInfo = this.getUserInfo()
    const msg: Message = {
      id: 'id1x1',
      content: `hi,${c.nickname}`,
      type: 'text', //
      toContactId: c.id,
      fromUser: userInfo,
      sendTime: Date.now(),
      status: 'success',
      fileName: undefined,
    }
    naiveChatRef?.appendMessage(msg)
  }
  handleUpdateMessage() {
    const naiveChatRef = this.getNaiveChatRef()
    const m = naiveChatRef?.getCurrentMessage()
    const len = m?.length
    if (!len) return alert('该联系没有可修改的消息')
    naiveChatRef?.updateMessage({
      ...m[len - 1],
      type: 'file',
      content: '',
      fileName: '修改了一条消息',
      fileSize: 10000,
    } as Message)
  }
  handleUpdateContact() {
    const naiveChatRef = this.getNaiveChatRef()
    const c = naiveChatRef?.getCurrentContact()
    naiveChatRef?.updateContact({
      ...c,
      nickname: '梁老师',
    } as Contact)
  }
  handleAddContact() {
    let createContactId = (Math.random() * 1000).toFixed(0)
    createContactId += 1
    const naiveChatRef = this.getNaiveChatRef()
    naiveChatRef?.appendContact({
      id: createContactId,
      nickname: `好友${createContactId}`,
      avatar: '',
      index: 'H',
    })
  }
  handleSendEventMessage() {
    const naiveChatRef = this.getNaiveChatRef()
    const c = naiveChatRef?.getCurrentContact()
    let userInfo = this.getUserInfo()
    if (!c?.id) return alert('先开启一个好友的聊天窗口')
    const msg: Message = {
      id: 'id1x1',
      content: '我撤回了一条消息*重新编辑',
      type: 'event',
      toContactId: c.id,
      fromUser: userInfo,
      sendTime: Date.now(),
      status: 'success',
      fileName: undefined,
    }
    naiveChatRef?.appendMessage(msg)
  } //
  handleSetValue() {
    // const naiveChatRef = this.getNaiveChatRef()
    // naiveChatRef?.setValue('you wife is charming')
  }
  onMounted() {
    super.onMounted()
    let naiveChatRef = this.getNaiveChatRef()
    naiveChatRef?.initContacts(this.config.contacts) //
  }
  async getContactMessages(id) {}
  //获取用户的联系人
  async getUserContacts() {
    let sys = this.getSystem()
    let http = this.getHttp()
  }
  setContacts(contacts) {
    let naiveChatRef = this.getNaiveChatRef()
    naiveChatRef?.initContacts(contacts) //
  }
}
