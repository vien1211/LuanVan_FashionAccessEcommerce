import axios from '../axios'

export const apiGetCoupon =(data) => axios ({
    url: '/coupon/',
    method: 'get',
    data
})

export const apiCreateCoupon =(data) => axios ({
    url: '/coupon/',
    method: 'post',
    data
})

export const apiApplyCoupon =(data) => axios ({
    url: '/coupon/apply',
    method: 'post',
    data
})

export const apiCancelApplyCoupon =(data) => axios ({
    url: '/coupon/remove-coupon',
    method: 'post',
    data
})

export const apiUpdateCoupon =(data, cid) => axios ({
    url: `/coupon/${cid}`,
    method: 'put',
    data
})

export const apiDeleteCoupon =(cid) => axios ({
    url: '/coupon/' + cid,
    method: 'delete',
})