import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import { InputField, Pagination, InputForm, Button, Loading } from "../../components";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  apiDeleteCategory,
  apiGetCategories,
  apiUpdateCategory,
} from "../../apis/app";
import { showModal } from "../../store/app/appSlice";
import { useDispatch } from "react-redux";
import icons from "../../ultils/icons";
const {CiEdit, CiEraser, CiUndo } = icons;

const ManageCategory = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({});

  const [categories, setCategories] = useState(null);
  const [q, setQ] = useState("");
  const [params] = useSearchParams();
  const [editEl, setEditEl] = useState(null);
  const [update, setUpdate] = useState(false);
  const [counts, setCounts] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchAllCategory = async (params) => {
    try {
      const response = await apiGetCategories({
        ...params,
        limit: process.env.REACT_APP_LIMIT,
      });
      if (response.success) {
        setCategories(response.prodCate);
        setCounts(response.counts);
      } else {
        console.error(response.message);
        Swal.fire("Error", response.message, "error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire("Error", "Failed to fetch categories.", "error");
    }
  };

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const dispatch = useDispatch();

  const queriesDebounce = useDebounce(q, 800);

  useEffect(() => {
    const queries = Object.fromEntries([...params]);

    if (queriesDebounce) {
      queries.q = queriesDebounce;
    } else {
      delete queries.q;
    }

    fetchAllCategory(queries);
  }, [queriesDebounce, params, update]);

  const setValue = useCallback(
    (value) => {
      setQ(value);
    },
    [q]
  );

  const handleUpdate = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdateCategory(formData, editEl._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        setEditEl(null);
        setPreviewImage(null);
        render();
        Swal.fire("Success", "Category updated successfully!", "success");
        reset();
      } else {
        Swal.fire("Error", response.message || "Failed to update category.", "error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire("Error", "Failed to update the category.", "error");
    }
  };

  const handleDeleteCategory = async (pcid) => {
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
          const response = await apiDeleteCategory(pcid);
          if (response.success) {
            render();
            Swal.fire("Deleted!", "Category has been deleted.", "success");
          } else {
            Swal.fire("Error!", "Failed to delete category.", "error");
          }
        } catch (error) {
          console.error("An error occurred:", error);
          Swal.fire("Error!", "An error occurred while deleting the category.", "error");
        }
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full p-4 my-4">
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>Manage Category Product</h1>
      </div>

      <div className="py-2 w-full overflow-x-auto">
        <div className="flex justify-end py-2 px-2">
          <InputField
            nameKey={"Search..."}
            value={q}
            setValue={setValue}
            style={"w-[350px] shadow-md"}
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {editEl && (
            <Button
              type="submit"
              name="Update Category"
              style="bg-main flex items-center mb-4 ml-4 hover:bg-[#45624E] text-white font-semibold py-2 px-4 rounded-md"
            />
          )}
          <table className="table-auto w-full mb-6 text-left min-w-[1000px]">
            <thead className="font-bold bg-[#273526] text-white text-[13px]">
              <tr>
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Image</th>
                <th className="px-2 py-2">Title</th>
                <th className="px-2 py-2">Created At</th>
                <th className="px-2 py-2">Updated At</th>
                <th className="px-2 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {categories?.map((el, index) => (
                <tr
                  key={el._id}
                  className={`border-y-main text-[13px] ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-200"
                  }`}
                >
                  <td className="px-2 py-2">
                    {(+params.get("page") > 1 ? (+params.get("page") - 1) * process.env.REACT_APP_LIMIT : 0) + index + 1}
                  </td>

                  <td className="py-2 px-2">
                    {editEl?._id === el._id ? (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          {...register("image")}
                          onChange={handleImageChange}
                          className="mt-2"
                        />
                        {previewImage && (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-[60px] h-[60px] object-cover mt-2"
                          />
                        )}
                      </>
                    ) : (
                      <img
                        src={el.image}
                        alt={el.title}
                        className="w-[60px] h-[60px] object-cover rounded-md"
                      />
                    )}
                  </td>

                  <td className="py-2 px-2">
                    {editEl?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editEl.title}
                        id={"title"}
                        validate={{ required: "Title is required" }}
                        style="rounded-md"
                      />
                    ) : (
                      <span>{el.title}</span>
                    )}
                  </td>

                  <td className="py-2 px-2">
                    {moment(el.createdAt).format("DD/MM/YYYY")}
                  </td>

                  <td className="py-2 px-2">
                    {moment(el.updatedAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-5 px-2 flex gap-2">
                    {editEl?._id === el._id ? (
                      <span
                        onClick={() => setEditEl(null)}
                        className="px-2 py-2 text-white cursor-pointer bg-gray-800 rounded-full hover:bg-gray-500 transition duration-150"
                      >
                        <CiUndo size={20} />
                      </span>
                    ) : (
                      <span
                        onClick={() => setEditEl(el)}
                        className="px-2 py-2 text-white cursor-pointer bg-main rounded-full hover:bg-[#79a076] transition duration-150"
                      >
                        <CiEdit size={20} />
                      </span>
                    )}
                    <span
                      onClick={() => handleDeleteCategory(el._id)}
                      className="px-2 py-2 text-white cursor-pointer bg-red-600 rounded-full hover:bg-red-700 transition duration-150"
                    >
                      <CiEraser size={20} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className="flex w-full px-4">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageCategory;
