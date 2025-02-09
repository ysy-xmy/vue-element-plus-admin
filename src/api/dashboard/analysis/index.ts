import request from '@/axios'
import type {
  AnalysisTotalTypes,
  UserAccessSource,
  WeeklyUserActivity,
  MonthlySales,
  YearPercentData
} from './types'

export const getCountApi = (): Promise<IResponse<AnalysisTotalTypes[]>> => {
  return request.get({ url: '/mock/analysis/total' })
}

export const getUserAccessSourceApi = (): Promise<IResponse<UserAccessSource[]>> => {
  return request.get({ url: '/mock/analysis/userAccessSource' })
}

export const getWeeklyUserActivityApi = (): Promise<IResponse<WeeklyUserActivity[]>> => {
  return request.get({ url: '/mock/analysis/weeklyUserActivity' })
}

export const getMonthlySalesApi = (year: number): Promise<IResponse<MonthlySales[]>> => {
  return request.get({ url: '/api/accounting/getYearData', params: { year: year } })
}

export const getYearPercentApi = (params: {
  year?: number
  type: 'INCOME' | 'EXPENSE'
  month?: number
}): Promise<IResponse<Array<{ name: string; value: number }>>> => {
  return request.get({ url: '/api/accounting/getYearPercent', params })
}
