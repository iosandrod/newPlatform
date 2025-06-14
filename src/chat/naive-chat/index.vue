<script setup lang="ts">
import {
  provide,
  ref,
  reactive,
  computed,
  onMounted,
  nextTick,
  Ref,
  watchEffect,
} from 'vue'
import type { Contact, Menu, MenuKey } from '../'
import NcEditor from '../editor/editor.vue'
import NcAvatar from '../avatar/avatar.vue'
import NcContact from '../contact/contact.vue'
import NcMenu from '../menu/menu.vue'
import NcMessage from '../message/message.vue'
import { generateUUID } from '../_utils'
import type {
  Message,
  MessageStatus,
  MessageStore,
  PullMessageOption,
  SendOption,
  UserInfo,
} from './types'

const props = withDefaults(
  defineProps<{
    userInfo: UserInfo
    openFirst?: boolean
    avatarRounded?: number
  }>(),
  {
    openFirst: true,
    avatarRounded: 4,
  },
)

const emits = defineEmits<{
  (e: 'changeContact', contact: Contact): void
  (e: 'pullMessage', { next, contactId }: PullMessageOption): void
  (e: 'send', { message, next, file }: SendOption): void
  (e: 'messageAvatarClick', message: Message): void
  (e: 'messageClick', message: Message): void
  (e: 'messageContextmenu', message: Message): void
  (e: 'menuClick', menuKey: string, menu: Menu): void
  (e: 'eventMessageClick', message: Message): void
}>()

defineOptions({
  name: 'NaiveChat',
})

const menus = ref<Menu[]>([
  {
    key: 'message',
    icon: 'i-ri:chat-3-line',
    activeIcon: 'i-ri:chat-3-fill',
    active: true,
  },
  {
    key: 'contact',
    icon: 'i-ri:contacts-line',
    activeIcon: 'i-ri:contacts-fill',
    active: false,
  },
  {
    key: 'more',
    icon: 'i-ri:more-line',
    activeIcon: 'i-ri:more-fill',
    active: false,
  },
])

const contacts = ref<Contact[]>([])
const activeMenuKey = ref<MenuKey>('message')
const currentContact = ref<Contact>()
const editorRef = ref<InstanceType<typeof NcEditor>>()

const messageStore = reactive<MessageStore>({} as MessageStore)
const currentMessage = ref<MessageStatus>({} as MessageStatus)
const lastMessages = computed(() =>
  contacts.value
    ?.filter((item) => item.lastMessage)
    .sort((a, b) => b.lastTime! - a.lastTime!),
)

provide(
  'avatar-rounded',
  computed(() => props.avatarRounded),
)
provide('menus', menus)
provide('message-store', messageStore)
provide('current-message', currentMessage)
provide('current-contact', currentContact)
provide<Ref<MenuKey>>('active-menu-key', activeMenuKey)
provide(
  'user-info',
  computed(() => props.userInfo),
)
provide('contacts', contacts)
provide('last-messages', lastMessages)

const nativeMessageRef = ref<InstanceType<typeof NcMessage>>()

watchEffect(() => {
  currentMessage.value = messageStore[currentContact.value?.id || NaN]
})

function initContacts(cts: Contact[]) {
  contacts.value = cts
  if (cts.length > 0) changeLastMessage(cts[0])
}

function getCurrentContact() {
  return currentContact.value
}

function changeLastMessage(contact: Contact) {
  currentContact.value = contact
  emits('changeContact', contact)
  updateContact({
    id: contact.id,
    unread: 0,
  } as Contact)
  if (!messageStore[contact.id]) {
    messageStore[contact.id] = {
      loading: true,
      data: [],
      isEnd: false,
    }
    emitPullMessage(() => {
      scrollToBottom()
    }, contact.id)
  } else {
    scrollToBottom()
  }
  focusInput()
  // console.log(messageStore)
}

async function focusInput() {
  await nextTick()
  editorRef.value?.focusInput()
}

function emitPullMessage(next: () => void, contactId?: number) {
  emits('pullMessage', {
    contactId: currentContact.value!.id,
    next(messages, isEnd) {
      messageStore[contactId!].loading = false
      messageStore[contactId!].isEnd = !!isEnd
      addMessage(messages, contactId!, 'unshift')
      if (!messages.length) return
      const lastMsg = messages[messages.length - 1]
      updateContact({
        id: contactId,
        lastMessage: renderLastMessage(lastMsg),
        lastTime: lastMsg.sendTime,
      } as Contact)
      next()
    },
  })
}

