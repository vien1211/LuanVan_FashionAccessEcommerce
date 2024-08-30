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
  CreateBrand
} from "./pages/admin";
import { MemberLayout, Personal, MyCart, WishList, History } from "./pages/member";
import path from "./ultils/path";
import { getAllCategory } from "./store/app/AsyncAction";

import { useDispatch, useSelector } from "react-redux";
import { Modal } from "./components";
function App() {
  const dispatch = useDispatch();
  const { isShowModal, modalChildren } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);




  

  return (
    <div className="min-h-screen font-main">
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blog />} />
          <Route
            path={path.DETAIL_PRODUCT_WITH_PARAMS}
            element={<DetailProduct />}
          />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.OUR_SERVICE} element={<Service />} />
          <Route path={path.PRODUCTS} element={<Product />} />
          <Route path={path.PRODUCT_LIST} element={<ProductList />} />
          <Route path={path.BRAND_PRODUCTS} element={<Product />} />
          <Route path={path.RESET_PASSWWORD} element={<ResetPassword />} />
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
        </Route>

        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
          <Route path={path.MY_CART} element={<MyCart />} />
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
