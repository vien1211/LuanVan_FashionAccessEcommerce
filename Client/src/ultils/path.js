const path = {
    PUBLIC: "/",
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    
    PRODUCTS: ':category',  
    PRODUCT_LIST: 'products', 
    BRAND_PRODUCTS: 'products?brand=:brandId',

    BLOGS: 'blogs',
    OUR_SERVICE: 'service',
    FAQ: 'faq',
    DETAIL_PRODUCT_WITH_PARAMS: '/:category/:pid/:title',
    
    VERIFY_REGISTER: 'verifyregister/:status',
    RESET_PASSWWORD: 'reset-password/:token',

    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PRODUCT: 'manage-product',
    MANAGE_ORDER: 'manage-order',
    CREATE_PRODUCT: 'create-product',
    MANAGE_CATEGORY: 'manage-category',
    CREATE_CATEGORY: 'create-category',
    MANAGE_BRAND: 'manage-brand',
    CREATE_BRAND: 'create-brand',

    MEMBER: 'member',
    PERSONAL: 'personal',
    MY_CART: 'my-cart',
    WISHLIST: 'wishlist',
    HISTORY: 'order-history'
}

export default path