import React, { useEffect, useState, useCallback } from "react";
import { apiGetAllUser, apiUpdateUser, apiDeleteUser } from "../../apis/user";
import { roles, blockStatus } from '../../ultils/contants'
import moment from "moment";
import {
  InputField,
  Pagination,
  InputForm,
  Select,
  Button,
} from "../../components";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";


const ManageUser = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    email: "",
    firstname: "",
    lastname: "",
    role: "",
    phone: "",
    isBlocked: "",
  });
  const [users, setUsers] = useState(null);
  const [q, setQ] = useState("");
  const [params] = useSearchParams();
  const [editEl, setEditEl] = useState(null);
  const [update, setUpdate] = useState(false);

  const fetchAllUser = async (params) => {
    try {
      const response = await apiGetAllUser({
        ...params,
        limit: process.env.REACT_APP_LIMIT,
      });
      if (response.success) {
        setUsers(response);
      } else {
        console.error(response.mes); // Log the error message
        alert(response.mes); // Display the error to the user
        // Optionally, redirect the user to a different page or display a message on the UI
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const queriesDebounce = useDebounce(q, 800);

  useEffect(() => {
    const queries = Object.fromEntries([...params]);

    if (queriesDebounce) {
      queries.q = queriesDebounce;
    } else {
      delete queries.q;
    }

    fetchAllUser(queries);
  }, [queriesDebounce, params, update]);

  const setValue = useCallback(
    (value) => {
      setQ(value);
    },
    [q]
  );

  const handleUpdate = async (data) => {
    const response = await apiUpdateUser(data, editEl._id);
    if (response.success) {
      setEditEl(null);
      render();
      Swal.fire({
        title: "Congratulations!",
        text: response.mes || "Update successful!",
        icon: "success",
        confirmButtonText: "OK",
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
        text: response.mes || "Invalid credentials!",
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
  };

  const handleDeleteUser = async (uid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Remove this User?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      customClass: {
        title: "custom-title",
        text: "custom-text",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiDeleteUser(uid);
          if (response.success) {
            render();
            Swal.fire({
              title: "Deleted!",
              text: response.mes || "User has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
              customClass: {
                title: "custom-title",
                text: "custom-text",
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
              },
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: response.mes || "Failed to delete user.",
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
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the user.",
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
      }
    });
  };

  return (
    <div className="w-full p-4 my-4">
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>Manage User</h1>
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
              name="Update User"
              style="bg-main flex items-center mb-4 ml-4 hover:bg-[#45624E] text-white font-semibold py-2 px-4 rounded-md"
            ></Button>
          )}
          <table className="table-auto w-full mb-6 text-left min-w-[1000px]">
            <thead className="font-bold bg-[#273526] text-white text-[13px]">
              <tr>
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Email Address</th>
                <th className="px-2 py-2">Firstname</th>
                <th className="px-2 py-2">Lastname</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Phone</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Created At</th>
                <th className="px-2 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {users?.users?.map((el, index) => (
                <tr
                  key={el._id}
                  className={` border-y-main text-[13px] ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-200"
                  }`}
                >
                  <td className="px-2 py-2">{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + index + 1}</td>

                  <td className="py-2 px-2">
                    {editEl?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editEl?.email}
                        id={"email"}
                        validate={{
                          required: "Require",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        }}
                        style='rounded-md'
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editEl?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editEl?.firstname}
                        id={"firstname"}
                        validate={{ required: "Require" }}
                         style='rounded-md'
                      />
                    ) : (
                      <span>{el.firstname}</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editEl?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editEl?.lastname}
                        id={"lastname"}
                        validate={{ required: "Require" }}
                         style='rounded-md'
                      />
                    ) : (
                      <span>{el.lastname}</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editEl?._id === el._id ? (
                      <Select
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={el.role}
                        id={"role"}
                        validate={{ required: "Require" }}
                        option={roles}
                         style='rounded-md'
                      />
                    ) : (
                      <span>{roles.find(role => +role.code === +el.role)?.value}</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editEl?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editEl?.mobile}
                        id={"mobile"}
                        validate={{
                          required: "Require",
                          pattern: {
                            value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
                            message: "invalid phone number",
                          },
                        }}
                         style='rounded-md'
                      />
                    ) : (
                      <span>{el.mobile}</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {editEl?._id === el._id ? (
                      <Select
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={el.isBlocked}
                        id={"isBlocked"}
                        validate={{ required: "Require" }}
                        option={blockStatus}
                         style='rounded-md'
                      />
                    ) : (
                      <span>{el.isBlocked ? "Blocked" : "Active"}</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {moment(el.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    {editEl?._id === el._id ? (
                      <span
                        onClick={() => setEditEl(null)}
                        className="px-4 py-2 text-white cursor-pointer bg-gray-800 rounded-[5px] hover:bg-gray-500 transition duration-150"
                      >
                        Back
                      </span>
                    ) : (
                      <span
                        onClick={() => setEditEl(el)}
                        className="px-4 py-2 text-white cursor-pointer bg-main rounded-[5px] hover:bg-[#79a076] transition duration-150"
                      >
                        Edit
                      </span>
                    )}
                    <span
                      onClick={() => handleDeleteUser(el._id)}
                      className="px-4 py-2 text-white cursor-pointer bg-red-600 rounded-[5px] hover:bg-red-700 transition duration-150"
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className="flex w-full px-4">
          <Pagination totalCount={users?.counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
