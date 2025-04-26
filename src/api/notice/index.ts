import request from '@/axios'

/**
 * 创建通知
 * @param data 请求体，包含 Notification 和 UserIds
 * @param token 授权 token
 * @returns Promise
 */
export const createNotifier = (data: {
  Notification: {
    Title: string
    Content: string
  }
  UserIds: number[]
}) => {
  return request.post({
    url: '/api/notifier/create',
    data
  })
}
