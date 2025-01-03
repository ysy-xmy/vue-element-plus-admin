import request from '@/axios'

export const saveconfig = (data) => {
  return request.post({ url: '/api/conf/saveOrUpdate', data })
}

export const getconfig = () => {
  return request.get({ url: '/api/conf/get' })
}
