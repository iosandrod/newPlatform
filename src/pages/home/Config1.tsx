import { defineComponent } from "vue";
import _ from 'lodash'
import { ref, onMounted, getCurrentInstance, reactive, computed, inject, watch } from 'vue'
import { erFormConfig, erGeneratorData, erComponentsConfig, utils } from '@ER/formEditor'
import { ElContainer, ElHeader, ElRadioGroup, ElRadioButton, ElAside, ElMain, ElInput } from "element-plus";
export default defineComponent({
  components: {
    erFormConfig
  },
  setup() {
    return (props, { attrs, slots, emit }) => {
      const {
        lang
      }: any = inject('globalConfig')
      const EReditorRef = ref(null)
      const store = reactive({
        fields: [],
        layouts: []
      })
      const fieldData = ref({})
      const logicData = ref('{}')
      const all = ref([])
      watch(lang, (newLang) => {
        all.value = []
        store.layouts = []
        store.fields = [...erComponentsConfig.fieldsConfig[0].list, ...erComponentsConfig.fieldsConfig[1].list].map(e => {
          const result = erGeneratorData(e, true, newLang)
          if (/^(radio|cascader|checkbox|select)$/.test(e.type)) {
            result.columns[0].options.data = utils.generateOptions(3).map((e, i) => {
              e.label += i + 1
              return e
            })
          }
          return result
        })
        const layoutNodes = erComponentsConfig.fieldsConfig[2].list.map(e => erGeneratorData(e, true, newLang))
        layoutNodes.forEach((node, index) => {
          store.layouts.push(node)
          switch (node.columns[0].type) {
            case 'grid':
            case 'tabs':
            case 'collapse':
              node.columns[0].columns[0].label = `${node.columns[0].label} > ${node.columns[0].columns[0].type}`
              store.layouts.push(node.columns[0].columns[0])
              break
            case 'table':
              node.columns[0].rows[0].columns[0].label = `${node.columns[0].label} > ${node.columns[0].rows[0].columns[0].type}`
              store.layouts.push(node.columns[0].rows[0].columns[0])
              break
            case 'subform':
              node.columns[0].list[0].push(erGeneratorData(erComponentsConfig.fieldsConfig[1].list[0], true, 'en'))
              break
          }
        })
        all.value = [...store.fields, ...store.layouts]
      }, { immediate: true })
      const value0 = ref('root')
      const sector = computed(() => {
        let result = ''
        if (value0.value === 'root') {
          result = 'root'
        } else {
          result = _.find(all.value, { id: value0.value })
        }
        return result
      })
      const handleListener = async ({ type, data }) => {
        console.log(type)
        if (type === 'changeParams') {
          //@ts-ignore
          fieldData.value = JSON.stringify(data, '', 2)
        }
        if (/^logic:(cancel|confirm)$/.test(type)) {
          //@ts-ignore
          logicData.value = JSON.stringify(data, '', 2)
        }
      }
      return <ElContainer>
        <ElHeader height="auto">
          <div>
            <h1>Form Attribute</h1>
            <ElRadioGroup v-model={value0.value} size="large">
              <ElRadioButton label="root">Form Attribute</ElRadioButton>
            </ElRadioGroup>
            <h1>Fields</h1>
            <ElRadioGroup v-model={value0.value} size="large">
              {store.fields.map(item => (
                <ElRadioButton key={item.columns[0].id} label={item.id}>
                  {item.columns[0].label}
                </ElRadioButton>
              ))}
            </ElRadioGroup>
          </div>
          <div>
            <h1>Layout</h1>
            <ElRadioGroup v-model={value0.value} size="large">
              {store.layouts.map(item => (
                <ElRadioButton key={item.id} label={item.id}>
                  {item.label ? item.label || item.type : item.columns[0].label || item.columns[0].type}
                </ElRadioButton>
              ))}
            </ElRadioGroup>
          </div> 
        </ElHeader>
        <ElContainer>
          <ElAside width="340px">
            <div class="customConfig">
              <erFormConfig
                lang={lang}
                onListener={handleListener}
                field={sector.value}
                fields={store.fields.map(e => e.columns[0])}
                ref={EReditorRef}
              />
            </div>
          </ElAside>
          <ElMain>
            <ElInput
              v-model={fieldData.value}
              rows={value0.value === 'root' ? 20 : 40}
              disabled
              type="textarea"
              placeholder="Please input"
            />
            {value0.value === 'root' && (
              <ElInput
                v-model={logicData.value}
                rows={value0.value === 'root' ? 20 : 40}
                disabled
                type="textarea"
                placeholder="Please input"
              />
            )}
          </ElMain>
        </ElContainer>
      </ElContainer>
    };
  },
});