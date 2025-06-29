<script setup lang="ts">
import type { Contact, Message, MessageStatus, UserInfo } from '@/chat'
import { NcAvatar } from '../'
import { formatFileSize, formatTime, getFileIcon } from '../_utils'
import { watch } from 'vue'
import { nextTick } from 'vue'
import { ref, computed, inject, ComputedRef, Ref } from 'vue'

const emits = defineEmits<{
  (e: 'pullMessage', next: () => void, contactId: number): void
  (e: 'messageAvatarClick', message: Message): void
  (e: 'messageClick', message: Message): void
  (e: 'messageContextmenu', message: Message): void
  (e: 'eventMessageClick', message: Message): void
}>()

defineOptions({
  name: 'NcMessage',
})

const messageHeaderRef = ref<HTMLElement>()
const messageContainerRef = ref<HTMLElement>()

const headerClientHeight = computed(() => messageHeaderRef.value?.clientHeight)
const containerClientHeight = computed(
  () => messageContainerRef.value?.clientHeight,
)

const userInfo = inject<ComputedRef<UserInfo>>('user-info')
const currentContact = inject<Ref<Contact>>('current-contact')!

const currentMessage = inject<Ref<MessageStatus>>('current-message')!

function getContentClass(content: Message) {
  if (content?.fromUser?.id === userInfo?.value.id)
    return 'flex flex-row-reverse'
  return 'flex flex-justify-start'
}

async function onScroll(event: Event) {
  const el = event.target as HTMLElement
  theTop(el.scrollTop)
}

const scrollContainer = ref<HTMLElement>()

watch(
  () => currentContact.value,
  async () => {
    await nextTick()
    theTop(scrollContainer.value?.scrollTop)
  },
)

async function scrollToBottom() {
  await nextTick()
  if (scrollContainer.value)
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
}

async function theTop(scrollTop?: number) {
  if (currentMessage.value.isEnd) return

  if (scrollTop === 0) {
    // console.log('onScroll 1')
    currentMessage.value.loading = true
    await nextTick()
    const scrollHeight = scrollContainer.value!.scrollHeight
    emits(
      'pullMessage',
      () => {
        currentMessage.value.loading = false
        setTimeout(() => {
          scrollContainer.value!.scrollTop =
            scrollContainer.value!.scrollHeight - scrollHeight
        })
      },
      currentContact.value.id,
    )
  }
}
function getHeaderClass() {
  if (!containerClientHeight.value || !headerClientHeight.value) return
  return (
    `height: ${containerClientHeight.value - headerClientHeight.value}px;` +
    `top:${headerClientHeight.value}px;`
  )
}

function clickAvatar(message: Message) {
  emits('messageAvatarClick', message)
}

function clickMessage(message: Message) {
  emits('messageClick', message)
}

function contextmenuMessage(message: Message) {
  emits('messageContextmenu', message)
}

const showSidebar = ref(false)
function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}

function pushTime(curMsg: Message, index: number) {
  const prev = currentMessage.value.data[index - 1]

  if (prev) {
    if (curMsg.sendTime - prev.sendTime > 1000 * 60)
      return formatTime(curMsg.sendTime)
  } else {
    return formatTime(curMsg.sendTime)
  }
}

function eventMessageClick(message: Message) {
  emits('eventMessageClick', message)
}

watch(
  () => currentContact.value,
  () => {
    showSidebar.value = false
  },
)

const getArrowStyle = computed(() => {
  return (content: Message) => {
    if (content?.fromUser?.id === userInfo?.value.id) {
      if (content.type === 'file')
        return 'border-r-transparent border-l-white  dark:border-l-gray/10 right-0'
      else
        return 'border-r-transparent border-l-green-600/60 dark:border-l-green-600 right-0'
    } else {
      if (content.type === 'file')
        return 'border-l-transparent border-r-white dark:border-r-gray/10 left-0'
      return 'border-l-transparent border-r-white/80 dark:border-r-gray-500/50 left-0'
    }
  }
})

defineExpose({ scrollToBottom })
</script>

