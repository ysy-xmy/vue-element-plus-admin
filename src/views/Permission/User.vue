<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, setUserStatus, type UserRow, type ListQuery } from '@/api/admin'
import { formatTime, errorText, useListSort } from '@/views/Operations/shared'
import '@/views/Operations/operations.css'

const sourceLabel = (value?: string) => {
  const labels: Record<string, string> = {
    partner: '合作渠道',
    self: '自主来源',
    other: '其他来源'
  }
  return value ? labels[value] || value : '未记录'
}
const router = useRouter()
const query = ref<ListQuery>({ page: 1, size: 20, keyword: '', persona: '', enable: '' })
const rows = ref<UserRow[]>([])
const total = ref(0)
const loading = ref(false)
const error = ref('')
const pendingId = ref<number>()
let requestId = 0
const load = async () => {
  const currentRequest = ++requestId
  loading.value = true
  error.value = ''
  try {
    const data = await getUsers(query.value)
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
    persona: '',
    enable: ''
  }
  load()
}
const toggle = async (user: UserRow) => {
  try {
    await ElMessageBox.confirm(
      `${user.enable ? '停用' : '启用'}用户「${user.username || user.id}」？`,
      '账号状态',
      { type: 'warning', confirmButtonText: '确认', cancelButtonText: '取消' }
    )
  } catch {
    return
  }
  pendingId.value = user.id
  try {
    await setUserStatus(user.id, !user.enable)
    ElMessage.success('账号状态已更新')
    await load()
  } catch (e) {
    ElMessage.error(errorText(e))
  } finally {
    pendingId.value = undefined
  }
}
onMounted(load)
</script>

<template>
  <div class="ops-page">
    <div class="ops-header"
      ><div
        ><div class="ops-eyebrow">用户运营</div><h1>用户与教练工具</h1
        ><p>每个用户均可切换训练 / 教练视角；带教学员数用于识别实际使用教练工具的用户。</p></div
      ></div
    >
    <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />
    <section class="ops-panel">
      <p class="ops-sort-hint">点击表头箭头排序，支持升序、降序和取消；排序对全部匹配记录生效。</p>
      <div class="ops-filters">
        <el-input
          v-model="query.keyword"
          placeholder="搜索昵称 / 手机号"
          clearable
          style="width: 240px"
          @keyup.enter="search"
        />
        <el-select v-model="query.persona" placeholder="全部用户" clearable style="width: 190px"
          ><el-option label="训练视角" value="student" /><el-option
            label="教练视角"
            value="coach" /><el-option label="有带教学员" value="training_coach"
        /></el-select>
        <el-select v-model="query.enable" placeholder="全部账号状态" clearable style="width: 160px"
          ><el-option label="正常" value="true" /><el-option label="已停用" value="false"
        /></el-select>
        <el-button type="primary" @click="search" :disabled="loading">查询</el-button
        ><el-button @click="reset" :disabled="loading">重置</el-button>
      </div>
      <el-table
        :data="rows"
        v-loading="loading"
        empty-text="暂无符合条件的用户"
        row-key="id"
        @sort-change="onSortChange"
      >
        <el-table-column sortable="custom" prop="id" label="ID" width="80" />
        <el-table-column sortable="custom" prop="username" label="用户" min-width="190"
          ><template #default="{ row }"
            ><div style="display: flex; align-items: center; gap: 10px"
              ><el-avatar :size="34" :src="row.avatar">{{
                (row.username || '用').slice(0, 1)
              }}</el-avatar
              ><span>{{ row.username || '未设置昵称' }}</span></div
            ></template
          ></el-table-column
        >
        <el-table-column sortable="custom" prop="phone" label="手机号" min-width="135"
          ><template #default="{ row }">{{ row.phone || '—' }}</template></el-table-column
        >
        <el-table-column sortable="custom" prop="sourceType" label="来源类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.sourceType === 'partner' ? 'success' : 'info'">
              {{ sourceLabel(row.sourceType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          sortable="custom"
          prop="sourceAppId"
          label="来源应用 ID"
          min-width="190"
          show-overflow-tooltip
        >
          <template #default="{ row }">{{ row.sourceAppId || '—' }}</template>
        </el-table-column>
        <el-table-column
          sortable="custom"
          prop="channel"
          label="来源渠道"
          min-width="150"
          show-overflow-tooltip
        >
          <template #default="{ row }">{{ row.channel || '—' }}</template>
        </el-table-column>
        <el-table-column sortable="custom" prop="activePersona" label="当前视角" width="115"
          ><template #default="{ row }"
            ><el-tag :type="row.activePersona === 'coach' ? 'success' : 'info'">{{
              row.activePersona === 'coach' ? '教练' : '训练'
            }}</el-tag></template
          ></el-table-column
        >
        <el-table-column
          sortable="custom"
          prop="planCount"
          label="训练计划"
          width="100"
        /><el-table-column
          sortable="custom"
          prop="completedCount"
          label="已完成"
          width="110"
        /><el-table-column sortable="custom" prop="studentCount" label="带教学员" width="120" />
        <el-table-column sortable="custom" prop="lastLoginTime" label="最近登录" min-width="155"
          ><template #default="{ row }">{{
            formatTime(row.lastLoginTime)
          }}</template></el-table-column
        >
        <el-table-column sortable="custom" prop="createdAt" label="注册时间" min-width="155"
          ><template #default="{ row }">{{ formatTime(row.createdAt) }}</template></el-table-column
        >
        <el-table-column sortable="custom" prop="enable" label="状态" width="90"
          ><template #default="{ row }"
            ><el-tag :type="row.enable ? 'success' : 'danger'">{{
              row.enable ? '正常' : '停用'
            }}</el-tag></template
          ></el-table-column
        >
        <el-table-column label="操作" width="180" fixed="right"
          ><template #default="{ row }"
            ><el-button
              link
              type="primary"
              @click="router.push({ path: '/training/plans', query: { userId: row.id } })"
              >训练记录</el-button
            ><el-button
              link
              :type="row.enable ? 'danger' : 'success'"
              :loading="pendingId === row.id"
              @click="toggle(row)"
              >{{ row.enable ? '停用' : '启用' }}</el-button
            ></template
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
  </div>
</template>
