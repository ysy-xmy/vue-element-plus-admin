import request from '@/axios'

export const getAccountingPageByType = (data) => {
  const newdata = data
  return request.get({ url: '/api/accounting/pageByType', params: newdata })
}

export const addAccounting = (data) => {
  return request.post({ url: '/api/accounting/add', data: data })
}

export const getWithdrawList = (data) => {
  return request.get({ url: '/api/withdraw/list', params: data })
}

export const approveWithdraw = (
  id: number,
  data: { TransferProof: string; AdminRemark?: string }
) => {
  return request.post({ url: `/api/withdraw/approve/${id}`, data })
}

export const rejectWithdraw = (id: number, data: { AdminRemark: string }) => {
  return request.post({ url: `/api/withdraw/reject/${id}`, data })
}
