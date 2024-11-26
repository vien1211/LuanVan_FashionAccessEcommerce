import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputForm, Button, Loading } from "../../components";
import { apiUpdateVariant } from "../../apis"; // Adjust the import path as needed
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import { IoReturnDownBackOutline } from "react-icons/io5";

const UpdateVariant = ({ editingVariant, setEditingVariant, render }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [previewImages, setPreviewImages] = useState([]);
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    // Reset the form with the existing variant data
    if (editingVariant) {
      reset({
        title: editingVariant.title || "",
        price: editingVariant.price || "",
        color: editingVariant.color || "",
      });
      setPreviewImages(editingVariant.images || []);
    }
  }, [editingVariant, reset]);

  const handlePreviewImages = (files) => {
    const images = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewImages(images);
    setImageChanged(true);
  };

  const handleUpdateVariant = async (data) => {
    if (!editingVariant) {
      Swal.fire({
        title: "Error",
        text: "No variant selected for updating!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();

    // Append fields to formData only if they are provided
    if (data.title) formData.append("title", data.title);
    if (data.price) formData.append("price", data.price);
    if (data.color) formData.append("color", data.color);

    // Append new images to the FormData object if they are changed
    if (imageChanged) {
      const images = document.getElementById("image-input").files;
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    // Dispatch loading modal
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));

    try {
      // Ensure you have the correct variantId
      const variantId = editingVariant?._id; // Use the ID of the variant being edited
      const response = await apiUpdateVariant(formData, variantId); // Call the API with the variantId
      dispatch(showModal({ isShowModal: false, modalChildren: null }));

      // Debugging: Log the response
      console.log("Update Variant Response:", response);

      // Check if the response data structure is as expected
      if (response.success) {
        Swal.fire({
          title: "Updated",
          text: "Update Product Successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
        render();
        setEditingVariant(null);
      } else {
        Swal.fire({
          title: "Oops!",
          text: "Failed to Update Product!",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      }
    } catch (error) {
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update variant!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="p-4 w-full relative">
      <div className="flex px-6 bg-[#F5F5FA] gap-4 items-center text-3xl font-bold">
        <IoReturnDownBackOutline
          className="cursor-pointer hover:text-[#273526]"
          onClick={() => setEditingVariant(null)}
        />
        <h1>Update Variant</h1>
      </div>
      <div className="py-4">
        <form onSubmit={handleSubmit(handleUpdateVariant)}>
          <InputForm
            label="Variant Title"
            register={register}
            errors={errors}
            id="title"
            validate={{ required: "Title is required" }}
            placeholder="Enter variant title"
            fullWidth={true}
          />

          <div className="w-full my-8 flex gap-4">
            <InputForm
              label="Variant Price"
              register={register}
              errors={errors}
              id="price"
              // validate={{ required: "Price is required" }}
              placeholder="Enter variant price"
              type="number"
              style="flex-auto rounded-md"
              fullWidth={true}
            />
            <InputForm
              label="Variant Color"
              register={register}
              errors={errors}
              id="color"
              validate={{ required: "Color is required" }}
              placeholder="Enter variant color"
              style="flex-auto rounded-md"
              fullWidth={true}
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2">Upload Images</label>
            <input
              type="file"
              id="image-input"
              accept="image/*"
              multiple
              onChange={(e) => handlePreviewImages(e.target.files)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {previewImages.map((img, index) => (
              <div key={index} className="relative w-[180px] h-[180px]">
                <img
                  src={img}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <Button type="submit" name="Update Variant" className="mt-4" />
        </form>
      </div>
    </div>
  );
};

export default UpdateVariant;
