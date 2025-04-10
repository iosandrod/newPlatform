import { defineComponent } from 'vue'
import { GithubOutlined, GitlabOutlined } from '@ant-design/icons-vue'

import TriggerBox from './TriggerBox'
import {
  Contextmenu,
  ContextmenuItem,
  ContextmenuSubmenu,
  ContextmenuDivider,
} from '@/contextM'

const ExampleSimple = defineComponent({
  name: 'ExampleSimple',

  setup() {
    return () => (
      //@ts-ignore
      <>
        <div
          v-contextmenu={[null, 'contextmenu']}
          style={{
            height: '100%',
          }}
        >
          <TriggerBox>
            <code>右键点击此区域</code>
          </TriggerBox>
        </div>

        <Contextmenu ref="contextmenu">
          <ContextmenuItem>
            <GithubOutlined />
            &nbsp;GitHub
          </ContextmenuItem>

          <ContextmenuItem>
            <GitlabOutlined />
            &nbsp;GitLab
          </ContextmenuItem>

          <ContextmenuDivider />

          <ContextmenuSubmenu title="蔬菜菜">
            <ContextmenuItem>土豆</ContextmenuItem>
            <ContextmenuItem>黄瓜</ContextmenuItem>

            <ContextmenuSubmenu title="青菜">
              <ContextmenuItem>小油菜</ContextmenuItem>
              <ContextmenuItem>空心菜</ContextmenuItem>
              <ContextmenuItem>紫罗兰</ContextmenuItem>
            </ContextmenuSubmenu>
          </ContextmenuSubmenu>

          <ContextmenuItem disabled>菠萝蜜</ContextmenuItem>

          <ContextmenuDivider />

          <ContextmenuItem>哈密瓜</ContextmenuItem>
        </Contextmenu>
      </>
    )
  },
})

export default ExampleSimple
