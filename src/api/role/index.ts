import request from '@/axios'

export const getRoleListApi = () => {
  return {
    code: 200,
    data: [
      {
        id: 1,
        RoleName: '超级管理员',
        description: '拥有所有权限',
        status: 1
      },
      {
        id: 2,
        RoleName: '管理员',
        description: '拥有管理本店权限',
        status: 1
      },
      // {
      //   id: 3,
      //   RoleName: '普通用户',
      //   description: '普通权限',
      //   status: 1
      // },

    ]
  }
}
