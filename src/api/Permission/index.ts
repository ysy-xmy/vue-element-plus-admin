import request from '@/axios'
import { UserInfo, UserParams } from "./type";
export const getalluserApi = () => {
    return request.get<UserInfo>({ url: '/api/user/page' })
}

export const getuserlistApi = (data: UserParams) => {

    let params: UserParams = {
        Page: data.Page,
        Size: data.Size,
        UserSelectType: data.UserSelectType,
    }
    return request.get({ url: '/api/user/page', params: params })
}


export const addAdminApi = (data: any) => {
    return request.post({ url: '/api/user/add', data })
}


