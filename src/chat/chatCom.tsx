import { defineComponent, onMounted, ref } from 'vue'
import { NaiveChat } from '@/chat'
import type {
  Contact,
  Message,
  NaiveChatType,
  PullMessageOption,
  SendOption,
} from '@/chat'
import BaseHeaderVue from '@/pages/platform/chat/components/BaseHeader.vue'
import { contacts, messages } from '@/pages/platform/chat/utils'
import { ChatClass } from './chatClass'

export default defineComponent({
  name: 'NaiveChatApp', //
  components: { BaseHeaderVue }, //temp
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          nickname: 'King',
          avatar:
            'https://thirdwx.qlogo.cn/mmopen/vi_32/RMksZlPP4myx9pbGzt3PmV2FNIpia8hVHpUXbHM0RfbJtsSMEWCLicbvGuJRMpoAam3sZclNo0YtOnvJ0a8eMtyQ/132',
          id: 1000,
        }
      },
    },
    contacts: {
      type: Array,
      default: () => {
        return JSON.parse(JSON.stringify(contacts)) //
      },
    },
  },
  setup(props, { slots }) {
    let chatIns = new ChatClass(props)
    // let naiveChatRef = ref<NaiveChatType>()
    const rounded = ref(4)

    onMounted(() => {
      //   naiveChatRef.value?.initContacts(contacts)
      chatIns.onMounted()
    })

    function changeContact(contact: Contact) {
      Boolean(contact.avatar)
    }

    function pullMessage({ next, contactId }: PullMessageOption) {
      if (contactId === 1) {
        asyncFn(() => next(messages, true))
      } else {
        asyncFn(() => next([], true))
      }
    }

    function asyncFn(fn: () => void) {
      setTimeout(() => fn(), 1000)
    }
    function send({ message, next }: SendOption) {
      //   asyncFn(() => {
      //     next({
      //       id: message.id,
      //       toContactId: message.toContactId,
      //       status: 'success',
      //     })
      //   })
      console.log(message) //
    }
    return () => (
      <NaiveChat
        ref={(el) => {
          chatIns.registerRef('naiveChatRef', el)
        }}
        userInfo={chatIns.getUserInfo()}
        avatarRounded={rounded.value}
        onChangeContact={changeContact}
        onPullMessage={pullMessage}
        onSend={send}
        // onEventMessageClick={handleEventMessageClick}
      />
    )
  },
})
