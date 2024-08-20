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

export const disableUserApi = (id: number) => {
    return request.delete({ url: `/api/user/disable`, params: { ID: id } })
}

export const updataAdminApi = (data: any) => {
    return request.put({ url: '/api/user/update', data })
}

export const updatauserapi = (data: any) => {
    return request.put({ url: '/api/user/update', data })
}


