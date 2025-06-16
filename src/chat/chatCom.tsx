import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
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
import { system } from '@/system'

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
        // return JSON.parse(JSON.stringify(contacts)) //
        return []
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
      // console.log(message) //
    }
    // system.initChat()
    // system.registerRef('chatIns', chatIns) //
    onMounted(() => {
      system.registerRef('chatIns', chatIns)
      system.initChat() //
    })
    onUnmounted(() => {
      system.registerRef('chatIns', null) //
    })
    return () => {
      let com = (
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
      return (
        <div>
          {com}
          <erButtonGroup
            items={[
              {
                label: '添加好友',
                fn: async () => {
                  await system.addFriend(2)
                },
              },
              {
                label: '查找联系人',
                fn: async () => {
                  let fConfig = {
                    title: '输入联系人名称',
                    height: 200,
                    width: 300, //
                    itemSpan: 24,
                    items: [
                      {
                        field: 'username', //
                        type: 'string',
                        label: '昵称',
                        placeholder: '请输入昵称', //
                      },
                    ],
                    data: {
                      username: '',
                    },
                  }
                  let d = await system.confirmForm(fConfig) //
                  let { username } = d //
                  let data = await system.searchFriend(username)
                  let data1 = await system.confirmTable({
                    title: '选择联系人',
                    height: 300,
                    width: 600,
                    columns: [
                      { title: '昵称', field: 'username' },
                      { title: '头像', field: 'avatar' },
                    ],
                    data, //
                    showHeaderButtons: false, //
                    showCheckboxColumn: true, //
                  })
                  // console.log(data1, 'testData1') //
                  let checkData = data1.filter((item) => {
                    return item['checkboxField'] == true
                  })
                  if (checkData.length == 0) {
                    return
                  }
                  let { id } = checkData[0]
                  await system.addFriend(id) //
                },
              },
            ]}
          ></erButtonGroup>
        </div>
      )
    }
  },
})
