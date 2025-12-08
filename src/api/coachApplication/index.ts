import request from '@/axios'

// 申请状态类型
export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

// 申请列表项
export interface CoachApplicationItem {
  ID: number
  UserID: number
  UserOpenID: string
  Username: string
  ApplicationStatus: ApplicationStatus
  ApplicantName?: string
  ApplicantIDNumber?: string
  CreatedAt: string
  UpdatedAt: string
}

// 申请详情
export interface CoachApplicationDetail extends CoachApplicationItem {
  ReviewerID?: number
  ReviewerNote?: string
  ApplicationFiles: ApplicationFile[]
}

// 申请文件
export interface ApplicationFile {
  ID: number
  FileURL: string
  FileCategory: 'id_doc' | 'qualification' | 'portrait'
  FileLabel: string
  FileNumber?: string | null
  FileExpireAt?: string | null
  FileNote?: string | null
}

// 分页查询参数
export interface GetApplicationsParams {
  Status?: ApplicationStatus
  page?: number
  size?: number
}

// 分页响应
export interface GetApplicationsResponse {
  Items: CoachApplicationItem[]
  PageInfo: {
    Page: number
    Size: number
    Total: number
  }
}

// 审核通过参数
export interface ApproveApplicationParams {
  ApplicantName: string
  ApplicantIDNumber?: string
  ReviewerNote?: string
  Files: ApproveApplicationFile[]
}

export interface ApproveApplicationFile {
  ID: number
  FileNumber?: string | null
  FileLabel?: string | null
  FileExpireAt?: string | null
  FileNote?: string | null
}

// 审核拒绝参数
export interface RejectApplicationParams {
  ReviewerNote: string
}

/**
 * 分页查询申请列表
 */
export const getCoachApplicationsApi = (params: GetApplicationsParams) => {
  return request.get<GetApplicationsResponse>({
    url: '/api/admin/coach/applications',
    params: {
      Status: params.Status,
      page: params.page || 1,
      size: params.size || 10
    }
  })
}

/**
 * 查看申请详情
 */
export const getCoachApplicationDetailApi = (id: number) => {
  return request.get<CoachApplicationDetail>({
    url: `/api/admin/coach/applications/${id}`
  })
}

/**
 * 审核通过
 */
export const approveCoachApplicationApi = (id: number, data: ApproveApplicationParams) => {
  return request.post({
    url: `/api/admin/coach/applications/${id}/approve`,
    data
  })
}

/**
 * 审核拒绝
 */
export const rejectCoachApplicationApi = (id: number, data: RejectApplicationParams) => {
  return request.post({
    url: `/api/admin/coach/applications/${id}/reject`,
    data
  })
}
