// src/components/CommentSection.jsx

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiComment, apiGetBlog, apiReplyComment } from "../apis";
import { useSelector } from "react-redux";
import {
  useNavigate,
  createSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
import path from "../ultils/path";
import avt from "../assets/avtDefault.avif";
import moment from "moment";

const CommentBlog = () => {
  const { current } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const [replyContent, setReplyContent] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const { bid } = useParams();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchBlog = async () => {
  //     if (!bid) {
  //       console.error("Blog ID is undefined");
  //       return;
  //     }

  //     try {
  //       const response = await apiGetBlog(bid);
  //       if (response.success) {
  //         setBlog(response.blog);
  //       } else {
  //         Swal.fire({
  //           title: "Error",
  //           text: "Failed to load blog details",
  //           icon: "error",
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching blog:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBlog();
  // }, [bid]);

  const handleAddComment = async () => {
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

    if (!comment) {
      return Swal.fire({
        title: "Warning",
        text: "Please enter a comment!",
        icon: "warning",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      });
    }

    try {
      const response = await apiComment({
        bid,
        content: comment,
        createdAt: new Date(),
      });

      if (response.commentBlog) {
        Swal.fire({
          title: "Success",
          text: "Comment added successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        }).then(() => {
          window.location.reload();
        });

        setComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to add comment. Please try again.",
        icon: "error",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
    }
  };

  const handleReplyComment = async (commentId) => {
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

    if (!replyContent) {
      return Swal.fire({
        title: "Warning",
        text: "Reply cannot be empty!",
        icon: "warning",
      });
    }

    try {
      const response = await apiReplyComment({
        bid,
        commentId,
        content: replyContent,
      });

      if (response.blog) {
        Swal.fire({
          title: "Success",
          text: "Reply added successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        }).then(() => {
          window.location.reload();
        });

        setReplyContent("");
      }
    } catch (error) {
      console.error("Error replying to comment:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to add reply. Please try again.",
        icon: "error",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-10 border rounded-2xl shadow-lg mb-8">
      <div className="mt-6">
        <h3 className="text-[24px] text-[rgb(61,87,68)] font-semibold my-2">
          Comment
        </h3>

        <textarea
          rows="3"
          className="border rounded p-2 w-full"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="bg-main text-white px-4 py-2 mt-2 rounded"
        >
          Submit Comment
        </button>
      </div>

      <div className="mt-4 mb-6">
        
        {blog?.comment.map((comment) => (
          <div key={comment._id} className="pb-2">
            <div className="flex justify-between items-center gap-4 bg-[#eef3f0] rounded-lg">
              <div className="flex gap-4 py-3 px-4">
                <img
                  src={`${comment?.postedBy.avatar || avt}`}
                  alt="avatar"
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />

                <div className="flex-1">
                  <div className="flex flex-col items-start">
                    <p className="font-medium text-gray-900">{`${comment.postedBy?.lastname} ${comment.postedBy?.firstname}`}</p>
                    <p className="text-sm text-gray-500">
                      {moment(comment.createdAt).format(
                        "MMM DD, YYYY [at] hh:mm A"
                      )}
                    </p>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                </div>
              </div>

              {!isReplying ? (
                <button
                  className="text-blue-500 hover:text-blue-700 transition-colors mr-4"
                  onClick={() => {
                    setReplyCommentId(comment._id);
                    setReplyContent("");
                    setIsReplying(true);
                  }}
                >
                  Reply
                </button>
              ) : (
                <button
                  className="text-red-600 hover:text-red-700 transition-colors mr-4"
                  onClick={() => {
                    setReplyCommentId(null);
                    setReplyContent("");
                    setIsReplying(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="ml-8 mt-3">
              {comment.reply?.map((reply) => (
                <div key={reply._id} className="border-l-2 border-main mb-3">
                  <div className="flex  border-b border-t justify-between items-center gap-2">
                    <div className="flex gap-4 py-3 px-4">
                      <img
                        src={`${comment?.postedBy.avatar || avt}`}
                        alt="avatar"
                        className="w-[40px] h-[40px] object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col items-start">
                          <p className="font-medium">
                            {`${reply.postedBy?.lastname} ${reply.postedBy?.firstname}`}
                            :
                          </p>
                          <p className="text-sm text-gray-500">
                            {moment(reply.createdAt).format(
                              "MMM DD, YYYY [at] hh:mm A"
                            )}
                          </p>
                        </div>
                        <p className="mt-1 text-gray-700">{reply.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {replyCommentId === comment._id && (
                <div>
                  <textarea
                    rows="2"
                    className="border rounded p-2 w-full"
                    placeholder="Add a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <button
                    onClick={() => handleReplyComment(comment._id)}
                    className="bg-main text-white px-4 py-2 mt-1 rounded"
                  >
                    Submit Reply
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentBlog;
