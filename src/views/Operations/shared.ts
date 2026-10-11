import type { Ref } from 'vue'
import type { ListQuery } from '@/api/admin'
import dayjs from 'dayjs'
export const formatTime = (value?: string | null) =>
  value && !value.startsWith('0001') ? dayjs(value).format('YYYY-MM-DD HH:mm') : '—'
export const formatDate = (value?: string) => (value ? dayjs(value).format('YYYY-MM-DD') : '—')
export const sourceLabel = (value: string) =>
  ({
    manual: '手动安排',
    ai: 'AI 计划',
    quick: '快速训练',
    shared: '分享导入',
    imported: '分享导入'
  })[value] ||
  value ||
  '手动安排'
export const statusLabel = (value: string) =>
  ({
    running: '处理中',
    success: '成功',
    failed: '失败',
    waiting_user: '等待补充',
    waiting_confirmation: '等待确认',
    cancelled: '已取消'
  })[value] || value
export const statusType = (value: string): 'success' | 'danger' | 'warning' | 'info' =>
  value === 'failed'
    ? 'danger'
    : value === 'success'
      ? 'success'
      : value === 'running'
        ? 'warning'
        : 'info'
export const errorText = (error: unknown) =>
  error instanceof Error ? error.message : '加载失败，请稍后重试'

// 分页列表统一向后端请求全量排序；取消排序时恢复接口默认顺序。
export const useListSort =
  (query: Ref<ListQuery>, reload: () => void) =>
  ({ prop, order }: { prop: string; order: 'ascending' | 'descending' | null }) => {
    query.value.sortBy = order ? prop : ''
    query.value.sortOrder = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
    query.value.page = 1
    reload()
  }
