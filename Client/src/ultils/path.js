const path = {
    PUBLIC: "/",
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    
    PRODUCTS__CATE: ':category',  
    PRODUCTS: 'products', 
    BRAND_PRODUCTS: 'products?brand=:brandId',
    DETAIL_BLOG: '/:bid/:title',
    BLOGS: 'blogs',
    OUR_SERVICE: 'service',
    FAQ: 'faq',
    DETAIL_PRODUCT_WITH_PARAMS: '/:category/:pid/:title',
    VERIFY_REGISTER: 'verifyregister/:status',
    RESET_PASSWWORD: 'reset-password/:token',
    DETAIL_CART: 'my-cart',
    CHECKOUT: 'checkout',

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
    MANAGE_SUPPLIER: 'manage-supplier',
    ADD_SUPPLIER: 'add-supplier',
    INVENTORY: 'inventory',
    IMPORT_GOODS: 'import-goods',
    MANAGE_GOODS_RECEIPT: 'manage-goods-receipt',

    MANAGE_BLOG_CATEGORY: 'manage-blog-category',
    CREATE_BLOG_POST: 'create-blog-post',
    MANAGE_BLOG_POST: 'manage-blog-post',

    MEMBER: 'member',
    PERSONAL: 'personal',
    MY_CART: 'my-cart',
    WISHLIST: 'wishlist',
    HISTORY: 'order-history',
    M_BLOG: 'm-blog',
    M_BLOG_LIST: 'm-blog-list'
}

export default path