import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, InputForm, Loading } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/avtDefault.avif";
import { apiUpdateCurrent } from "../../apis";
import { getCurrentUser } from "../../store/user/asyncActions";
import Swal from "sweetalert2";
import { showModal } from "../../store/app/appSlice";
import { getBase64 } from "../../ultils/helper";
import icons from "../../ultils/icons";

const { CiEdit } = icons; 

const Personal = () => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useForm();
  const { current } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [preview, setPreview] = useState({
    avatar: current?.avatar || avatar,
  });
  
  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      mobile: current?.mobile,
      email: current?.email,
      avatar: current?.avatar,
    });
  }, [current]);

  const handleUpdate = async (data) => {
    const formData = new FormData();

    // Append avatar if it exists
    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }
    delete data.avatar;

    // Append other form data
    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }

    // Debugging: Log each entry in formData
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading/>}));
      const response = await apiUpdateCurrent(formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null}));
      if (response.success) {
        dispatch(getCurrentUser()); // Ensure this is a function call
        Swal.fire({
          title: "Updated",
          text: "Update User Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Oops!",
          text: "Failed to Update User!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        title: "Oops!",
        text: "Failed to Update User!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePreview = async (files) => {
    const imgPreview = [];
    for (let file of files) {
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpg" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/avif" &&
        file.type !== "image/webp"
      ) {
        Swal.fire({
          title: "File not supported!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }
      const base64Image = await getBase64(file);
      imgPreview.push(base64Image);
    }

    // Set the preview image
    setPreview((prev) => ({ ...prev, avatar: imgPreview[0] }));
  };

  const [hoverAvatar, setHoverAvatar] = useState(false); // Change data type from null to boolean

  return (
    <div className="w-full relative p-4">
      <header className="text-3xl font-bold py-4">Personal Information</header>

      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="w-3/5 mx-auto flex flex-col gap-3"
      >
        <div
          className="flex flex-col items-center gap-2"
          onMouseEnter={() => setHoverAvatar(true)}
          onMouseLeave={() => setHoverAvatar(false)}
        >
          <label htmlFor="file" className="relative">
            <img
              src={preview.avatar} // Use preview avatar for display
              alt="avatar"
              className={`w-[180px] h-[180px] border-2 border-main object-cover rounded-full ${hoverAvatar}`}
            />
            {hoverAvatar && (
              <div className="absolute inset-0 flex cursor-pointer justify-center items-center bg-[#1c1c1c42] rounded-full">
                <span className="text-white bg-main rounded-full p-2">
                  <CiEdit size={24} />
                </span>
              </div>
            )}
          </label>
          <input
            type="file"
            id="file"
            {...register("avatar", {
              onChange: (e) => handlePreview(e.target.files), 
            })}
            hidden
          />
          
        </div>
        <InputForm
          label="Firstname"
          register={register}
          errors={errors}
          id="firstname"
          validate={{
            required: "Require",
          }}
          fullWidth
          style="rounded-md"
        />
        <InputForm
          label="Lastname"
          register={register}
          errors={errors}
          id="lastname"
          validate={{
            required: "Require",
          }}
          fullWidth
          style="rounded-md"
        />
        <InputForm
          label="Email"
          register={register}
          errors={errors}
          id="email"
          validate={{
            required: "Require",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "invalid email address",
            },
          }}
          fullWidth
          style="rounded-md"
        />
        <InputForm
          label="Number Phone"
          register={register}
          errors={errors}
          id="mobile"
          validate={{
            required: "Require",
            pattern: {
              value:
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
              message: "invalid phone number",
            },
          }}
          fullWidth
          style="rounded-md"
        />
        <div className="flex items-center gap-2">
          <span className="font-medium">Account Status: </span>
          <span>{current?.isBlocked ? "Blocked" : "Active"}</span>
        </div>

        {isDirty && (
          <div className="flex justify-end">
            <Button type="submit" name="Update Information" />
          </div>
        )}
      </form>
    </div>
  );
};

export default Personal;