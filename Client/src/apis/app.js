import axios from '../axios'

export const apiGetCategories = (params) => axios({
    url: '/productcategory',
    method: 'get',
    params
})

export const apiGetBrands = () => axios({
    url: '/brand',
    method: 'get',
})

export const apiCreateProductCategory = (data) => axios({
    url: '/productcategory/',
    method: 'post',
    data
})

export const apiUpdateCategory = (data, pcid) => axios({
    url: '/productcategory/' + pcid,
    method: 'put',
    data
})

export const apiDeleteCategory = (pcid) => axios({
    url: '/productcategory/' +pcid,
    method: 'delete',
})