<template>
  <div
    ref="messageContainerRef"
    flex="~ col"
    relative
    h-full
    w-full
    bg="gray-500/8"
  >
    <transition name="side">
      <div
        v-if="showSidebar"
        absolute
        bottom-0
        right-0
        z-100
        w-300px
        border-l="1px gray-500/10"
        bg="white dark:#272727"
        :style="getHeaderClass()"
      >
        <slot name="message-sidebar" :contact="currentContact">
          <div>Hi,</div>
        </slot>
      </div>
    </transition>
    <div
      ref="messageHeaderRef"
      flex="~ justify-between"
      border-b="1px gray-500/10"
      px-20px
      py-15px
    >
      <div font-500 text="14px gray-500/100">
        {{ currentContact?.nickname }}
      </div>
      <div i-ri:more-line @click="toggleSidebar" />
    </div>
    <div
      ref="scrollContainer"
      relative
      flex-1
      overflow-x-hidden
      overflow-y-auto
      px-15px
      py-10px
      @scroll="onScroll"
    >
      <div flex="~" justify-center>
        <div
          v-if="currentMessage?.loading"
          i-ri:loader-4-line
          text="gray-500/60"
          class="loading-icon"
        />
        <div v-if="currentMessage.isEnd" text="gray-800/50 12px dark:gray">
          暂无更多消息
        </div>
      </div>
      <div
        v-for="(item, index) in (currentMessage ?? {}).data"
        :key="item.id"
        w-full
        py-10px
      >
        <div v-show="pushTime(item, index)" pb-20px text-center>
          <span text="12px gray-800/60 dark:gray">
            {{ pushTime(item, index) }}
          </span>
        </div>
        <div
          v-if="item.type === 'event'"
          text="12px gray-800/60 dark:gray center"
        >
          {{ item.content.split('*')[0] }}
          <span
            cursor-pointer
            text="blue-900/80 dark:blue"
            @click="eventMessageClick(item)"
          >
            {{ item.content.split('*')[1] }}
          </span>
        </div>
        <div v-else :class="getContentClass(item)">
          <div>
            <NcAvatar
              :url="item?.fromUser?.avatar || ''"
              @click="clickAvatar(item)"
            />
          </div>
          <div flex="~" items-center overflow-hidden>
            <div v-if="item.status === 'going'">
              <div i-ri:loader-4-line text="gray-500/60" class="loading-icon" />
            </div>
            <div v-else-if="item.status === 'error'" cursor-pointer>
              <div i-ri:error-warning-line text="red-500/80" />
            </div>
            <div
              relative
              overflow-hidden
              @click="clickMessage(item)"
              @contextmenu.prevent="contextmenuMessage(item)"
            >
              <div
                v-show="item.type !== 'image'"
                :class="getArrowStyle(item)"
                border-t="5px transparent"
                border-b="5px transparent"
                absolute
                top-10px
                h-0
                w-0
                border-l-5px
                border-r-5px
              />
              <div
                v-if="item.type === 'text'"
                text="14px left"
                :bg="`${
                  item?.fromUser?.id === userInfo?.id
                    ? 'green-600/60 dark:green-600'
                    : 'white/80 dark:gray-500/50'
                }`"
                flex="~"
                relative
                ml-10px
                mr-10px
                min-h-36px
                items-center
                overflow-hidden
                break-words
                rounded-6px
                px-10px
                py-5px
              >
                {{ item.content }}
              </div>
              <div v-else-if="item.type === 'image'" mx-10px>
                <img max-w-100px :src="item.content" alt="" />
              </div>
              <div v-else-if="item.type === 'file'">
                <div
                  flex="~"
                  bg="white dark:gray/10"
                  mx-10px
                  h-70px
                  w-200px
                  cursor-pointer
                  items-center
                  justify-between
                  rounded
                  p-10px
                >
                  <div text-left>
                    <div text="14px gray-800/80 dark:white">
                      {{ item.fileName }}
                    </div>
                    <div text="12px gray/50" mt-10px>
                      {{ formatFileSize(item.fileSize!) }}
                    </div>
                  </div>
                  <div
                    text="40px purple/90"
                    :class="getFileIcon(item.fileName || '')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div border-t="1px gray-500/10" min-h-200px>
      <slot name="editor" />
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-icon {
  animation: spin 2s linear infinite;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 2s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}
</style>
