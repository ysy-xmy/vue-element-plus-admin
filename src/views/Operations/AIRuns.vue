<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getRuns, type RunRow, type ListQuery } from '@/api/admin'
import { formatTime, statusLabel, statusType, errorText, useListSort } from './shared'
import './operations.css'

const query = ref<ListQuery>({ page: 1, size: 20, keyword: '', status: '' })
const dates = ref<string[]>([])
const rows = ref<RunRow[]>([])
const total = ref(0)
const loading = ref(false)
const error = ref('')
let requestId = 0
const load = async () => {
  const currentRequest = ++requestId
  loading.value = true
  error.value = ''
  try {
    const data = await getRuns({
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
    status: ''
  }
  dates.value = []
  load()
}
const duration = (row: RunRow) =>
  row.finishedAt
    ? `${Math.max(0, (Date.parse(row.finishedAt) - Date.parse(row.startedAt)) / 1000).toFixed(1)} 秒`
    : '—'
onMounted(load)
</script>

<template>
  <div class="ops-page">
    <div class="ops-header"
      ><div
        ><div class="ops-eyebrow">AI 运营</div><h1>AI 使用与请求状态</h1
        ><p>追踪请求是否成功、等待用户确认或发生异常，通过请求 ID 定位服务日志。</p></div
      ><el-button @click="load" :disabled="loading">刷新</el-button></div
    >
    <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />
    <section class="ops-panel">
      <p class="ops-sort-hint">点击表头箭头排序，支持升序、降序和取消；排序对全部匹配记录生效。</p>
      <div class="ops-filters">
        <el-input
          v-model="query.keyword"
          clearable
          placeholder="请求 ID / 用户昵称"
          style="width: 240px"
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
        <el-select v-model="query.status" clearable placeholder="全部状态" style="width: 170px"
          ><el-option
            v-for="status in [
              'success',
              'failed',
              'running',
              'waiting_user',
              'waiting_confirmation',
              'cancelled'
            ]"
            :key="status"
            :value="status"
            :label="statusLabel(status)"
        /></el-select>
        <el-date-picker
          v-model="dates"
          type="daterange"
          value-format="YYYY-MM-DD"
          start-placeholder="请求起始日期"
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
        empty-text="暂无符合条件的 AI 请求"
        @sort-change="onSortChange"
      >
        <el-table-column
          sortable="custom"
          prop="runId"
          label="请求 ID"
          min-width="260"
          show-overflow-tooltip
        />
        <el-table-column sortable="custom" prop="username" label="用户" min-width="160"
          ><template #default="{ row }"
            >{{ row.username || '未设置昵称' }}
            <span class="hint">#{{ row.userId }}</span></template
          ></el-table-column
        >
        <el-table-column
          sortable="custom"
          prop="topicId"
          label="话题 ID"
          width="95"
        /><el-table-column sortable="custom" prop="scene" label="场景" min-width="110" />
        <el-table-column sortable="custom" prop="status" label="状态" width="125"
          ><template #default="{ row }"
            ><el-tag :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag></template
          ></el-table-column
        >
        <el-table-column sortable="custom" prop="errorCode" label="错误码" min-width="160"
          ><template #default="{ row }">{{ row.errorCode || '—' }}</template></el-table-column
        >
        <el-table-column label="耗时" width="100"
          ><template #default="{ row }">{{ duration(row) }}</template></el-table-column
        >
        <el-table-column sortable="custom" prop="startedAt" label="开始时间" min-width="165"
          ><template #default="{ row }">{{ formatTime(row.startedAt) }}</template></el-table-column
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
  </div>
</template>
