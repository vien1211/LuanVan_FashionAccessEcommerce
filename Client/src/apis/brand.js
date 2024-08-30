import axios from '../axios'

export const apiGetAllBrand = (params) => axios({
    url: '/brand',
    method: 'get',
    params
})

export const apiCreateBrand = (data) => axios({
    url: '/brand/',
    method: 'post',
    data
})

export const apiUpdateBrand = (data, bid) => axios({
    url: '/brand/' + bid,
    method: 'put',
    data
})

export const apiDeleteBrand = (bid) => axios({
    url: '/brand/' +bid,
    method: 'delete',
})