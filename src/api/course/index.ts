import request from '@/axios'

// 课程分页查询
export const getCoursePageApi = (params): Promise<IResponse<[]>> => {
  return request.get({
    url: '/api/course/page',
    params
  })
}
