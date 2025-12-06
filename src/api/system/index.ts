import request from '@/axios'

export const saveconfig = (data) => {
  return request.post({ url: '/api/conf/saveOrUpdate', data })
}

export const getconfig = () => {
  return request.get({ url: '/api/conf/get' })
}

// 根据标识获取配置
export const getConfigByIdentify = (identify: string) => {
  return request.get({ url: `/api/conf/getByIdentify/${identify}` })
}

// 保存或更新配置
export const saveOrUpdateConfig = (data: Array<{ Identify: string; Value: string }>) => {
  return request.post({ url: '/api/conf/saveOrUpdate', data })
}
