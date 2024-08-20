import request from '@/axios'



export const getAccountingPageByType = (data) => {
    let newdata = data
    return request.get({ url: '/api/accounting/pageByType', params: newdata })
}
