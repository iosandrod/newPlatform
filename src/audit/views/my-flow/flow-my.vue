<!-- 审批流程 -->
<template>
  <section class="flow-approve-box">
    <!-- 检索条件 -->
    <div class="flow-content">
      <div class="search-box">
        <div class="search-segment" style="flex: 1">
          <!-- <a-input v-model="query.name" :max-length="16" allow-clear long placeholder="流程名称" /> -->
          <a-input-search
            v-model="query.name"
            :max-length="16"
            allow-clear
            placeholder="流程名称"
            search-button
            :button-props="{ type: 'secondary' }"
            @press-enter="onSearch()"
            @search="onSearch()">
            <template #button-icon><icon-search /></template>
          </a-input-search>
        </div>
        <!-- <div class="search-segment">
          <a-tooltip content="搜索">
            <a-button @click="onSearch()"> <icon-search /> </a-button>
          </a-tooltip>
        </div> -->
        <div class="search-segment">
          <a-tooltip content="重置">
            <a-button @click="onSearchReset()"> <icon-refresh /> </a-button>
          </a-tooltip>
        </div>
        <div class="search-segment">
          <a-popover position="rt" trigger="click" :show-arrow="false" class="flow-search-more-popover" animation-name="slide-fade">
            <a-button> <icon-filter /> </a-button>
            <template #content>
              <!-- 更多检索条件 -->
              <div class="search-more-title">高级筛选</div>
              <div class="search-more-box">
                <a-select class="column" v-model:model-value="query.groupId" allow-clear placeholder="流程分组">
                  <a-option v-for="group in groups" :value="group.id" :label="group.name" />
                </a-select>
                <a-select
                  class="column"
                  v-model:model-value="query.status"
                  allow-clear
                  placeholder="流程状态"
                  @clear="() => delete query.status">
                  <a-option v-for="status in STATUS_LIST" :value="status.value" :label="status.name" />
                </a-select>
                <a-range-picker
                  v-model:model-value="flowBeginTime"
                  :placeholder="['最小提交时间', '最大提交时间']"
                  allow-clear
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="onBeginTimeChanged" />
                <a-range-picker
                  v-model:model-value="flowEndTime"
                  :placeholder="['最小完成时间', '最大完成时间']"
                  allow-clear
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="onEndTimeChanged" />
              </div>
              <div class="search-more-action">
                <a-button @click="onSearchReset()"> 重置 </a-button>
                <a-button type="primary" @click="onSearch()"> 检索 </a-button>
              </div>
            </template>
          </a-popover>
        </div>
      </div>

      <!-- 流程列表 -->
      <div class="flow-list-box">
        <div class="empty-box" v-if="flowInsts.length == 0">
          <a-empty></a-empty>
        </div>
        <div
          v-else
          :class="['item-box', selectedFlow.id == inst.id ? 'item-box-choosed' : '']"
          v-for="inst in flowInsts"
          @click="onFlowInstClicked(inst)">
          <FlowCard :flow-inst="inst"></FlowCard>
        </div>
        <!-- <div class="spin-box" ref="spinbox">
          <a-spin v-if="haveMore"></a-spin>
        </div> -->
        <RollLoading @on-scroll="loadFlowInsts()" :has-more="haveMore"></RollLoading>
      </div>
    </div>

    <!-- 流程详情 -->
    <div class="flow-detail-content">
      <flow-detail :flow-inst="selectedFlow" :cancelable="true" :actionable="false" :relaunchable="true" />
    </div>
  </section>
</template>

<script setup>


import RollLoading from "@/audit/components/common/RollLoading.vue";
import { STATUS_LIST } from "@/audit/components/flow/common/FlowConstant";
import { IconFilter, IconRefresh, IconSearch } from "@arco-design/web-vue/es/icon";
import { onBeforeMount, ref } from "vue";
import FlowCard from "./flow-card.vue";
import FlowDetail from "./flow-detail.vue";

let groups = ref([]);

let query = ref({ page: 0, size: 10, total: 0 });
let flowInsts = ref([]);
let flowBeginTime = ref([]);
let flowEndTime = ref([]);
let selectedFlow = ref({});
const haveMore = ref(true); // 无限加载, 是否存在更多的数据

const onBeginTimeChanged = (dateString) => {
  if (dateString && dateString.length == 2) {
    query.value.beginMinTime = dateString[0];
    query.value.beginMaxTime = dateString[1];
  } else {
    delete query.value.beginMinTime;
    delete query.value.beginMaxTime;
  }
};
const onEndTimeChanged = (dateString) => {
  if (dateString && dateString.length == 2) {
    query.value.endMinTime = dateString[0];
    query.value.endMaxTime = dateString[1];
  } else {
    delete query.value.endMinTime;
    delete query.value.endMaxTime;
  }
};

const onSearch = () => {
  query.value.page = 0;
  flowInsts.value = [];
  haveMore.value = true;
};

const onSearchReset = () => {
  query.value = { page: 0, size: 10, total: 0 };
  flowBeginTime.value = null;
  flowEndTime.value = null;
  flowInsts.value = [];
  haveMore.value = true;
};

const loadFlowInsts = () => {
  query.value.page++;
  FlowInstApi.listMineFlowInsts(query.value).then((resp) => {
    if (resp.code == 1) {
      let { data, total } = resp;
      flowInsts.value.push(...(data || []));
      query.value.total = total;
      if (flowInsts.value.length >= total) {
        haveMore.value = false;
      }
    }
  });
};

const onFlowInstClicked = (inst) => {
  selectedFlow.value = inst;
};



onBeforeMount(() => {
  loadFlowGroups();
});
</script>

<style lang="scss">
@import "./flow-base.scss";
</style>
