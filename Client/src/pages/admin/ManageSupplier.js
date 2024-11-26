import React, { useCallback, useEffect, useState } from "react";
import { Button, InputField, InputForm, Loading, Pagination } from "../../components";
import {
  apiDeleteSupplier,
  apiGetSuppliers,
  apiUpdateSupplier,
} from "../../apis";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import moment from "moment";
import icons from "../../ultils/icons";
const {CiEdit, CiEraser, CiUndo } = icons;

const ManageSupplier = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({});

  const [supplier, setSupplier] = useState(null);
  const [q, setQ] = useState("");
  const [params] = useSearchParams();
  const [editEl, setEditEl] = useState(null);
  const [update, setUpdate] = useState(false);
  const [counts, setCounts] = useState(0);
  const dispatch = useDispatch();
  const queriesDebounce = useDebounce(q, 800);

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const fetchSuppliers = async (params) => {
    try {
      const response = await apiGetSuppliers({
        ...params,
        limit: process.env.REACT_APP_LIMIT,
      });
      if (response.success) {
        setSupplier(response.suppliers);
        setCounts(response.counts);
      } else {
        console.error(response.message);
        Swal.fire("Error", response.message, "error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire("Error", "Failed to fetch Supplier.", "error");
    }
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);

    if (queriesDebounce) {
      queries.q = queriesDebounce;
    } else {
      delete queries.q;
    }

    fetchSuppliers(queries);
  }, [queriesDebounce, params, update]);

  const handleUpdate = async (data) => {
    try {
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdateSupplier(data, editEl._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        setEditEl(null);
        render();
        Swal.fire({
            title: "Congratulations!",
            text: response.mes || "Update Supplier Successful!",
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

  const handleDeleteCategory = async (sid) => {
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
          const response = await apiDeleteSupplier(sid);
          if (response.success) {
            render();
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

  const setValue = useCallback(
    (value) => {
      setQ(value);
    },
    [q]
  );

  return (
    <div className="w-full p-4 my-4">
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>Manage Supplier</h1>
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
                name="Update Supplier"
                style="bg-main flex items-center mb-4 ml-4 hover:bg-[#45624E] text-white font-semibold py-2 px-4 rounded-md"
              />
            )}
            <table className="table-auto w-full mb-6 text-left min-w-[1000px]">
              <thead className="font-bold bg-[#273526] text-white text-[13px]">
                <tr>
                  <th className="px-2 py-2">#</th>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Contact</th>
                  <th className="px-2 py-2">Address</th>
                  <th className="px-2 py-2">Created At</th>
                  <th className="px-2 py-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {supplier?.map((el, index) => (
                  <tr
                    key={el._id}
                    className={`border-y-main text-[13px] ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-200"
                    }`}
                  >
                    <td className="px-2 py-2">
                      {(+params.get("page") > 1
                        ? (+params.get("page") - 1) *
                          process.env.REACT_APP_LIMIT
                        : 0) +
                        index +
                        1}
                    </td>

                    <td className="py-2 px-2">
                      {editEl?._id === el._id ? (
                        <InputForm
                          register={register}
                          fullWidth
                          errors={errors}
                          defaultValue={editEl.name}
                          id={"name"}
                          validate={{ required: "Name is required" }}
                          style="rounded-md"
                        />
                      ) : (
                        <span>{el.name}</span>
                      )}
                    </td>

                    <td className="py-2 px-2">
                      {editEl?._id === el._id ? (
                        <InputForm
                          register={register}
                          fullWidth
                          errors={errors}
                          defaultValue={editEl.contact}
                          id={"contact"}
                          validate={{ required: "Contact is required" }}
                          style="rounded-md"
                        />
                      ) : (
                        <span>{el.contact}</span>
                      )}
                    </td>

                    <td className="py-2 px-2">
                      {editEl?._id === el._id ? (
                        <InputForm
                          register={register}
                          fullWidth
                          errors={errors}
                          defaultValue={editEl.address}
                          id={"address"}
                          validate={{ required: "Address is required" }}
                          style="rounded-md"
                        />
                      ) : (
                        <span>{el.address}</span>
                      )}
                    </td>

                    <td className="py-2 px-2">
                      {moment(el.createdAt).format("DD/MM/YYYY")}
                    </td>

                    <td className="py-2 px-2 flex gap-2">
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

export default ManageSupplier;
