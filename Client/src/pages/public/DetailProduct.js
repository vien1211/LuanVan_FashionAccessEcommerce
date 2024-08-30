import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct } from "../../apis";
import Breadcrumb from "../../components/Breadcrumb";
import Slider from "react-slick";
import { formatMoney, renderStar } from "../../ultils/helper";
import clsx from "clsx";
import DOMPurify from "dompurify";

import {
  Button,
  SelectQuantity,
  InfoProduct,
  CustomerReview,
  RelatedProduct,
} from "../../components";
import icons from "../../ultils/icons";

const { TbShoppingBag } = icons;

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

const DetailProduct = ({isQuickView, data}) => {

  const params = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(null);
  const [pid, setPid] = useState(null)
  const [category, setCategory] = useState(null)
  const [curentProduct, setCurrentProduct] = useState({
    title: "",
    images: "",
    price: "",
    quantity: 0,
    sold: 0
  });

  useEffect(() => {
    if(data) {
      setPid(data.pid)
      setCategory(data.category)
    }
    else if (params && params.pid) {
      setPid(params.pid)
      setCategory(params.category)
    }
  }, [data, params])

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
        sold: product.sold
      });
      setMainImage(
        product.images?.[0] ||
          "https://www.proclinic-products.com/build/static/default-product.30484205.png"
      );
    }
  }, [variant, product]);

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

  const handleAddToCart = () => {
    // Add to cart logic here
  };

  const handleQuantity = useCallback((number) => {
    const qty = Number(number);
    if (qty > 0) {
      setQuantity(qty);
    }
  }, []);

  const handleChangeQuantity = useCallback((flag) => {
    setQuantity((prev) => {
      const maxQuantity = product?.quantity || curentProduct.quantity; 
  
      if (flag === "minus" && prev > 1) {
        return prev - 1;
      }
      if (flag === "plus" && prev < maxQuantity) {
        return prev + 1; 
      }
      return prev;
    });
  }, [product?.quantity, curentProduct.quantity]);
  
  useEffect(() => {
    if (pid) fetchProductData();
    window.scrollTo(0, 0);
  }, [pid]);

  return (
    <div onClick={e => e.stopPropagation()}>
      {!isQuickView &&
      <div className="h-[50px] flex justify-center items-center p-4 bg-[#F5F5FA]">
        <div className="w-main">
          <Breadcrumb
            title={curentProduct.title || product?.title}
            category={category}
          />
        </div>
      </div>}

      <div className={clsx("w-main m-auto flex gap-4 mt-4", isQuickView ? 'max-w-[900px] bg-white p-6 rounded-lg' : 'w-main')}>
        {/* Product Image and Thumbnail Slider */}
        <div className={clsx("w-2/5 flex flex-col gap-4", isQuickView && 'w-1/5')}>
          <div className="border bg-[#F5F5FA] p-4 rounded-lg">
            
            <img
              src={mainImage}
              alt='product'
              className={clsx("object-contain rounded-lg", isQuickView ? "h-[300px] w-[300px] object-cover" : "h-[500px] w-[500px] object-cover")}
            />
          </div>
          <div className="w-full bg-[#F5F5FA] p-3 rounded-lg">
            <Slider {...settings}>
              {(curentProduct.images.length > 0
                ? curentProduct.images
                : product?.images
              )?.map((el, index) => (
                <div key={index} className="px-1">
                  <img
                    src={el}
                    alt={`Sub image ${index}`}
                    className={clsx("bg-white rounded-md shadow-sm", isQuickView ? "h-[80px] w-[80px] object-cover" : "h-[120px] w-[120px] object-cover", "object-contain p-2 cursor-pointer")}
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
              {!isQuickView &&
              <div className=" flex items-center justify-between">
                <span className="text-[35px] w-[60%] font-semibold line-clamp-1">
                  {curentProduct.title || product?.title}
                </span>
                <span className="text-[14px] font-light mr-10">{`Kho: ${curentProduct.quantity || product?.quantity}`}</span>
              </div>}

              {!isQuickView &&
              <div className="flex items-center mt-2">
                <span className="text-[16px] ml-2">{`By ${product?.brand}`}</span>
              </div> }
              <div className="flex items-center mt-4 ">
                <span className="flex items-center gap-2 text-main">
                  {renderStar(product?.totalRatings)?.map((el, index) => (
                    <span key={index}>{el}</span>
                  ))}
                </span>
                <span className="flex items-center ml-4 border-r pr-4">
                  {`${product?.totalRatings}`}
                </span>
                <span className="text-[16px] ml-4 font-light border-r pr-4">{`Đã bán: ${curentProduct.sold }`}</span>
                <span className="text-[16px] ml-4 font-light">{`Review: ${
                  product?.ratings?.length || 0
                }`}</span>
              </div>

              <div className="text-[30px]  font-semibold text-[#D86D6D] mt-4">{`${formatMoney(
                curentProduct.price || product?.price
              )} VNĐ`}</div>

              <div className="relative border-t border-main mt-2 flex items-center">
                <span className="text-[22px] font-semibold py-6 pl-4 bg-white relative">
                  Mô Tả Sản Phẩm
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
              "flex gap-2 items-center p-2 border cursor-pointer",
              !variant && "border-red-500"
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
                    className="w-8 h-8 object-cover rounded-lg"
                  />
                )}
                <span className="flex flex-col">
                  <span>{product?.color || "No Color Available"}</span>
                  <span className="text-sm">
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
                "flex gap-2 items-center p-2 border cursor-pointer",
                variant === el.sku && "border-red-500"
              )}
              onClick={() => setVariant(el.sku)}
            >
              {/* Check for el.images existence and display the first image */}
              {isQuickView ? (
                el?.images?.length > 0 && (
                  <img
                    src={el.images[0]}
                    alt="img"
                    className="w-8 h-8 object-cover rounded-lg"
                  />
                )
              ) : (
                <>
                  {el?.images?.length > 0 && (
                    <img
                      src={el.images[0]}
                      alt="img"
                      className="w-8 h-8 object-cover rounded-lg"
                    />
                  )}
                  <span className="flex flex-col">
                    <span>{el?.color || "No Color Available"}</span>
                    <span className="text-sm">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {!isQuickView &&
      <div className="w-main m-auto mt-8">
        <CustomerReview
          nameProduct={product?.title || "Product Name"}
          pid={product?.id || ""}
          reviews={product?.reviews || []}
        />
      </div> }

      {!isQuickView && <>
      <div className="w-main m-auto mt-4 p-2 ">
        <RelatedProduct />
      </div>

      <div className="h-[80px]"></div> </> }
    </div> 
  );
};

export default DetailProduct;
