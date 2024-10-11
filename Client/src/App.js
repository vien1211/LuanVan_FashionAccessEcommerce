import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Login,
  Home,
  Public,
  FAQ,
  Service,
  DetailProduct,
  Blog,
  Product,
  ProductList,
  VerifyRegister,
  ResetPassword,
  DetailCart,
  DetailBlog
} from "./pages/public";
import {
  AdminLayout,
  ManageOrder,
  ManageProduct,
  ManageUser,
  CreateProduct,
  Dashboard,
  ManageCategory,
  CreateCategory,
  ManageBrand,
  CreateBrand,
  ManageSupplier,
  CreateSupplier,
  AddSupplier,
  Stock,
  ImportGoods,
  ManageGoodsReceipt,
  ManageBlogCategory,
  CreateBlogPost,
  ManageBlogPost
} from "./pages/admin";
import { MemberLayout, Personal, MyCart, WishList, History, Checkout, CreateBlog, BlogList } from "./pages/member";
import path from "./ultils/path";
import { getAllCategory } from "./store/app/AsyncAction";

import { useDispatch, useSelector } from "react-redux";
import { Cart, Modal } from "./components";
import { showCart } from "./store/app/appSlice";
function App() {
  const dispatch = useDispatch();
  const { isShowModal, modalChildren, isShowCart } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);


  return (
    <div className="min-h-screen relative font-main">
      {isShowCart && <div onClick={() => dispatch(showCart())} className="absolute h-full inset-0 bg-black bg-opacity-70 z-50 flex justify-end">
        <Cart />
      </div>}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.CHECKOUT} element={<Checkout />} />
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blog />} />
          <Route path={path.DETAIL_BLOG} element={<DetailBlog />} />
          <Route
            path={path.DETAIL_PRODUCT_WITH_PARAMS}
            element={<DetailProduct />}
          />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.OUR_SERVICE} element={<Service />} />
          <Route path={path.PRODUCTS__CATE} element={<Product />} />
         
          {/* <Route path={path.BRAND_PRODUCTS} element={<Product />} /> */}
          {/* <Route path={path.M_BLOG} element={<CreateBlog />} /> */}
          <Route path={path.RESET_PASSWWORD} element={<ResetPassword />} />
          <Route path={path.DETAIL_CART} element={<DetailCart />} />
          <Route path={path.ALL} element={<Home />} />
        </Route>

        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.MANAGE_PRODUCT} element={<ManageProduct />} />
          <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
          <Route path={path.MANAGE_CATEGORY} element={<ManageCategory />} />
          <Route path={path.CREATE_CATEGORY} element={<CreateCategory />} />
          <Route path={path.MANAGE_BRAND} element={<ManageBrand />} />
          <Route path={path.CREATE_BRAND} element={<CreateBrand />} />
          <Route path={path.MANAGE_SUPPLIER} element={<ManageSupplier />} />
          <Route path={path.ADD_SUPPLIER} element={<AddSupplier />} />
          <Route path={path.INVENTORY} element={<Stock />} />
          <Route path={path.IMPORT_GOODS} element={<ImportGoods />} />
          <Route path={path.MANAGE_GOODS_RECEIPT} element={<ManageGoodsReceipt />} />
          <Route path={path.MANAGE_BLOG_CATEGORY} element={<ManageBlogCategory />} />
          <Route path={path.CREATE_BLOG_POST} element={<CreateBlogPost />} />
          <Route path={path.MANAGE_BLOG_POST} element={<ManageBlogPost />} />
        </Route>

        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
          <Route path={path.M_BLOG} element={<CreateBlog />} />
          <Route path={path.M_BLOG_LIST} element={<BlogList />} />
          <Route path={path.WISHLIST} element={<WishList />} />
          <Route path={path.HISTORY} element={<History />} />
        </Route>

        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.VERIFY_REGISTER} element={<VerifyRegister />} />
      </Routes>
    </div>
  );
}

export default App;
