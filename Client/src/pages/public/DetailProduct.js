import React, { useState, useEffect, useCallback } from "react";
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { apiGetProduct, apiUpdateCart, apiUpdateWishlist } from "../../apis";
import Breadcrumb from "../../components/Breadcrumb";
import Slider from "react-slick";
import { formatMoney, renderStar } from "../../ultils/helper";
import clsx from "clsx";
import DOMPurify from "dompurify";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

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
import Modal from "react-modal";
import { IoCloseCircle } from "react-icons/io5";
import { HiShoppingBag } from "react-icons/hi2";
import { PiSunHorizonFill } from "react-icons/pi";
import { GoHeartFill } from "react-icons/go";
const { TbShoppingBag, CiEdit } = icons;

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

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  const customStyles = {
    content: {
      top: "55%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      borderRadius: "20px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  };

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

  console.log(product)

  const handleSelectOption = async (e) => {
    e.stopPropagation();

    if (!current) {
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
          cancelButton: "custom-cancel-button",
        },
      }).then((rs) => {
        if (rs.isConfirmed) {
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location.pathname,
            }).toString(),
          });
        }
      });
    }

    const response = await apiUpdateWishlist(pid);
    if (response.success) {
      dispatch(getCurrentUser());
      Swal.fire({
        title: "Updated!",
        text: "Updated Your Wishlist!",
        icon: "success",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      });
    } else {
      Swal.fire({
        title: "Oops!",
        text: "Fail To Add Wishlist!",
        icon: "error",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      });
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
    const availableStock =
      product?.stockInfo?.[curentProduct?.color]?.quantity ||
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

    const productPrice = curentProduct?.price || product?.price || 0;
    if (productPrice <= 0) {
      return Swal.fire({
        title: "Not Ready!",
        text: "This product is not ready yet, you can add it to your favorites and wait later",
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
      // quantity: quantity,
      quantity,
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

  // const handleQuantity = useCallback(
  //   (number) => {
  //     const qty = Math.max(
  //       1,
  //       Math.min(
  //         Number(number) || 1,
  //         product?.stockInfo?.[curentProduct?.color]?.quantity ||
  //           product?.stockInfo?.[product?.color]?.quantity ||
  //           1
  //       )
  //     );
  //     setQuantity(qty);
  //   },
  //   [curentProduct?.color, product?.stockInfo]
  // );

  // const handleChangeQuantity = useCallback(
  //   (flag) => {
  //     setQuantity((prev) => {
  //       //const maxQuantity = curentProduct.quantity || product?.quantity;
  //       const maxQuantity =
  //         product?.stockInfo[curentProduct.color]?.quantity ||
  //         product?.stockInfo[product.color]?.quantity ||
  //         1;
  //       if (flag === "minus" && prev > 1) {
  //         return prev - 1;
  //       }
  //       if (flag === "plus" && prev < maxQuantity) {
  //         return prev + 1;
  //       }
  //       return prev;
  //     });
  //   },
  //   // [product?.quantity, curentProduct.quantity]
  //   [curentProduct?.color, product?.stockInfo]
  // );

  const handleQuantity = useCallback(
    (number) => {
      const qty = Math.max(
        1,
        Math.min(
          Number(number) || 1,
          product?.stockInfo?.[curentProduct?.color]?.quantity ||
            product?.stockInfo?.[product?.color]?.quantity ||
            1
        )
      );
  
      // Check if quantity exceeds available stock
      const maxQuantity =
        product?.stockInfo?.[curentProduct?.color]?.quantity ||
        product?.stockInfo?.[product?.color]?.quantity ||
        1;
  
      if (qty > maxQuantity) {
        Swal.fire({
          title: "Not enough stock!",
          text: `Only ${maxQuantity} items are available in stock.`,
          icon: "warning",
          confirmButtonText: "OK",
        });
        return; // Do not update quantity if it exceeds stock
      }
  
      setQuantity(qty);
    },
    [curentProduct?.color, product?.stockInfo]
  );
  
  const handleChangeQuantity = useCallback(
    (flag) => {
      setQuantity((prev) => {
        const maxQuantity =
          product?.stockInfo?.[curentProduct.color]?.quantity ||
          product?.stockInfo?.[product.color]?.quantity ||
          1;
  
        if (flag === "minus" && prev > 1) {
          return prev - 1;
        }
  
        if (flag === "plus" && prev < maxQuantity) {
          return prev + 1;
        }
  
        // Show Swal if trying to increase quantity beyond stock
        if (flag === "plus" && prev >= maxQuantity) {
          Swal.fire({
            title: "Not enough stock!",
            text: `Only ${maxQuantity} items are available in stock.`,
            icon: "warning",
            confirmButtonText: "OK",
            customClass: {
              title: "custom-title",
              text: "custom-text",
              confirmButton: "custom-confirm-button",
              cancelButton: "custom-cancel-button",
            },
          });
        }
  
        return prev;
      });
    },
    [curentProduct?.color, product?.stockInfo]
  );
  

  useEffect(() => {
    if (pid) fetchProductData();
    window.scrollTo(0, 0);
  }, [pid, variant]);

  const handleEditAddress = () => {
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
          cancelButton: "custom-cancel-button",
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
    navigate({
      pathname: `/${path.MEMBER}/${path.PERSONAL}`,
      search: createSearchParams({ redirect: location.pathname }).toString(),
    });
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {!isQuickView && (
        <div className="h-[50px] flex justify-center items-center p-4 bg-[#F2F7F4] rounded-lg">
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
          <div className="border bg-[#F5F5FA] p-4 rounded-lg cursor-pointer">
            <img
              src={mainImage}
              alt="product"
              className={clsx(
                "object-contain rounded-lg shadow-md",
                isQuickView
                  ? "h-[300px] w-[300px] object-cover"
                  : "h-[500px] w-[500px] object-cover"
              )}
              onClick={() => openModal(mainImage)}
            />

            <Modal
              isOpen={isOpen}
              onRequestClose={closeModal}
              style={customStyles}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2 className="font-main">Product Image</h2>
                <button onClick={closeModal}>
                  <IoCloseCircle size={24} color="#952E41" />
                </button>
              </div>
              {selectedImage && (
                <Zoom>
                  <img
                    src={selectedImage}
                    alt="large product"
                    className="max-w-full h-[600px] py-2"
                  />
                </Zoom>
              )}
            </Modal>
          </div>
          <div className="w-full bg-[#F5F5FA] p-3 rounded-lg z-0">
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

                  {/* <span className="text-[14px] font-light">
                    In Stock:{" "}
                    <strong className="text-main">
                      {product?.stockInfo?.[curentProduct?.color]?.quantity ||
                        product?.stockInfo?.[product?.color]?.quantity ||
                        0}{" "}
                    </strong>
                  </span> */}

                  <div
                    title="Add to Wishlist"
                    onClick={(e) => handleSelectOption(e)}
                    className="cursor-pointer w-fit"
                  >
                    <div className="hover:bg-[#273526] text-white w-[40px] h-[40px] flex items-center justify-center rounded-full transition-colors duration-300 border-main border-2 ease-out bg-white hover:text-[#6D8777] hover:border-[#273526]">
                      <GoHeartFill
                        size={18}
                        color={
                          current?.wishlist?.some((i) => i._id === pid)
                            ? "#FC3C44"
                            : "gray"
                        }
                        className="transition-transform duration-500 ease-in-out hover:scale-125"
                      />
                    </div>
                  </div>
                </div>
              )}

              {!isQuickView && (
                <div className="flex items-center mt-2">
                  <Link
                    to={`/products?brand=${product?.brand}`}
                    className="text-[16px] text-white bg-[#be8152] px-3 rounded-full"
                  >{`${product?.brand}`}</Link>
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
                <span className="text-[16px] ml-4 font-light border-r pr-4">{`Sold: ${
                  curentProduct.sold || product?.sold
                }`}</span>
                <span className="text-[16px] ml-4 font-light pr-4 border-r">{`Review: ${
                  product?.ratings?.length || 0
                }`}</span>
                {!isQuickView && (
                  <span className="text-[16px] ml-4 font-light pr-4">
                    In Stock:{" "}
                    <strong className="text-main">
                      {product?.stockInfo?.[curentProduct?.color]?.quantity ||
                        product?.stockInfo?.[product?.color]?.quantity ||
                        0}{" "}
                    </strong>
                  </span>
                )}
              </div>

              {/* <div className="text-[30px]  font-semibold text-[#D86D6D] mt-4">{`${formatMoney(
                curentProduct.price || product?.price
              )} VNĐ`}</div> */}
              <div className="text-[30px] font-semibold text-[#D86D6D] mt-4">
                {curentProduct.price || product?.price
                  ? `${formatMoney(curentProduct.price || product?.price)} VNĐ`
                  : "Not Available"}
              </div>

              <div className="flex items-center text-[18px] mt-3">
                <div className="w-full mr-2 flex flex-col gap-4">
                  <div className="flex w-full items-center">
                    <div className="px-3 bg-main w-fit rounded-full text-[14px] text-white">
                      Colors Option
                    </div>
                    <span className="flex-1 mx-2 border-b border-gray-300"></span>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center w-full px-4">
                    <div
                      onClick={() => setVariant(null)}
                      className={clsx(
                        "flex gap-2 items-center p-2 border cursor-pointer rounded-xl hover:border-gray-400",
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
                          "flex gap-2 items-center p-2 border cursor-pointer rounded-xl hover:border-gray-400",
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

              <div className="flex flex-col text-[18px] mt-4">
                <div className="flex gap-4 items-center">
                  <div className="px-3 bg-main w-fit rounded-full text-[14px] text-white">
                    Add Product
                  </div>
                  <span className="flex-1  border-b border-gray-300"></span>
                </div>

                <div className="flex px-4 gap-6 items-center justify-between mt-3 bg-[#dde5de] rounded-lg py-3">
                  <div className="flex gap-4 items-center">
                    <span className="text-[16px] text-main px-2 py-1">
                      Change
                    </span>
                    <SelectQuantity
                      quantity={quantity}
                      handleQuantity={handleQuantity}
                      handleChangeQuantity={handleChangeQuantity}
                    />
                  </div>
                  <div>
                    <Button
                      name="Add To Cart"
                      onClick={handleAddToCart}
                      style="flex items-center bg-white text-main border border-main p-2 rounded-lg w-[180px] hover:bg-main hover:text-white"
                      iconBefore={<HiShoppingBag size={32} />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F5FA] rounded-lg p-4">
            <div className="bg-white px-4 rounded-lg shadow-md">
              <div className="flex flex-col text-[18px]">
                <div className="mr-2 mt-3 flex gap-4 items-center">
                  <div className="px-3 bg-main w-fit rounded-full text-[14px] text-white">
                    Shipping Information
                  </div>
                  <span className="flex-1 border-b border-gray-300"></span>
                </div>

                <div className="flex justify-between mt-2">
                  <div>
                    <span className="text-[16px] ml-2">{`Delivered to`}</span>
                    <span className="text-[16px] font-medium ml-2 text-red-400">
                      {current?.address || "No Shipping Address Available"}
                    </span>
                  </div>
                  <button
                    onClick={handleEditAddress}
                    className="flex text-main gap-2 text-[16px] cursor-pointer"
                  >
                    Change
                    <CiEdit size={24} />
                  </button>
                </div>

                <div className="flex flex-col mb-2">
                  <div className="flex gap-2 px-2 items-center mt-1">
                    <PiSunHorizonFill size={28} color="#dcb04a" />
                    <span className="text-[16px] font-medium">
                      Delivery time is 3 to 5 days from order date
                    </span>
                  </div>
                  <div className="flex flex-col text-[14px] ml-[2.75rem]">
                    8am - 6pm weekdays, except Sundays
                  </div>
                </div>

                {!isQuickView && (
                  <div className="flex gap-3 items-center py-2 mt-1 mb-2">
                    <div className="text-[14px] bg-slate-200 rounded-[5px] px-2">
                      <span className="text-main font-semibold">VIEEN'S </span>
                      <span className="text-red-600 font-bold">Express</span>
                    </div>
                    <div className="text-[13px]">
                      Freeship 25K for orders from 5M, Freeship 50K for orders
                      from 50M
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isQuickView && (
        <div className="w-main m-auto mt-8 bg-[#F5F5FA] rounded-lg p-4">
          <div className="relative flex items-center">
            <span className="text-[22px] text-[#45623E] font-semibold py-3 pl-4 relative">
              Product Description
            </span>
            <div className="flex-grow ml-2"></div>
          </div>

          <div className=" font-light text-[16px] pl-4 mb-4">
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
          </div>
        </div>
      )}

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
