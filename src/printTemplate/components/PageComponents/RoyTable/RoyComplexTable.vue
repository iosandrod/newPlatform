<!--
* @description 复杂表格
* @filename RoyComplexTable.vue
* @author ROYIANS
* @date 2022/11/23 9:55
!-->
<template>
  <div v-if="initCompleted" class="roy-complex-table">
    <StyledComplexTable v-bind="style">
      <table class="roy-complex-table__container">
        <tbody> 
        <tr v-if="element.showPrefix">
          <td>
            <div class="roy-complex-table__prefix">
              <RoyTextInTable
                key="prefix"
                :element="prefixTextElement"
                :prop-value="prefixTextElement.propValue"
                style="min-height: 40px; min-width: 200px"
                @componentUpdated="componentUpdated"
              />
            </div>
          </td>
        </tr>
        <tr v-if="element.showHead">
          <td>
            <div class="roy-complex-table__head">
              <RoySimpleTable
                key="head"
                :element="headSimpleTableElement"
                :prop-value="headSimpleTableElement.propValue"
                :scale="scale"
                @componentUpdated="componentUpdated"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div
              :style="{
                marginTop: element.showHead ? `-${style.borderWidth - 0.5}px` : '',
                marginBottom: element.showFoot ? `-${style.borderWidth - 0.5}px` : ''
              }"
              class="roy-complex-table__body"
            >
              <table :style="`width: ${bodyTableWidth}px`">
                <thead>
                  <tr>
                    <th
                      v-for="(item, index) in tableCols"
                      :key="index"
                      :style="{
                        width: `${item.width}px`,
                        height: `${tableRowHeight}px`
                      }"
                    >
                      <div style="display: inline; width: 100%">
                        {{ item.title }}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr :style="`height: ${tableRowHeight}px`">
                    <td :colspan="tableCols.length" :style="`height: ${tableRowHeight}px`">
                      <div class="roy-complex-table__auto_fill">自动填充</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
        <tr v-if="element.showFoot">
          <td>
            <div class="roy-complex-table__foot">
              <RoySimpleTable
                key="foot"
                :element="footSimpleTableElement"
                :prop-value="footSimpleTableElement.propValue"
                :scale="scale"
                @componentUpdated="componentUpdated"
              />
            </div>
          </td>
        </tr>
        <tr v-if="element.showSuffix">
          <td>
            <div class="roy-complex-table__suffix">
              <RoyTextInTable
                key="suffix"
                :element="suffixTextElement"
                :prop-value="suffixTextElement.propValue"
                style="min-height: 40px; min-width: 200px"
                @componentUpdated="componentUpdated"
              />
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </StyledComplexTable>
    <TableDataSetting
      v-if="showTableDataSetting"
      :table-config="bodyDataTableElement"
      :visible="showTableDataSetting"
      @onSave="handleTableSettingSave"
    />
  </div>
</template>

<script>
import commonMixin from '@/printTemplate/mixin/commonMixin'
import RoyTextInTable from './RoyTextInTable.vue'
import RoySimpleTable from './RoySimpleTable.vue'
import ResizeObserver from '@/printTemplate/utils/ResizeObserver'
import TableDataSetting from '@/printTemplate/components/PageComponents/RoyTable/TableDataSetting.vue'
import { StyledComplexTable } from '@/printTemplate/components/PageComponents/style'//
import { mapState } from 'vuex'

const defaultTextProp = {
  icon: 'ri-text',
  code: 'text',
  name: '文本',
  component: 'RoyTextIn',
  propValue: '',
  style: {
    width: '100%',
    height: '100%',
    fontSize: 12,
    background: null,
    rotate: 0
  },
  groupStyle: {}
}

const defaultSimpleTableProp = {
  icon: 'ri-table-2',
  code: 'table',
  name: '单元格',
  component: 'RoySimpleTable',
  propValue: {},
  style: {
    width: '100%',
    height: 'auto',
    fontSize: 12,
    background: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#212121',
    rotate: 0,
    isRelative: true
  },
  groupStyle: {}
}

