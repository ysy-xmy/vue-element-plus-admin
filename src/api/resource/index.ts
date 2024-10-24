import request from '@/axios'
import { pa } from 'element-plus/es/locale'

export const getFirstmenulist = () => {
    return request.get({ url: '/api/action/getFirstByName' })
}

export const getSecByFirst = (FirstID: string) => {
    FirstID = FirstID.toString()
    console.log(FirstID)
    return request.get({ url: '/api/action/getSecByFirst', params: { FirstID: FirstID } })
}


export const getActionsBySec = (SecID: string) => {
    return request.get({ url: '/api/action/getActionsBySec', params: { SecID } })
}

export const addFromFirst = (data: any) => {
    console.log(data)
    return request.post({ url: '/api/action/addFromFirst', data })
}

export const addFirst = (data: any) => {
    return request.post({ url: '/api/action/addFirst', data })
}

export const addSec = (data: any) => {
    return request.post({ url: '/api/action/addSec', data })
}


export const addAction = (data: any) => {
    return request.post({ url: '/api/action/addAction', data })
}


export const updateAction = (data: any) => {
    return request.put({ url: '/api/action/updateAction', data })
}

export const updateImg = (data: any) => {
    return request.put({ url: '/api/action/updateImg', data })
}

export const updateVideo = (data: any) => {
    return request.put({ url: '/api/action/updateVideo', data })
}


export const delFirst = (data: any) => {
    return request.delete({ url: '/api/action/delFirst', data })
}

export const delSec = (data: any) => {
    console.log(data)
    return request.delete({ url: '/api/action/delSec', data })
}

export const delAction = (data: any) => {
    return request.delete({ url: '/api/action/delAction', data })
}

export const delImg = (data: any) => {
    return request.delete({ url: '/api/action/delImg', data })
}


export const delVideo = (data: any) => {
    return request.delete({ url: '/api/action/delVideo', data })
}


export const updateFirst = (data: any) => {
    return request.put({ url: '/api/action/updateFirst', data })
}

export const updateSec = (data: any) => {
    return request.put({ url: '/api/action/updateSec', data })
}
export const getAll = () => {
    return request.get({ url: '/api/action/getAll' })
}



export const getGymInfo = (data: any) => {
    return request.get({ url: '/api/gym/getInfo', data })
}


export const addGym = (data: any) => {
    return request.post({ url: '/api/gym/add', data })
}


export const updateGym = (data: any) => {
    return request.put({ url: '/api/gym/update', data })
}


export const delGym = (data: any) => {
    return request.delete({ url: '/api/gym/delete', data })
}

export const getcourseInfo = (data: any) => {
    return request.get({ url: '/api/course/page', data })
}
export const deletecourse = (data: any) => {
    return request.delete({ url: '/api/course/delete', data })
}
export const getationDetail = (actionId: string) => {
    return request.get({ url: '/api/action/action/detail/' + actionId })
}