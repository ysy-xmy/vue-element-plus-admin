import request from '@/axios'

export const getAccountingPageByType = (data) => {
  const newdata = data
  return request.get({ url: '/api/accounting/pageByType', params: newdata })
}

export const addAccounting = (data) => {
  return request.post({ url: '/api/accounting/add', data: data })
}
