import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  InputField,
  InputForm,
  Loading,
  Pagination,
} from "../../components";
import { showModal } from "../../store/app/appSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { apiDeleteBlog, apiGetAllBlog, apiUpdateBlog } from "../../apis";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import moment from "moment";
import UpdateBlog from "./UpdateBlog";
import icons from "../../ultils/icons";
const { CiEdit, CiEraser, CiUndo } = icons;

const ManageBlogPost = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({});

  const [q, setQ] = useState("");
  const dispatch = useDispatch();
  const [editBlog, setEditBlog] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [counts, setCounts] = useState(0);
  const [update, setUpdate] = useState(false);
  const [blogs, setBlogs] = useState(null);
  const [params] = useSearchParams();
  const queryDebounce = useDebounce(q, 800);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchAllBlog = async (params) => {
    const response = await apiGetAllBlog({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts(response.counts);
      setBlogs(response.AllBlog);
    }
  };

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    if (queryDebounce) {
      searchParams.q = queryDebounce;
    } else {
      delete searchParams.q;
    }
    fetchAllBlog(searchParams);
  }, [params, queryDebounce, update]);

  const handleUpdate = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdateBlog(formData, editBlog._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        setEditBlog(null);
        setPreviewImage(null);
        render();
        Swal.fire("Success", "Category updated successfully!", "success");
        reset();
      } else {
        Swal.fire(
          "Error",
          response.message || "Failed to update category.",
          "error"
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire("Error", "Failed to update the category.", "error");
    }
  };

  const setValue = useCallback(
    (value) => {
      setQ(value);
    },
    [q]
  );

  const handleSearch = (value) => {
    setQ(value);
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...Object.fromEntries([...params]),
        q: value || "", // Thêm từ khóa tìm kiếm
      }).toString(),
    });
  };

  const handleDeleteBlog = async (bid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      customClass: {
        title: "custom-title",
        text: "custom-text",
        confirmButton: "custom-confirm-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiDeleteBlog(bid);
          if (response.success) {
            render();
            Swal.fire({
              title: "Deleted!",
              text: "Blog Post has been deleted.",
              icon: "success",
              customClass: {
                title: "custom-title",
                text: "custom-text",
                confirmButton: "custom-confirm-button",
              },
            });
            
          } else {
            Swal.fire("Error!", "Failed to delete Post.", "error");
          }
        } catch (error) {
          console.error("An error occurred:", error);
          Swal.fire(
            "Error!",
            "An error occurred while deleting Brand.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="w-full p-4 my-4 relative">
      {editBlog && (
        <div className="absolute inset-0 z-50 min-h-screen bg-[#F5F5FA] ">
          <UpdateBlog
            editBlog={editBlog}
            render={render}
            setEditBlog={setEditBlog}
          />
        </div>
      )}
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>Manage Blog Post</h1>
      </div>

      <div className="py-2 w-full overflow-x-auto">
        <div className="flex justify-end py-2 px-2">
          <InputField
            nameKey={"Search..."}
            value={q}
            // setValue={setValue}
            setValue={handleSearch}
            style={"w-[350px] shadow-md"}
          />
        </div>

        <table className="table-auto w-full mb-6 text-left min-w-[1000px]">
          <thead className="font-bold bg-[#273526] text-white text-[13px]">
            <tr>
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">Thumbnail</th>
              <th className="px-2 py-2">Title</th>
              <th className="px-2 py-2">Category</th>

              <th className="px-2 py-2">Created At</th>
              <th className="px-2 py-2">Author</th>
              <th className="px-2 py-2">View</th>
              <th className="px-2 py-2">Like</th>
              <th className="px-2 py-2">Dislike</th>
              <th className="px-2 py-2">Comment</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {blogs?.map((el, index) => (
              <tr
                key={el._id}
                className={`border-y-main text-[13px] ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-200"
                }`}
              >
                <td className="px-2 py-2">
                  {(+params.get("page") > 1
                    ? (+params.get("page") - 1) * process.env.REACT_APP_LIMIT
                    : 0) +
                    index +
                    1}
                </td>

                <td className="py-2 px-2">
                  <img
                    src={el.image}
                    alt={el?.title}
                    className="w-[70px] h-[60px] object-cover rounded-md"
                  />
                </td>

                <td className="py-2 px-2">{el?.title}</td>

                <td className="py-2 px-2">{el.category?.title}</td>

                <td className="py-2 px-2">
                  {moment(el.createdAt).format("DD/MM/YYYY hh:mm A")}
                </td>

                <td className="py-2 px-2">
                  {`${el.author?.firstname} ${el.author?.lastname}`}
                  
                </td>

                <td className="py-2 px-2">{el.numberView}</td>

                <td className="py-2 px-2">{el.likesCount}</td>

                <td className="py-2 px-2">{el.dislikesCount}</td>

                <td className="py-2 px-2">{el?.comment.length || 0}</td>
                <td className="py-4 px-2 flex gap-2">
                  {editBlog?._id === el._id ? (
                    <span
                      onClick={() => setEditBlog(null)}
                      className="px-4 py-2 text-white cursor-pointer bg-gray-800 rounded-[5px] hover:bg-gray-500 transition duration-150"
                    >
                      Cancel
                    </span>
                  ) : (
                    <span
                      onClick={() => setEditBlog(el)}
                      className="px-2 py-2 text-white cursor-pointer bg-main rounded-full hover:bg-[#79a076] transition duration-150"
                    >
                      <CiEdit size={20} />
                    </span>
                  )}
                  <span
                    onClick={() => handleDeleteBlog(el._id)}
                    className="px-2 py-2 text-white cursor-pointer bg-red-600 rounded-full hover:bg-red-700 transition duration-150"
                  >
                    <CiEraser size={20} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex w-full px-4">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageBlogPost;
