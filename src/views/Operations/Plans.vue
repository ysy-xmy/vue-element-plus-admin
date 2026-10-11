<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPlans, getPlanDetail, type PlanRow, type PlanDetail, type ListQuery } from '@/api/admin'
import { formatTime, formatDate, sourceLabel, errorText, useListSort } from './shared'
import './operations.css'

const route = useRoute()
const query = ref<ListQuery>({ page: 1, size: 20, keyword: '', source: '', complete: '' })
const dates = ref<string[]>([])
const rows = ref<PlanRow[]>([])
const total = ref(0)
const loading = ref(false)
const error = ref('')
const drawer = ref(false)
const detail = ref<PlanDetail>()
const detailLoading = ref(false)
const detailError = ref('')
const selectedId = ref(0)
let requestId = 0
const load = async () => {
  const currentRequest = ++requestId
  loading.value = true
  error.value = ''
  try {
    const data = await getPlans({
      ...query.value,
      start: dates.value?.[0] || '',
      end: dates.value?.[1] || ''
    })
    if (currentRequest !== requestId) return
    rows.value = data.list
    total.value = data.total
  } catch (e) {
    if (currentRequest === requestId) error.value = errorText(e)
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}
const search = () => {
  query.value.page = 1
  load()
}
const onSortChange = useListSort(query, load)
const reset = () => {
  query.value = {
    sortBy: query.value.sortBy,
    sortOrder: query.value.sortOrder,
    page: 1,
    size: 20,
    keyword: '',
    source: '',
    complete: ''
  }
  dates.value = []
  load()
}
const inspect = async (id: number) => {
  selectedId.value = id
  drawer.value = true
  detail.value = undefined
  detailError.value = ''
  detailLoading.value = true
  try {
    const data = await getPlanDetail(id)
    if (selectedId.value === id) detail.value = data
  } catch (e) {
    if (selectedId.value === id) detailError.value = errorText(e)
  } finally {
    if (selectedId.value === id) detailLoading.value = false
  }
}
const applyRoute = () => {
  const id = Number(route.query.userId)
  query.value.userId = Number.isInteger(id) && id > 0 ? id : undefined
}
watch(
  () => route.query.userId,
  () => {
    applyRoute()
    search()
  }
)
onMounted(() => {
  applyRoute()
  load()
})
</script>

<template>
  <div class="ops-page">
    <div class="ops-header"
      ><div
        ><div class="ops-eyebrow">训练运营</div><h1>训练计划与记录</h1
        ><p>查看手动安排、AI 生成与快速训练的使用情况，支持查询计划内的动作和每组训练参数。</p></div
      ></div
    >
    <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />
    <section class="ops-panel">
      <p class="ops-sort-hint">点击表头箭头排序，支持升序、降序和取消；排序对全部匹配记录生效。</p>
      <div class="ops-filters">
        <el-input
          v-model="query.keyword"
          clearable
          placeholder="计划标题 / 用户昵称"
          style="width: 220px"
          @keyup.enter="search"
        />
        <el-input-number
          v-model="query.userId"
          :min="1"
          :precision="0"
          :controls="false"
          placeholder="用户 ID"
          style="width: 130px"
        />
        <el-select v-model="query.source" clearable placeholder="全部来源" style="width: 145px"
          ><el-option label="手动安排" value="manual" /><el-option
            label="AI 计划"
            value="ai" /><el-option label="快速训练" value="quick"
        /></el-select>
        <el-select v-model="query.complete" clearable placeholder="全部状态" style="width: 140px"
          ><el-option label="已完成" value="true" /><el-option label="未完成" value="false"
        /></el-select>
        <el-date-picker
          v-model="dates"
          type="daterange"
          value-format="YYYY-MM-DD"
          start-placeholder="计划起始日期"
          end-placeholder="结束日期"
          style="width: 280px; flex-grow: 0"
        />
        <el-button type="primary" @click="search" :disabled="loading">查询</el-button
        ><el-button @click="reset" :disabled="loading">重置</el-button>
      </div>
      <el-table
        :data="rows"
        v-loading="loading"
        row-key="id"
        empty-text="暂无符合条件的训练计划"
        @sort-change="onSortChange"
      >
        <el-table-column sortable="custom" prop="id" label="ID" width="80" /><el-table-column
          sortable="custom"
          prop="planTitle"
          label="计划"
          min-width="210"
          show-overflow-tooltip
        />
        <el-table-column sortable="custom" prop="username" label="用户" min-width="170"
          ><template #default="{ row }"
            >{{ row.username || '未设置昵称' }}
            <span class="hint">#{{ row.userId }}</span></template
          ></el-table-column
        >
        <el-table-column sortable="custom" prop="planTime" label="计划日期" width="125"
          ><template #default="{ row }">{{ formatDate(row.planTime) }}</template></el-table-column
        >
        <el-table-column sortable="custom" prop="source" label="来源" width="120"
          ><template #default="{ row }"
            ><el-tag :type="row.source === 'ai' ? 'success' : 'info'">{{
              sourceLabel(row.source)
            }}</el-tag></template
          ></el-table-column
        >
        <el-table-column sortable="custom" prop="actionCount" label="动作数" width="90" />
        <el-table-column sortable="custom" prop="complete" label="完成状态" width="115"
          ><template #default="{ row }"
            ><el-tag :type="row.complete ? 'success' : 'info'">{{
              row.complete ? '已完成' : '未完成'
            }}</el-tag></template
          ></el-table-column
        >
        <el-table-column sortable="custom" prop="createdAt" label="创建时间" min-width="165"
          ><template #default="{ row }">{{ formatTime(row.createdAt) }}</template></el-table-column
        >
        <el-table-column label="操作" width="100" fixed="right"
          ><template #default="{ row }"
            ><el-button link type="primary" @click="inspect(row.id)">查看详情</el-button></template
          ></el-table-column
        >
      </el-table>
      <div class="ops-pagination"
        ><el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.size"
          :total="total"
          :page-sizes="[20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :disabled="loading"
          @current-change="load"
          @size-change="search"
      /></div>
    </section>
    <el-drawer v-model="drawer" title="训练计划详情" size="min(760px, 94vw)">
      <div v-loading="detailLoading" style="min-height: 160px">
        <el-alert
          v-if="detailError"
          :title="detailError"
          type="error"
          :closable="false"
        /><el-button v-if="detailError" @click="inspect(selectedId)" style="margin-top: 12px"
          >重试</el-button
        >
        <template v-if="detail"
          ><h2>{{ detail.plan.planTitle }}</h2
          ><p
            >{{ detail.plan.username || '用户' }} #{{ detail.plan.userId }} ·
            {{ formatDate(detail.plan.planTime) }} · {{ sourceLabel(detail.plan.source) }}</p
          ><el-tag :type="detail.plan.complete ? 'success' : 'info'">{{
            detail.plan.complete ? '已完成' : '未完成'
          }}</el-tag>
          <el-empty v-if="!detail.actions.length" description="该计划尚未添加动作" />
          <div
            v-for="action in detail.actions"
            :key="action.ID"
            class="ops-panel"
            style="margin-top: 16px"
          >
            <div class="hint">{{
              detail.groups.find((g) => g.ID === action.PlanActionGroupID)?.ActionGroupTitle ||
              '训练动作'
            }}</div
            ><h3>{{ action.ActionName }}</h3>
            <el-table
              v-if="detail.details.some((d) => d.PlanActionID === action.ID)"
              :data="detail.details.filter((d) => d.PlanActionID === action.ID)"
              ><el-table-column type="index" label="组" width="65" /><el-table-column
                prop="TimesNum"
                label="次数" /><el-table-column prop="Weight" label="重量 kg" /><el-table-column
                prop="Second"
                label="时长 秒"
            /></el-table>
            <p v-else
              >{{ action.GroupNum }} 组 · {{ action.TimesNum }} 次 · {{ action.Weight }} kg ·
              {{ action.Second }} 秒</p
            >
          </div>
        </template>
      </div>
    </el-drawer>
  </div>
</template>
