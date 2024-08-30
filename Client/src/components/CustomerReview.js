import React, { memo, useState, useEffect, useCallback } from "react";
import { apiGetProduct, apiRatings } from "../apis";
import { renderStar } from "../ultils/helper";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImStarFull } from "react-icons/im";
import { Button, WriteReview, RenderReview } from "./";
import { SlNote } from "react-icons/sl";
import Swal from "sweetalert2";
import avt from "../assets/avtDefault.avif";
import moment from "moment";

const CustomerReview = ({ nameProduct }) => {
  const [product, setProduct] = useState(null);
  const { pid } = useParams();
  const [isWrite, setIsWrite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const { isLoggedIn } = useSelector((state) => state.user);

  const handleSubmitReviewOption = async (star, comment) => {
    if (!star || !comment) {
      alert("Missing information");
      return;
    }
    try {
      const response = await apiRatings({ star, comment, pid, createdAt: Date.now() });
      console.log("API Response:", response);
      console.log("Success Status:", response.success);

      if (response.success) {
        setReviews((prevReviews) => [
          ...prevReviews,
          { star, comment, createdAt: new Date() },
        ]);
        setIsWrite(false);

        Swal.fire({
          title: "Review Submitted!",
          text: "Thank you for your feedback.",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        console.error(
          "Failed to submit review:",
          response.message || "Unknown error"
        );
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  // Toggle review form
  const handleWriteReview = useCallback(() => {
    setIsWrite((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await apiGetProduct(pid);
        if (response.success) setProduct(response.productData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (pid) fetchProductData();
  }, [pid]);

  // Render rating overview
  const renderRatingOverview = () => {
    if (!product) return null;

    const totalReviews = product.ratings?.length || 0;

    return (
      <div>
        <h3 className="text-[22px] font-semibold capitalize">
          Khách hàng đánh giá
        </h3>
        <div className="text-[16px] mt-2">
          <span>Tổng quan</span>
          <div className="flex items-center mt-2">
            <span className="flex items-center pr-4 text-[48px] font-semibold text-main">
              {product.totalRatings || 0}
            </span>
            <span className="flex items-center gap-2 text-main">
              {renderStar(product.totalRatings || 0, 24)?.map((el, index) => (
                <span key={index}>{el}</span>
              ))}
            </span>
          </div>
          <span className="text-[16px] font-light text-gray-500">{`( ${totalReviews} Review )`}</span>
        </div>
      </div>
    );
  };

  // Render star ratings
  const renderStarRatings = () => {
    if (!product || !product.ratings) return null;

    return [5, 4, 3, 2, 1].map((star) => {
      const count = product.ratings.filter((r) => r.star === star).length || 0;
      const percentage = (count / (product.ratings.length || 1)) * 100;

      return (
        <div key={star} className="flex items-center mt-6">
          <span className="text-[18px] flex items-center justify-between px-1 mr-1 -mt-2 font-light w-[10%]">
            {star} <ImStarFull className="text-main" size={16} />
          </span>
          <div className="flex-grow bg-gray-300 mx-2 h-[6px] rounded-l-full rounded-r-full">
            <div
              className="bg-main h-[6px] rounded-l-full rounded-r-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="text-[14px] font-light w-[15%] text-center">
            {count}
          </span>
        </div>
      );
    });
  };

  const renderReviews = () => {
    return product?.ratings?.map((review, index) => (
      <div key={index} className="p-4 border-b">
        <div className="flex items-center">
          {/* Avatar */}
          <div className="p-2 flex-none">
            <img
              src={review.postedBy?.avatar || avt} 
              alt="avatar"
              className="w-[60px] h-[60px] object-cover rounded-full"
            />
          </div>
          {/* Name and Date */}
          <div className="flex flex-col flex-auto">
            <div className="flex flex-col ">
              <h3 className="flex font-semibold">{`${review.postedBy?.lastname} ${review.postedBy?.firstname}` || "Anonymous"}</h3>
              <span className="flex text-sm text-gray-500">
                {moment(review.createdAt).fromNow()} {/* Display when the review was posted */}
              </span>
            </div>
          </div>
          {/* Star Rating */}
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1 text-main">
              {renderStar(review.star)?.map((el, i) => (
                <span key={i}>{el}</span>
              ))}
            </span>
            <span className="ml-4 text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()} {/* Display exact date */}
            </span>
          </div>
        </div>
        {/* Comment */}
        <p className="mt-2 text-gray-700">{review.comment}</p>
      </div>
    ));
  };
 

  return (
    <div className="relative flex w-full h-[600px] bg-[#F5F5FA] shadow-md p-4 rounded-lg">
      {isWrite && isLoggedIn && (
        <WriteReview
          nameProduct={nameProduct}
          handleSubmitReviewOption={handleSubmitReviewOption}
          onClose={handleWriteReview}
        />
      )}
      <div className="flex w-full bg-white p-6 rounded-lg">
        <div className="w-2/5 flex flex-col border-r-2 mr-8">
          {renderRatingOverview()}
          {renderStarRatings()}
          {isLoggedIn && (
            <div className="w-full flex">
              <Button
                handleOnClick={handleWriteReview}
                name="Write A Review Now"
                style="bg-main flex items-center mt-6 hover:bg-[#45624E] text-white font-semibold py-3 px-5 rounded"
                iconBefore={<SlNote />}
              />
            </div>
          )}
        </div>
        <div className="w-3/5 flex flex-col gap-4">
        {renderReviews()}
        
        </div>
      </div>
    </div>
  );
};

export default memo(CustomerReview);