function scrollToBottom() {
  if (nativeMessageRef.value) nativeMessageRef.value.scrollToBottom()
}

function send(content: string) {
  const message = createMessage({ content } as Message)
  appendMessage(message)
  emits('send', {
    message,
    next(asyncMessage) {
      updateMessage(asyncMessage as Message)
    },
  })
}

function updateMessage(message: Message) {
  const index = messageStore[message.toContactId].data.findIndex(
    (item) => item.id === message.id,
  )
  const historyMessage = messageStore[message.toContactId].data[index]
  messageStore[message.toContactId].data[index] = Object.assign(
    historyMessage,
    message,
    { toContactId: historyMessage.toContactId },
  )
}

function appendMessage(message: Message) {
  if (messageStore[message.toContactId]) {
    addMessage([message], message.toContactId, 'push')
    updateContact({
      id: message.toContactId,
      lastMessage: renderLastMessage(message),
      lastTime: message.sendTime,
      unread: 1,
    } as Contact)
    scrollToBottom()
  } else {
    updateContact({
      id: message.fromUser.id,
      lastMessage: renderLastMessage(message),
      lastTime: message.sendTime,
      unread: 1,
    } as Contact)
  }
}

function renderLastMessage(message: Message) {
  const { type, content, fileName } = message
  if (type === 'text' || type === 'event') return content
  else if (type === 'image') return '[图片]'
  else if (type === 'file') return `[文件] ${fileName}`
}

function updateContact(contact: Contact) {
  if (!contacts.value) return
  const index = contacts.value.findIndex((item) => item.id === contact.id)
  if (index === -1) return
  const oldContact = contacts.value[index]
  contacts.value[index] = {
    ...oldContact,
    ...contact,
    unread:
      contact.id === currentContact.value?.id
        ? 0
        : (oldContact.unread || 0) + (contact.unread || 0),
  }
}

function createMessage<T extends Message>(message: T): Message {
  return {
    ...{
      id: generateUUID(),
      sendTime: Date.now(),
      type: 'text',
      status: 'going',
      toContactId: currentContact.value!.id,
      fromUser: props.userInfo,
    },
    ...message,
  }
}

function addMessage(
  messages: Message[],
  contactId: number,
  type: 'push' | 'unshift',
) {
  messageStore[contactId].data[type](...messages)
}

let contactIndex = ''
function innerContactIndex(index: string) {
  if (index !== contactIndex) {
    contactIndex = index
    return true
  }

  return false
}

function uploadFile(file: File) {
  const imagesType = ['image/png', 'image/jpeg', 'image/gif']
  let message: Message
  if (imagesType.includes(file.type)) {
    message = {
      content: URL.createObjectURL(file),
      type: 'image',
      fileName: file.name,
      fileSize: file.size,
    } as Message
  } else {
    message = {
      content: '',
      type: 'file',
      fileName: file.name,
      fileSize: file.size,
    } as Message
  }
  const result = createMessage(message)
  appendMessage(result)
  emits('send', {
    message: result,
    next(asyncMessage) {
      updateMessage(asyncMessage as Message)
    },
    file,
  })
}

const currentOpenContact = ref<Contact>()
provide('current-open-contact', currentOpenContact)
function handleClickContact(contact: Contact) {
  currentOpenContact.value = contact
}

function toMessage(contact: Contact) {
  activeMenuKey.value = 'message'
  menus.value.forEach((item) => {
    if (item.key === activeMenuKey.value) item.active = true
    else item.active = false
  })
  updateContact({
    id: contact.id,
    lastMessage: ' ',
    lastTime: Date.now(),
  } as Contact)
  changeLastMessage(contact)
}

function appendContact(contact: Contact) {
  contacts.value.push(contact)
}

function removeContact(id: number) {
  contacts.value = contacts.value.filter((item) => item.id !== id)
}

function clearMessage(id: number) {
  messageStore[id].data = []
}

