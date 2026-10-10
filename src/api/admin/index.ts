import request from '@/axios'

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  size: number
}
export interface UserRow {
  id: number
  username: string
  avatar: string
  phone: string
  enable: boolean
  activePersona: string
  createdAt: string
  lastLoginTime: string | null
  planCount: number
  completedCount: number
  studentCount: number
}
export interface PlanRow {
  id: number
  userId: number
  username: string
  planTitle: string
  planTime: string
  source: string
  complete: boolean
  actionCount: number
  createdAt: string
}
export interface PlanAction {
  ID: number
  PlanActionGroupID: number
  ActionName: string
  ContentType: string
  GroupNum: number
  TimesNum: number
  Weight: number
  Second: number
}
export interface PlanDetail {
  plan: PlanRow
  groups: { ID: number; ActionGroupTitle: string }[]
  actions: PlanAction[]
  details: {
    ID: number
    PlanActionID: number
    GroupNum: number
    TimesNum: number
    Weight: number
    Second: number
  }[]
}
export interface RunRow {
  id: number
  runId: string
  topicId: number
  userId: number
  username: string
  scene: string
  status: string
  errorCode: string
  startedAt: string
  finishedAt: string | null
}
export interface Overview {
  users: number
  newUsers: number
  activeUsers: number
  trainingCoaches: number
  plans: number
  completedPlans: number
  periodPlans: number
  periodCompletedPlans: number
  builtinActions: number
  customActions: number
  aiRuns: number
  aiFailures: number
  trend: { date: string; newUsers: number; plans: number; completedPlans: number; aiRuns: number }[]
}
export interface ListQuery {
  page: number
  size: number
  keyword?: string
  userId?: number
  persona?: string
  enable?: string
  source?: string
  complete?: string
  status?: string
  start?: string
  end?: string
}

// Business failures reject consistently; callers preserve the last successful
// result and show a retry state instead of treating a failure as an empty list.
async function checked<T>(promise: Promise<IResponse<T>>): Promise<T> {
  const res = await promise
  if (!res || res.code !== 200) throw new Error('请求失败，请重试')
  return res.data
}
export const getOverview = (days: number) =>
  checked(request.get<Overview>({ url: '/api/admin/overview', params: { days } }))
export const getUsers = (params: ListQuery) =>
  checked(request.get<PageResult<UserRow>>({ url: '/api/admin/users', params }))
export const getPlans = (params: ListQuery) =>
  checked(request.get<PageResult<PlanRow>>({ url: '/api/admin/plans', params }))
export const getPlanDetail = (id: number) =>
  checked(request.get<PlanDetail>({ url: `/api/admin/plans/${id}` }))
export const getRuns = (params: ListQuery) =>
  checked(request.get<PageResult<RunRow>>({ url: '/api/admin/ai/runs', params }))
export const getProductConfig = () =>
  checked(request.get<Record<string, string>>({ url: '/api/admin/product-config' }))
export const saveProductConfig = (data: Record<string, string>) =>
  checked(request.put({ url: '/api/admin/product-config', data }))

export const setUserStatus = (id: number, enable: boolean) =>
  checked(request.put({ url: `/api/admin/users/${id}/status`, data: { enable } }))
