import axios from '../axios'

export const apiGetProducts =(params) => axios ({
    url: '/product',
    method: 'get',
    params
})


export const apiGetProduct =(pid) => axios ({
    url: '/product/' + pid,
    method: 'get',
})

export const apiRatings =(data) => axios ({
    url: '/product/ratings',
    method: 'put',
    data
})

export const apiCreateProduct =(data) => axios ({
    url: '/product/',
    method: 'post',
    data
})

export const apiUpdateProduct =(data, pid) => axios ({
    url: '/product/' + pid,
    method: 'put',
    data
})

export const apiDeleteProduct =(pid) => axios ({
    url: '/product/' + pid,
    method: 'delete',
})

export const apiAddVariant =(data, pid) => axios ({
    url: '/product/variant/' + pid,
    method: 'put',
    data
})

export const apiCreateOrder =(data) => axios ({
    url: '/order/',
    method: 'post',
    data
})

export const apiGetOrderByAdmin =(params) => axios ({
    url: '/order/admin',
    method: 'get',
    params
})

export const apiGetOrderToDay =(params) => axios ({
    url: '/order/admin/order-today',
    method: 'get',
    params
})


export const apiGetOrderByUser =(params) => axios ({
    url: '/order/',
    method: 'get',
    params
})

export const apiUpdateOrderStatus = (oid, data) => {
    return axios({
        url: `/order/status/${oid}`, 
        method: 'put',
        data,
    });
};


export const apiUpdatePaymentStatus = (oid, data) => {
    return axios({
        url: `/order/paymentStatus/${oid}`, 
        method: 'put',
        data,
    });
};

export const apiCancelOrder =(oid) => axios ({
    url: '/order/' + oid,
    method: 'delete',
})

export const apiGetOrderDetails =(oid) => axios ({
    url: '/order/{$oid}',
    method: 'get',
})

export const apiCreateGoodsReceipt =(data) => axios ({
    url: '/purchaseorder/',
    method: 'post',
    data
})

export const apiGetReceipts  = (params) => axios({
    url: '/purchaseorder/',
    method: 'get',
    params
})