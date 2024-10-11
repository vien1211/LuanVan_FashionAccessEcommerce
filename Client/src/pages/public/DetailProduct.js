import React, { useState, useEffect, useCallback } from "react";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { apiGetProduct, apiUpdateCart } from "../../apis";
import Breadcrumb from "../../components/Breadcrumb";
import Slider from "react-slick";
import { formatMoney, renderStar } from "../../ultils/helper";
import clsx from "clsx";
import DOMPurify from "dompurify";

import {
  Button,
  SelectQuantity,
  CustomerReview,
  RelatedProduct,
} from "../../components";
import icons from "../../ultils/icons";
import { useDispatch, useSelector } from "react-redux";
import path from "../../ultils/path";
import Swal from "sweetalert2";
import { getCurrentUser } from "../../store/user/asyncActions";

const { TbShoppingBag } = icons;

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

const DetailProduct = ({ isQuickView, data }) => {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(null);
  const [pid, setPid] = useState(null);
  const [category, setCategory] = useState(null);
  const [curentProduct, setCurrentProduct] = useState({
    title: "",
    images: "",
    price: "",
    color: "",
    quantity: 0,
    sold: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.user);

  useEffect(() => {
    if (data) {
      setPid(data.pid);
      setCategory(data.category);
    } else if (params && params.pid) {
      setPid(params.pid);
      setCategory(params.category);
    }
  }, [data, params]);

  useEffect(() => {
    if (variant) {
      const selectedVariant = product?.variant?.find(
        (el) => el.sku === variant
      );
      if (selectedVariant) {
        setCurrentProduct({
          title: selectedVariant?.title,
          color: selectedVariant?.color,
          price: selectedVariant?.price,
          quantity: selectedVariant?.quantity,
          sold: selectedVariant?.sold,
          images: selectedVariant?.images || [],
        });
        setMainImage(
          selectedVariant.images?.[0] ||
            "https://www.proclinic-products.com/build/static/default-product.30484205.png"
        );
      }
    } else if (product) {
      setCurrentProduct({
        title: product.title,
        images: product.images || [],
        price: product.price,
        quantity: product.quantity,
        color: product.color,
        sold: product.sold,
      });
      setMainImage(
        product.images?.[0] ||
          "https://www.proclinic-products.com/build/static/default-product.30484205.png"
      );
    }
  }, [variant]);

  const fetchProductData = async () => {
    try {
      const response = await apiGetProduct(pid);
      if (response.success) {
        setProduct(response.productData);
        if (!variant) {
          setMainImage(
            response.productData.images?.[0] ||
              "https://www.proclinic-products.com/build/static/default-product.30484205.png"
          );
        }
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const handleAddToCart = async () => {
    // Kiểm tra nếu người dùng chưa đăng nhập
    if (!current)
      return Swal.fire({
        title: "Almost...",
        text: "Please Log In To Do This Action",
        icon: "info",
        confirmButtonText: "Go Log In",
        showCancelButton: true,
        cancelButtonText: "Not now!",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      }).then((rs) => {
        if (rs.isConfirmed)
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location.pathname,
            }).toString(),
          });
      });

    // Kiểm tra số lượng tồn kho (cho biến thể hoặc sản phẩm chính)
    const availableStock = product?.stockInfo?.[curentProduct?.color]?.quantity ||
      product?.stockInfo?.[product?.color]?.quantity ||
      // curentProduct?.quantity ||
      // product?.quantity ||
      0;

    if (availableStock <= 0) {
      return Swal.fire({
        title: "Out of Stock",
        text: "This product is currently out of stock!",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
    }

    // Tiếp tục cập nhật giỏ hàng nếu còn hàng
    const response = await apiUpdateCart({
      pid,
      color: curentProduct?.color || product?.color, // Kiểm tra biến thể, nếu không có thì dùng sản phẩm chính
      quantity: quantity,
      price: curentProduct?.price || product?.price,
      image: curentProduct?.images[0] || product?.images[0],
      title: curentProduct?.title || product?.title,
    });

    // Kiểm tra kết quả phản hồi từ API
    if (response.success) {
      Swal.fire({
        title: "Updated",
        text: "Update Cart Successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      dispatch(getCurrentUser());
    } else {
      Swal.fire({
        title: "Oops!",
        text: "Failed to Update Cart!",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
    }
  };

  const handleQuantity = useCallback((number) => {
    const qty = Number(number);
    if (qty > 0) {
      setQuantity(qty);
    }
  }, []);

  const handleChangeQuantity = useCallback(
    (flag) => {
      setQuantity((prev) => {
        //const maxQuantity = curentProduct.quantity || product?.quantity;
        const maxQuantity =
          product?.stockInfo[curentProduct.color]?.quantity ||
          product?.stockInfo[product.color]?.quantity;
        if (flag === "minus" && prev > 1) {
          return prev - 1;
        }
        if (flag === "plus" && prev < maxQuantity) {
          return prev + 1;
        }
        return prev;
      });
    },
    [product?.quantity, curentProduct.quantity]
  );

  useEffect(() => {
    if (pid) fetchProductData();
    window.scrollTo(0, 0);
  }, [pid, variant]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {!isQuickView && (
        <div className="h-[50px] flex justify-center items-center p-4 bg-[#F5F5FA]">
          <div className="w-main">
            <Breadcrumb
              title={curentProduct.title || product?.title}
              category={category}
            />
          </div>
        </div>
      )}

      <div
        className={clsx(
          "w-main m-auto flex gap-4 mt-4",
          isQuickView ? "max-w-[900px] bg-white p-6 rounded-lg" : "w-main"
        )}
      >
        {/* Product Image and Thumbnail Slider */}
        <div
          className={clsx("w-2/5 flex flex-col gap-4", isQuickView && "w-1/5")}
        >
          <div className="border bg-[#F5F5FA] p-4 rounded-lg">
            <img
              src={mainImage}
              alt="product"
              className={clsx(
                "object-contain rounded-lg",
                isQuickView
                  ? "h-[300px] w-[300px] object-cover"
                  : "h-[500px] w-[500px] object-cover"
              )}
            />
          </div>
          <div className="w-full bg-[#F5F5FA] p-3 rounded-lg">
            <Slider {...settings}>
              {(curentProduct.images?.length > 0
                ? curentProduct.images
                : product?.images
              )?.map((el, index) => (
                <div key={index} className="px-1">
                  <img
                    src={el}
                    alt={`Sub image ${index}`}
                    className={clsx(
                      "bg-white rounded-md shadow-sm",
                      isQuickView
                        ? "h-[80px] w-[80px] object-cover"
                        : "h-[120px] w-[120px] object-cover",
                      "object-contain p-2 cursor-pointer"
                    )}
                    onClick={() => setMainImage(el)}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Product Information, Quantity Selector, and Add to Cart Button */}
        <div className="w-3/5 flex flex-col">
          <div className="h-[auto] flex flex-col mb-4 p-4 rounded-lg bg-[#F5F5FA]">
            <div className="bg-white p-4 rounded-lg shadow-md">
              {!isQuickView && (
                <div className=" flex items-center justify-between">
                  <span className="text-[35px] w-[80%] font-semibold">
                    {curentProduct.title || product?.title}
                  </span>
                  {/* <span className="text-[14px] font-light mr-10">{`Kho: ${
                    curentProduct.quantity || product?.quantity
                  }`}</span> */}
                  <span className="text-[14px] font-light mr-5">
                    In Stock:{" "}
                    {/* {product?.stockInfo?.[curentProduct.color]?.quantity || product?.stockInfo?.[product.color]?.quantity || curentProduct.quantity || product?.quantity || 0} available */}
                    <strong className="text-main">{product?.stockInfo?.[curentProduct?.color]?.quantity ||
                      product?.stockInfo?.[product?.color]?.quantity ||
                      // curentProduct?.quantity ||
                      // product?.quantity ||
                      0} </strong>
                  </span>
                </div>
              )}

              {!isQuickView && (
                <div className="flex items-center mt-2">
                  <span className="text-[16px] ml-2">{`By ${product?.brand}`}</span>
                </div>
              )}
              <div className="flex items-center mt-4 ">
                <span className="flex items-center gap-2 text-main">
                  {renderStar(product?.totalRatings)?.map((el, index) => (
                    <span key={index}>{el}</span>
                  ))}
                </span>
                <span className="flex items-center ml-4 border-r pr-4">
                  {`${product?.totalRatings}`}
                </span>
                <span className="text-[16px] ml-4 font-light border-r pr-4">{`Đã bán: ${
                  curentProduct.sold || product?.sold
                }`}</span>
                <span className="text-[16px] ml-4 font-light">{`Review: ${
                  product?.ratings?.length || 0
                }`}</span>
              </div>

              <div className="text-[30px]  font-semibold text-[#D86D6D] mt-4">{`${formatMoney(
                curentProduct.price || product?.price
              )} VNĐ`}</div>

              <div className="relative border-t border-main mt-2 flex items-center">
                <span className="text-[22px] text-[#45623E] font-semibold py-3 pl-4 bg-white relative">
                Description
                </span>
                <div className="flex-grow ml-2"></div>
              </div>

              <ul className="list-disc list-inside font-light text-[16px] pl-4 mb-4">
                {product?.description?.length > 1 &&
                  product?.description?.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}

                {product?.description?.length === 1 && (
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(product?.description[0]),
                    }}
                  ></div>
                )}
              </ul>
            </div>
          </div>
          <div className="h-[auto] mb-4 p-4 rounded-lg bg-[#F5F5FA]">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between text-[18px]">
                <div className="mr-2 flex gap-4 items-center">
                  <span>Color</span>
                  <div className="flex flex-wrap gap-4 items-center w-full">
                    <div
                      onClick={() => setVariant(null)}
                      className={clsx(
                        "flex gap-2 items-center p-2 border cursor-pointer rounded-xl",
                        !variant && "border-[#488249]"
                      )}
                    >
                      {/* Check for product.images existence and display the first image */}
                      {isQuickView ? (
                        product?.images?.length > 0 && (
                          <img
                            src={product.images[0]}
                            alt="img"
                            className="w-8 h-8 object-cover rounded-lg"
                          />
                        )
                      ) : (
                        <>
                          {product?.images?.length > 0 && (
                            <img
                              src={product.images[0]}
                              alt="img"
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          )}
                          <span className="flex flex-col">
                            <span>
                              {product?.color || "No Color Available"}
                            </span>
                            <span className="text-xs">
                              {product?.price
                                ? `${formatMoney(product?.price)} VNĐ`
                                : "No Price Available"}
                            </span>
                          </span>
                        </>
                      )}
                    </div>

                    {product?.variant?.map((el, index) => (
                      <div
                        key={index}
                        className={clsx(
                          "flex gap-2 items-center p-2 border cursor-pointer rounded-xl",
                          variant === el.sku && "border-[#488249]"
                        )}
                        onClick={() => setVariant(el.sku)}
                      >
                        {/* Check for el.images existence and display the first image */}
                        {isQuickView ? (
                          el?.images?.length > 0 && (
                            <img
                              src={el.images[0]}
                              alt="img"
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          )
                        ) : (
                          <>
                            {el?.images?.length > 0 && (
                              <img
                                src={el.images[0]}
                                alt="img"
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                            )}
                            <span className="flex flex-col">
                              <span>{el?.color || "No Color Available"}</span>
                              <span className="text-xs">
                                {el?.price
                                  ? `${formatMoney(el?.price)} VNĐ`
                                  : "No Price Available"}
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[auto] mb-4 p-4 rounded-lg bg-[#F5F5FA]">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between text-[18px]">
                <div className="mr-2 flex gap-4 items-center">
                  <span>Số Lượng</span>
                  <SelectQuantity
                    quantity={quantity}
                    handleQuantity={handleQuantity}
                    handleChangeQuantity={handleChangeQuantity}
                  />
                </div>

                <Button
                  name="Add to Cart"
                  onClick={handleAddToCart}
                  style="flex items-center bg-main text-white p-2 rounded-lg w-[180px] hover:bg-white hover:border hover:border-main hover:text-main"
                  iconBefore={<TbShoppingBag size={32} />}
                />
                {/* {curentProduct.quantity <= 0  ? (
                  <span className="text-red-500 font-bold">Out Of Stock</span>
                ) : (
                  <Button
                    name="Add to Cart"
                    onClick={handleAddToCart}
                    style="flex items-center bg-main text-white p-2 rounded-lg w-[180px] hover:bg-white hover:border hover:border-main hover:text-main"
                    iconBefore={<TbShoppingBag size={32} />}
                  />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isQuickView && (
        <div className="w-main m-auto mt-8">
          <CustomerReview
            nameProduct={product?.title || "Product Name"}
            pid={product?.id || ""}
            reviews={product?.reviews || []}
          />
        </div>
      )}

      {!isQuickView && (
        <>
          <div className="w-main m-auto mt-4 p-2 ">
            <RelatedProduct />
          </div>
          <div className="h-[80px]"></div>{" "}
        </>
      )}
    </div>
  );
};

export default DetailProduct;
