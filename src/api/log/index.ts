import request from '@/axios'
export const getlog = (data: any) => {
    let params = {
        Page: data.Page,
        Size: data.Size,
        Type: data.Type,
    }
    return request.get({ url: '/api/log/getByType', params: params })
}
