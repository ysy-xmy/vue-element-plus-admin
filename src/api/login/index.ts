import request from '@/axios'
import type { UserType } from './types'

interface RoleParams {
  roleName: string
}

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {

  let newdata: any = {
    OpenID: data.username,
    Password: data.password
  }
  data = newdata
  // return request.post({ url: '/api/user/login', data })
  return {
    code: 200,
    data: {
      Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOjEsIk9wZW5JRCI6ImFkbWluIiwiVXNlcm5hbWUiOiJhZG1pbiIsIkF1dGhvcml0eUlkIjpbMV0sIkJ1ZmZlclRpbWUiOjg2NDAwLCJpc3MiOiJQT1NURVIiLCJhdWQiOlsiQ0MiXSwiZXhwIjoxNzIzMTIzNTgwLCJuYmYiOjE3MjI1MTg3ODB9.gFtTwZO82jyEO-JW6sk-GUaMdsX00sZqzsfNoeUlJHY',
      user: data
    }
  }
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.post({ url: '/api/user/logout' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/mock/user/list', params })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}
