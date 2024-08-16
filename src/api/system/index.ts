import request from '@/axios'


export const saveconfig = (data) => {

    let newdata: any = {
        ID: data.ID,
        SystemName: data.SystemName,
        SystemLogo: data.SystemLogo,
        SystemDescription: data.SystemDescription,
        CoachSalary: data.CoachSalary,
    }
    data = newdata
    return request.post({ url: '/api/conf/saveOrUpdate', data })

}