const defaultDataTableProp = {
  tableRowHeight: 30,
  tableDataSource: '',
  tableCols: [
    {
      field: 'field1',
      title: '表头R1',
      width: 100,
      align: 'left',
      formatter: 'String'
    },
    {
      field: 'field2',
      title: '表头R2',
      width: 100,
      align: 'center',
      formatter: 'String'
    },
    {
      field: 'field3',
      title: '表头R3',
      width: 100,
      align: 'right',
      formatter: 'String'
    }
  ]
}

/**
 * 复杂表格
 */
export default {
  name: 'RoyComplexTable',
  mixins: [commonMixin],
  components: {
    RoyTextInTable,
    RoySimpleTable,
    StyledComplexTable,
    TableDataSetting
  },
  props: {
    element: {
      type: Object,
      default: () => {}
    },
    propValue: {
      type: Object,
      default: () => {
        return {}
      }
    },
    scale: {
      required: true,
      type: [Number, String],
      default: 1
    }
  },
  computed: {
    ...mapState({
      curTableSettingId: (state) => state.printTemplateModule.curTableSettingId
    }),
    showTableDataSetting() {
      return this.curTableSettingId !== null && this.curTableSettingId === this.element.id
    },
    style() {
      return this.element.style || {}
    },
    tableCols() {
      return this.bodyDataTableElement.tableCols || []
    },
    tableRowHeight() {
      return this.bodyDataTableElement.tableRowHeight || 40
    },
    bodyTableWidth() {
      return this.tableCols
        .map((item) => {
          return Number(item.width)
        })
        .reduce((a, b) => {
          return a + b
        })
    }
  },
  data() {
    return {
      initCompleted: false,
      prefixTextElement: {},
      suffixTextElement: {},
      bodyDataTableElement: {},
      headSimpleTableElement: {},
      footSimpleTableElement: {}
    }
  },
  methods: {
    initMounted() {
      const {
        prefixTextElement,
        suffixTextElement,
        headSimpleTableElement,
        footSimpleTableElement,
        bodyDataTableElement
      } = this.propValue
      this.prefixTextElement = prefixTextElement || this.deepCopy(defaultTextProp)
      this.suffixTextElement = suffixTextElement || this.deepCopy(defaultTextProp)
      this.headSimpleTableElement = headSimpleTableElement || this.deepCopy(defaultSimpleTableProp)
      this.footSimpleTableElement = footSimpleTableElement || this.deepCopy(defaultSimpleTableProp)
      this.bodyDataTableElement = bodyDataTableElement || this.deepCopy(defaultDataTableProp)
      setTimeout(() => {
        this.initCompleted = true
        // this.observeElementWidth()
      })
    },
    componentUpdated() {
      this.bodyDataTableElement.bodyTableWidth = this.bodyTableWidth
      const propValue = Object.assign({}, this.propValue, {
        prefixTextElement: this.prefixTextElement,
        suffixTextElement: this.suffixTextElement,
        headSimpleTableElement: this.headSimpleTableElement,
        footSimpleTableElement: this.footSimpleTableElement,
        bodyDataTableElement: this.bodyDataTableElement
      })
      this.$store.commit('printTemplateModule/setPropValue', {
        id: this.element.id,
        propValue
      })
      this.$emit('componentUpdated')
    },
    handleTableSettingSave(data) {
      this.bodyDataTableElement = data
      this.componentUpdated()
    },
    observeElementWidth() {
      this.$nextTick(() => {
        const element = this.$el.querySelector('.roy-complex-table__container')
        if (!element) {
          return
        }
        const resizeObserver = new ResizeObserver()
        const callback = () => {
          this.$nextTick(() => {
            this.$store.commit('printTemplateModule/setShapeStyle', {
              width: element.clientWidth,
              height: element.clientHeight
            })
          })
        }
        resizeObserver.onElResize(element, callback)
      })
    }
  },
  created() {},
  mounted() {
    this.initMounted()
  },
  watch: {
    style: {
      handler() {
        Object.assign(this.headSimpleTableElement.style, this.style)
        Object.assign(this.footSimpleTableElement.style, this.style)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.roy-complex-table {
  padding: 0;
}
</style>
