import React, { memo, useState } from "react";
import { Button } from "./";
import { ReviewOption } from "../ultils/contants";
import { AiFillStar } from "react-icons/ai";

const WriteReview = ({ nameProduct, handleSubmitReviewOption, onClose }) => {
  const [review, setReview] = useState({ star: 5, comment: "" });

  const handleRatingChange = (star) => {
    setReview((prevReview) => ({ ...prevReview, star }));
  };

  const handleSubmit = () => {
    if (review.comment.trim() === "") {
      alert("Please enter a comment");
      return;
    }

    handleSubmitReviewOption(review.star, review.comment);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3 max-w-[90%]">
        <h2 className="text-xl text-center mb-4 line-clamp-1">{`Write a Review for ${nameProduct}`}</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Rating:</label>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {ReviewOption.map((el) => (
              <div
                key={el.id}
                className={`text-[14px] w-[60px] h-[60px] cursor-pointer rounded-md flex items-center justify-center flex-col ${
                  review.star >= el.id
                    ? "bg-main text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => handleRatingChange(el.id)}
                role="button"
                aria-label={`Rate ${el.text}`}
              >
                <AiFillStar
                  color={review.star >= el.id ? "orange" : "gray"}
                  size={24}
                />
                <span>{el.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Comment:</label>
          <textarea
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            className="w-full mt-2 p-2 border rounded"
            rows="4"
            placeholder="Enter your comment here..."
          />
        </div>
        <div className="flex justify-end">
          <Button
            name="Cancel"
            style="bg-gray-500 px-2 py-2 rounded text-white mr-2 hover:bg-gray-800"
            onClick={onClose}
          />
          <Button
            name="Submit"
            style={`bg-main px-2 py-2 rounded text-white hover:bg-[#45624E] ${
              review.comment.trim() === ""
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            handleOnClick={handleSubmit}
            disabled={review.comment.trim() === ""}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(WriteReview);