function removeOneMessage(contactId: number, messageId: string) {
  if (!messageStore[contactId]) return false
  messageStore[contactId].data = messageStore[contactId].data.filter(
    (item) => item.id !== messageId,
  )
  return true
}

function getCurrentMessage() {
  return currentMessage.value?.data
}

function getCurrentLastMessage() {
  if (getCurrentMessage()) {
    const len = getCurrentMessage().length
    return getCurrentMessage()[len - 1]
  }
}

function setValue(text: string) {
  editorRef.value?.setValue(text)
}

function eventMessageClick(message: Message) {
  emits('eventMessageClick', message)
}

defineExpose({
  initContacts,
  appendMessage,
  updateContact,
  updateMessage,
  getCurrentContact,
  appendContact,
  removeContact,
  clearMessage,
  removeOneMessage,
  getCurrentMessage,
  getCurrentLastMessage,
  setValue,
})
</script>

<template>
  <div h-650px w-800px border="1px gray-500/10" rounded-4px flex="~">
    <NcMenu
      @menu-click="(menuKey, menu) => emits('menuClick', menuKey, menu)"
    />
    <div h-full w-220px border-r="1px gray-800/10" flex="~ col">
      <slot name="sidebar-contact">
        <div v-show="activeMenuKey === 'message'" overflow-hidden flex="~ col">
          <slot name="sidebar-header">
            <div px-10px py-10px bg="gray/2">
              <input
                h-36px
                w-full
                rounded-2px
                px-10px
                py-2px
                text-12px
                bg="gray/10"
                type="text"
                placeholder="自定义头部信息"
              />
            </div>
          </slot>
          <div flex-1 overflow-y-auto>
            <NcContact
              v-for="item in lastMessages"
              :key="item.id"
              :contact="item"
              :last-message="true"
              :class="
                item.id === currentContact?.id
                  ? 'bg-gray-500/10'
                  : 'gray-500/4 hover:gray-500/10'
              "
              @click="changeLastMessage(item)"
            />
          </div>
        </div>
        <div v-show="activeMenuKey === 'contact'" overflow-y-auto>
          <slot name="sidebar-contact-header">
            <div px-10px py-10px bg="gray/2">
              自定义头部信息
            </div>
          </slot>
          <div v-for="item in contacts" :key="item.id">
            <div
              v-show="innerContactIndex(item.index)"
              text="left 12px gray-500/50"
              px-10px
            >
              <div py-10px border-b="1px gray-500/6">
                {{ item.index }}
              </div>
            </div>
            <NcContact
              :contact="item"
              :class="
                item.id === currentOpenContact?.id
                  ? 'bg-gray-500/10'
                  : 'gray-500/4 hover:gray-500/10'
              "
              @click="handleClickContact(item)"
            />
          </div>
        </div>
        <slot name="sidebar-other" />
      </slot>
    </div>
    <div flex-1 overflow-hidden>
      <NcMessage
        v-if="currentContact && activeMenuKey === 'message'"
        ref="nativeMessageRef"
        @pull-message="emitPullMessage"
        @message-avatar-click="
          (message) => emits('messageAvatarClick', message)
        "
        @message-click="(message) => emits('messageClick', message)"
        @message-contextmenu="(message) => emits('messageContextmenu', message)"
        @event-message-click="eventMessageClick"
      >
        <template #editor>
          <NcEditor ref="editorRef" @send="send" @upload="uploadFile">
            <template #message-tools="{ upload }">
              <slot name="message-tools" :upload-event="upload" />
            </template>
            <template #message-tools-right>
              <slot name="message-tools-right" />
            </template>
          </NcEditor>
        </template>
      </NcMessage>
      <div v-else-if="activeMenuKey === 'contact'" h-full>
        <div v-if="currentOpenContact" h-full flex items-center justify-center>
          <div>
            <NcAvatar :size="100" :url="currentOpenContact.avatar" />
            <div py-20px text="gray-800/90" font-500>
              {{ currentOpenContact.nickname }}
            </div>
            <button btn @click="toMessage(currentOpenContact)">
              发送消息
            </button>
          </div>
        </div>
      </div>
      <slot v-else name="default-page">
        <div h-full w-full flex="~" items-center justify-center>
          <div text="gray-500/50 100px" i-ri:wechat-line />
        </div>
      </slot>
    </div>
  </div>
</template>
