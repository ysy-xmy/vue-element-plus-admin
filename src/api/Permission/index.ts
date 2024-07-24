import request from '@/axios'
import { UserInfo } from "./type";
export const getalluserApi = () => {
    return request.get<UserInfo>({ url: '/api/user/allUser' })
}