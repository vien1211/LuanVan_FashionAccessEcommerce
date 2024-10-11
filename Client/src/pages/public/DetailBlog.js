import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  createSearchParams,
  Link,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  apiGetBlog,
  apiUpdateLike,
  apiUpdateDislike,
  apiComment,
  apiReplyComment
} from "../../apis";
import { getCurrentUser } from "../../store/user/asyncActions";
import DOMPurify from "dompurify";
import path from "../../ultils/path";
import moment from "moment";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa6";
import avt from "../../assets/avtDefault.avif";
import { RelatedBlog } from "../../components";

const BlogDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bid } = useParams();
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.user);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      if (!bid) {
        console.error("Blog ID is undefined");
        return;
      }

      try {
        
        const response = await apiGetBlog(bid);
        if (response.success) {
          setBlog(response.blog);
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to load blog details",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0);
  }, [bid, comment, replyContent]);

  // const handleSelectOption = async (e, flag) => {
  //   e.stopPropagation();

  //   if (!current)
  //     return Swal.fire({
  //       title: "Almost...",
  //       text: "Please Log In To Do This Action",
  //       icon: "info",
  //       confirmButtonText: "Go Log In",
  //       showCancelButton: true,
  //       cancelButtonText: "Not now!",
  //       customClass: {
  //         title: "custom-title",
  //         text: "custom-text",
  //         confirmButton: "custom-confirm-button",
  //         cancelButton: "custom-cancel-button",
  //       },
  //     }).then((rs) => {
  //       if (rs.isConfirmed)
  //         navigate({
  //           pathname: `/${path.LOGIN}`,
  //           search: createSearchParams({
  //             redirect: location.pathname,
  //           }).toString(),
  //         });
  //     });

  //   try {
  //     let response;
  //     let actionText;

  //     // Cập nhật trạng thái "like" hoặc "dislike"
  //     if (flag === "LIKE") {
  //       response = await apiUpdateLike(bid);
  //       actionText = response.success
  //         ? isLiked
  //           ? "Unliked!"
  //           : "Liked!"
  //         : null;
  //     } else if (flag === "DISLIKE") {
  //       response = await apiUpdateDislike(bid);
  //       actionText = response.success
  //         ? isDisliked
  //           ? "Undisliked!"
  //           : "Disliked!"
  //         : null;
  //     }

  //     if (response.success) {
  //       dispatch(getCurrentUser());
  //       Swal.fire({
  //         title: actionText,
  //         text: response.success
  //           ? `You've ${actionText.toLowerCase()} the blog!`
  //           : "",
  //         icon: "success",
  //         customClass: {
  //           title: "custom-title",
  //           text: "custom-text",
  //           confirmButton: "custom-confirm-button",
  //           cancelButton: "custom-cancel-button",
  //         },
  //       }).then(() => {
  //         window.location.reload();
  //       });
  //     } else {
  //       Swal.fire({
  //         title: "Oops!",
  //         text: `Failed to ${flag === "LIKE" ? "like" : "dislike"} the blog!`,
  //         icon: "error",
  //         customClass: {
  //           title: "custom-title",
  //           text: "custom-text",
  //           confirmButton: "custom-confirm-button",
  //           cancelButton: "custom-cancel-button",
  //         },
  //       })
  //     }
  //   } catch (error) {
  //     console.error(`Error updating ${flag.toLowerCase()} status:`, error);
  //   }
  // };

  const handleSelectOption = async (e, flag) => {
    e.stopPropagation();
  
    if (current?.isBlocked) {
      return Swal.fire({
        icon: 'error',
        title: 'Account Blocked!',
        text: 'Your account is blocked, and you cannot comment at this time.',
        confirmButtonText: 'OK',
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      });
    }
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
        if (rs.isConfirmed)
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location.pathname,
            }).toString(),
          });
      });
    }
  
    try {
      let response;
      let actionText;
      // Cập nhật trạng thái "like" hoặc "dislike"
      if (flag === "LIKE") {
        response = await apiUpdateLike(bid);
        if (response.success) {
          // Cập nhật số like trong state
          setBlog((prevBlog) => ({
            ...prevBlog,
            likesCount: isLiked
              ? prevBlog.likesCount - 1
              : prevBlog.likesCount + 1,
          }));
        }
      } else if (flag === "DISLIKE") {
        response = await apiUpdateDislike(bid);
        if (response.success) {
          // Cập nhật số dislike trong state
          setBlog((prevBlog) => ({
            ...prevBlog,
            dislikesCount: isDisliked
              ? prevBlog.dislikesCount - 1
              : prevBlog.dislikesCount + 1,
          }));
        }
      }
      // Cập nhật lại trạng thái like/dislike của user hiện tại
      dispatch(getCurrentUser());
    } catch (error) {
      console.error(`Error updating ${flag.toLowerCase()} status:`, error);
    }
  };
  

  const handleAddComment = async () => {
    if (current?.isBlocked) {
      return Swal.fire({
        icon: 'error',
        title: 'Account Blocked!',
        text: 'Your account is blocked, and you cannot comment at this time.',
        confirmButtonText: 'OK',
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      });
    }

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
        })

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
    if (current?.isBlocked) {
      return Swal.fire({
        icon: 'error',
        title: 'Account Blocked!',
        text: 'Your account is blocked, and you cannot reply comment this time.',
        confirmButtonText: 'OK',
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      });
    }
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
        })

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


  

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!blog) {
    return <div className="text-center py-4">Blog not found!</div>;
  }

  const isLiked = current?.likes?.some((i) => i._id === bid);
  const isDisliked = current?.dislikes?.some((i) => i._id === bid);

  return (
    <div>
      <div className="max-w-4xl mx-auto border p-6 bg-white rounded-lg shadow-md mb-8">
        <img
          src={blog?.image || "https://via.placeholder.com/600"}
          alt={blog?.title || "Blog Image"}
          className="w-full h-[400px] object-cover rounded-lg"
        />
        <div className="relative flex justify-between items-center mt-4">
          <h2 className="text-2xl font-bold text-gray-800">{blog?.title}</h2>
        </div>
        <div className="mt-2 text-gray-600 flex justify-between items-center">
          <div className="flex items-center">
            {/* <span className="rounded-full bg-main px-3 py-1 text-white">{`${blog?.category?.title}`}</span> */}
            <span className="rounded-full bg-main px-3 py-1 text-white">
              <Link
                to={`/blogs?category=${blog?.category?.title}`} // Navigate to blogs with the selected category
                
              >
                {blog?.category?.title}
              </Link>
            </span>
            <span className="mx-2 text-main bg-[#F5F5FA] px-3 py-1 rounded-full shadow-sm">{`${blog.numberView} Views`}</span>
          </div>

          <div className="flex items-center">
            {/* <span className="rounded-l-full bg-[#ba3c4d] text-[#ebd6d9] px-4 py-1">{`${blog?.likesCount || 0} Likes`} </span> */}
            <div className="flex items-center">
              <span className="rounded-lg border border-[#ba3c4d] text-[#d0374e] px-4 py-1 flex items-center">
                <span className={`text-${isLiked ? "d0374e" : "red-200"}`}>{`${
                  blog?.likesCount || 0
                } Likes`}</span>
                <button
                  title={isLiked ? "Unlike" : "Like"}
                  onClick={(e) => handleSelectOption(e, "LIKE")}
                  className={`cursor-pointer w-[40px] h-[40px] flex items-center justify-center rounded-full transition-colors duration-300 border ml-2
                  ${
                    isLiked
                      ? "bg-[#f1cbce] text-[#ba3c4d] border-[#ba3c4d]"
                      : "bg-white text-[#b4b2b3] border-[#b4b2b3]"
                  }
                  hover:bg-white hover:text-[#f69298] hover:border-[#f69298]`} // Change colors on hover
                >
                  <FaThumbsUp size={20} />
                </button>
              </span>

              <span className="rounded-lg border border-[#551cb0] text-[#d1c3e8] px-4 py-1 flex items-center ml-4">
                {" "}
                {`${blog?.dislikesCount || 0} Dislikes`}
                <button
                  title={isDisliked ? "Undislike" : "Dislike"}
                  onClick={(e) => handleSelectOption(e, "DISLIKE")}
                  className={`cursor-pointer w-[40px] h-[40px] flex items-center justify-center rounded-full transition-colors duration-300 border ml-2
                ${
                  isDisliked
                    ? "bg-[#c4a8ef] text-[#551cb0] border-[#551cb0]"
                    : "bg-white text-[#b4b2b3] border-[#b4b2b3]"
                }
                hover:bg-white hover:text-[#f69298] hover:border-[#f69298]`} // Change colors on hover
                >
                  <FaThumbsDown size={20} />
                </button>
              </span>
            </div>
          </div>
        </div>
        <div
          className="mt-4 text-gray-700"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blog?.description),
          }}
        />
        <div className="flex flex-col items-end py-4">
          <span className="text-md text-gray-600 bg-[#e2f1e4] py-1 px-3 rounded-full">
            {" "}
            {moment(blog.createdAt).format("[Th]MM DD, YYYY hh:mm A")}
          </span>

          <span className="flex gap-4 py-3 px-4 bg-[#e8f1ec] my-4 rounded-lg">
            <span>
              <img
                src={`${blog?.author?.avatar || avt} `}
                alt="avatar"
                className="w-[70px] h-[70px] object-cover rounded-full"
              />
            </span>
            <span className="flex flex-col justify-center">
              <span className="text-[#835306] text-[18px] font-semibold uppercase font-playfair">
                Author
              </span>
              <span className="text-[24px] text-[#44614C]">{`${blog?.author?.firstname} ${blog?.author?.lastname}`}</span>
            </span>
          </span>
        </div>
      </div>

      <RelatedBlog currentAuthor={`${blog?.author.firstname}`} />

      <div className="max-w-6xl mx-auto px-10 border rounded-lg shadow-lg mb-8">
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
          <div key={comment?._id} className="pb-2">
            <div className="flex justify-between items-center gap-4 bg-[#eef3f0] rounded-lg">
              <div className="flex gap-4 py-3 px-4">
                <img
                  src={`${comment?.postedBy?.avatar || avt}`}
                  alt="avatar"
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />

                <div className="flex-1">
                  <div className="flex flex-col items-start">
                    <p className="font-medium text-gray-900">{`${comment?.postedBy?.lastname} ${comment?.postedBy?.firstname}`}</p>
                    <p className="text-sm text-gray-500">
                      {moment(comment?.createdAt).format(
                        "MMM DD, YYYY [at] hh:mm A"
                      )}
                    </p>
                  </div>
                  <p className="mt-1 text-gray-700">{comment?.content}</p>
                </div>
              </div>

              {!isReplying ? (
                <button
                  className="text-blue-500 hover:text-blue-700 transition-colors mr-4"
                  onClick={() => {
                    setReplyCommentId(comment?._id);
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
              {comment?.reply?.map((reply) => (
                <div key={reply?._id} className="border-l-2 border-main mb-3">
                  <div className="flex  border-b border-t justify-between items-center gap-2">
                    <div className="flex gap-4 py-3 px-4">
                      <img
                        src={`${reply?.postedBy.avatar || avt}`}
                        alt="avatar"
                        className="w-[40px] h-[40px] object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col items-start">
                          <p className="font-medium">
                            {`${reply?.postedBy?.lastname} ${reply?.postedBy?.firstname}`}
                            :
                          </p>
                          <p className="text-sm text-gray-500">
                            {moment(reply?.createdAt).format(
                              "MMM DD, YYYY [at] hh:mm A"
                            )}
                          </p>
                        </div>
                        <p className="mt-1 text-gray-700">{reply?.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {replyCommentId === comment?._id && (
                <div>
                  <textarea
                    rows="2"
                    className="border rounded p-2 w-full"
                    placeholder="Add a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <button
                    onClick={() => handleReplyComment(comment?._id)}
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
    </div>
  );
};

export default BlogDetail;
