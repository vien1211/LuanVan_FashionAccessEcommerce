import React, { useCallback, useEffect, useState } from "react";
import { Button, InputForm, Loading, Pagination } from "../../components";
import { useDispatch } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {
  apiCreateBlogCategory,
  apiGetAllBlogCategory,
  apiDeleteBlogCategory,
  apiUpdateBlogCategory,
} from "../../apis";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import icons from "../../ultils/icons";
import { BsPatchPlus } from "react-icons/bs";
const {CiEdit, CiEraser, CiUndo } = icons;

const ManageBlogCategory = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
  } = useForm();

  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [blogCategories, setBlogCategories] = useState([]);
  const [params] = useSearchParams();
  const [editingCategory, setEditingCategory] = useState(null);
  const [update, setUpdate] = useState(false);
  const [counts, setCounts] = useState(0);

  const handleCreateBlogCategory = async (data) => {
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiCreateBlogCategory(data);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));

    if (response.success) {
      Swal.fire({
        title: "Created",
        text: "Add New Blog Category Successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      reset();
      render();
      //setBlogCategories([...blogCategories, data]); // Add new category to the list
      setShowForm(false); // Hide the form after creation
    } else {
      Swal.fire({
        title: "Oops!",
        text: response.mes || "Failed to Add New Blog Category!",
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
  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const fetchBlogCategory = async (params) => {
    const response = await apiGetAllBlogCategory({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setBlogCategories(response.blogCate);
      setCounts(response.counts);
    }
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    fetchBlogCategory(queries);
  }, [params, update]);

  const handleDeleteBlogCategory = async (bcid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiDeleteBlogCategory(bcid);
          if (response.success) {
            setBlogCategories(
              blogCategories.filter((category) => category._id !== bcid)
            ); // Update state
            Swal.fire("Deleted!", "Category has been deleted.", "success");
          } else {
            Swal.fire("Error!", "Failed to delete category.", "error");
          }
        } catch (error) {
          console.error("An error occurred:", error);
          Swal.fire(
            "Error!",
            "An error occurred while deleting the category.",
            "error"
          );
        }
      }
    });
  };

  const handleEditCategory = (id) => {
    const categoryToEdit = blogCategories.find(
      (blogcategory) => blogcategory._id === id
    );
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit);
      setValue("title", categoryToEdit?.title); // Set form values for editing
      setShowForm(true);
    }
  };

  const handleUpdateCategory = async (data) => {
    try {
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdateBlogCategory(data, editingCategory._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        setEditingCategory(null);
        render();
        Swal.fire({
          title: "Congratulations!",
          text: response.mes,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
            cancelButton: "custom-cancel-button",
          },
        });
        reset();
      } else {
        Swal.fire({
          title: "Oops!",
          text: response.mes || "Failed To Update Supplier!",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
            cancelButton: "custom-cancel-button",
          },
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire("Error", "Failed to update Supplier.", "error");
    }
  };

  return (
    <div className="w-full p-4 my-4">
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>Manage Blog Category</h1>
      </div>

      <div className="py-6 px-6">
        <span
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              reset();
              setEditingCategory(null);
            }
          }}
          className={`px-4 py-3 rounded-[12px] text-white cursor-pointer transition duration-300 ${
            showForm
              ? "bg-gray-900 hover:bg-gray-600"
              : "bg-[#7b2164] hover:bg-[#ac669a]"
          }`}
        >
          
          {showForm ? "Cancel" : <><BsPatchPlus size={24} className="inline-block mr-2" /> Create New Category</>}
        </span>

        {/* Form for adding/editing a category */}
        {showForm && (
          <form
            onSubmit={handleSubmit(
              editingCategory ? handleUpdateCategory : handleCreateBlogCategory
            )}
            className="mt-4"
          >
            <InputForm
              label="Name Category"
              register={register}
              errors={errors}
              id="title"
              validate={{
                required: "Require",
              }}
              fullWidth
              placeholder="Name of Blog Category"
              style="rounded-md"
            />
            <div className="mt-8">
              <Button
                type="submit"
                name={
                  editingCategory
                    ? "Update Blog Category"
                    : "Create Blog Category"
                }
              />
            </div>
          </form>
        )}

        {/* Display current blog categories with edit and delete buttons */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6">Current Blog Categories</h2>
          {blogCategories?.length > 0 ? (
            <ul>
              {blogCategories.map((blogcategory, index) => {
                // Tính toán chỉ số theo trang
                const itemIndex =
                  (+params.get("page") > 1
                    ? (+params.get("page") - 1) * process.env.REACT_APP_LIMIT
                    : 0) +
                  index +
                  1;

                return (
                  <li
                    key={blogcategory?._id}
                    className="flex border bg-white border-gray-300 rounded-[8px] px-4 py-3 justify-between items-center mt-2"
                  >
                    {/* Hiển thị số thứ tự */}
                    {itemIndex}. {blogcategory?.title} 
                    
                    <div className="flex gap-2">
                      <span
                        onClick={() => handleEditCategory(blogcategory._id)}
                        className="px-2 py-2 text-white cursor-pointer bg-main rounded-full hover:bg-[#79a076] transition duration-150"
                      >
                        <CiEdit size={20} />
                      </span>

                      <span
                        onClick={() =>
                          handleDeleteBlogCategory(blogcategory._id)
                        }
                        className="px-2 py-2 text-white cursor-pointer bg-red-600 rounded-full hover:bg-red-700 transition duration-150"
                      >
                        <CiEraser size={20} />
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No categories created yet.</p>
          )}
        </div>
      </div>

      <div className="flex w-full px-4">
          <Pagination totalCount={counts} />
        </div>
    </div>
  );
};

export default ManageBlogCategory;
