import React, { useState } from "react";
import { InputForm, Button, Loading } from "../../components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {apiCreateBrand } from "../../apis";
import { showModal } from "../../store/app/appSlice";

const CreateBrand = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(null);

  const handleCreateBrand = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
  
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    } else {
      Swal.fire({
        title: "Error",
        text: "Please select an image.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      return;
    }
  
    
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiCreateBrand(formData);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
  
    if (response.success) {
      Swal.fire({
        title: "Created",
        text: "Create Brand Successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      reset();
      setImagePreview(null);
    } else {
      Swal.fire({
        title: "Oops!",
        text: response.mes || "Failed to Create Brand!",
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
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="flex justify-between items-center text-3xl font-bold px-8">
        <span>Create New Brand</span>
      </h1>
      <div className="py-4">
        <form onSubmit={handleSubmit(handleCreateBrand)}>
          <InputForm
            label="Name Brand"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Require",
            }}
            fullWidth
            placeholder="Name of Brand"
            style="rounded-md"
          />

          <div className="w-full my-6">
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", {
                required: "Require",
              })}
              onChange={handleImageChange}
              className="mt-2"
            />
            {errors.image && (
              <p className="text-red-600 text-sm">{errors.image.message}</p>
            )}
          </div>

          {imagePreview && (
            <div className="my-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs max-h-52 object-contain"
              />
            </div>
          )}

          <div className="mt-8">
            <Button type="submit" name="Create New Brand" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBrand;
