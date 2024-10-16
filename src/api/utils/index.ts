import request from '@/axios'
export const getOss = () => {
    return request.get({ url: '/api/user/oss' })
}
