import axios from '../axios'

export const apiAddSupplier = (data) => axios({
    url: '/supplier/',
    method: 'post',
    data
})

export const apiGetSuppliers  = (params) => axios({
    url: '/supplier/',
    method: 'get',
    params
})

export const apiUpdateSupplier  = (data, sid) => axios({
    url: '/supplier/' + sid,
    method: 'put',
    data
})

export const apiDeleteSupplier  = (sid) => axios({
    url: '/supplier/' + sid,
    method: 'delete',
})