import React, { memo, useEffect, useState } from "react";
import icons from "../ultils/icons";
import { useForm } from "react-hook-form";
import InputForm from "./InputForm";
import Button from "./Button";
import Swal from "sweetalert2";
import { getBase64 } from "../ultils/helper";
import { apiAddVariant } from "../apis";
import { useDispatch } from "react-redux";
import { showModal } from "../store/app/appSlice";
import Loading from "./Loading";

const { IoReturnDownBackOutline, FaTrashCan } = icons;

const CustomVariant = ({ customVariant, setCustomVariant }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const [preview, setPreview] = useState({
    images: [],
  });

  const dispatch = useDispatch();

  const [hoverImg, setHoverImg] = useState(null);

  useEffect(() => {
    reset({
      title: customVariant?.title,
      color: customVariant?.color,
      price: customVariant?.price,
      quantity: 0,
      sold: 0,
    });
  }, [customVariant]);

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

    setPreview((prev) => ({ ...prev, images: imgPreview }));
  };

  useEffect(() => {
    const images = watch("images");
    if (images && images.length > 0) {
      handlePreview(images);
    }
  }, [watch("images")]);

  const handleDeleteImage = (index) => {
    setPreview((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages };
    });
  };

  // const handleAddVariant = async (data) => {
  //   if (data.color === customVariant.color)
  //     Swal.fire({
  //       title: "Oops!",
  //       text: "Color not change!",
  //       icon: "info",
  //       confirmButtonText: "OK",
  //     });
  //   else {
  //     const formData = new FormData();
  //     for (let i of Object.entries(data)) formData.append(i[0], i[1]);
  //     data.sold =0;
  //     //   if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
  //     if (data.images) {
  //       const images = data?.image?.length === 0 ? preview.images : data.images;
  //       for (let image of images) formData.append("images", image);
  //     }

  //     dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
  //     const response = await apiAddVariant(formData, customVariant._id);
  //     dispatch(showModal({ isShowModal: false, modalChildren: null }));
  //     console.log(response);
  //     if (response.success) {
  //       Swal.fire({
  //         title: "Created",
  //         text: "Create Variant Product Successfully!",
  //         icon: "success",
  //         confirmButtonText: "OK",
  //       });
  //       reset();
  //       setPreview({ images: [] });
  //     } else {
  //       Swal.fire({
  //         title: "Oops!",
  //         text: "Failed to Create Variant Product!",
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });
  //     }
  //   }
  // };

  const handleAddVariant = async (data) => {
    if (data.color === customVariant.color) {
      Swal.fire({
        title: "Oops!",
        text: "Color not changed!",
        icon: "info",
        confirmButtonText: "OK",
      });
    } else {
      const formData = new FormData();
      
      // Set sold to 0 for each new variant
      const newVariant = {
        title: data.title,
        color: data.color,
        price: data.price,
        quantity: 0,
        sold: 0, // Default sold for the new variant
      };
  
      // Append variant data to formData
      for (let [key, value] of Object.entries(newVariant)) {
        formData.append(key, value);
      }
  
      // Handle images
      const images = data.images.length === 0 ? preview.images : data.images;
      for (let image of images) {
        formData.append("images", image);
      }
  
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiAddVariant(formData, customVariant._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
  
      console.log(response);
      if (response.success) {
        Swal.fire({
          title: "Created",
          text: "Variant Product Created Successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
        reset();
        setPreview({ images: [] });
      } else {
        Swal.fire({
          title: "Oops!",
          text: "Failed to Create Variant Product!",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      }
    }
  };
  

  return (
    <div className="w-full p-4 my-2 relative">
      <div className="flex px-6 bg-[#F5F5FA] gap-4 items-center text-3xl font-bold">
        <IoReturnDownBackOutline
          className="cursor-pointer hover:text-[#273526]"
          onClick={() => setCustomVariant(null)}
        />
        <h1>Variant Of Product</h1>
      </div>

      <div className="py-6">
        <form onSubmit={handleSubmit(handleAddVariant)}>
          <div className="flex py-4 w-full gap-4 items-center">
            <InputForm
              label="Name Product"
              register={register}
              errors={errors}
              id="title"
              fullWidth
              style="flex-auto border-main rounded-md"
            />

            <InputForm
              label="Variant Price"
              register={register}
              errors={errors}
              id="price"
              fullWidth
              style="flex-auto border-main rounded-md opacity-70"
              readOnly={true}
            />

            <InputForm
              label="Variant Color"
              register={register}
              errors={errors}
              id="color"
              fullWidth
              style="flex-auto border-main rounded-md"
            />

            {/* <InputForm
              label="Variant Quantity"
              register={register}
              errors={errors}
              value={0}
              id="quantity"
              fullWidth
              readOnly={true}
              style="flex-auto border-main rounded-md opacity-70"
            /> */}
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <label className="font-semibold" htmlFor="products">
              Upload Images Product
            </label>
            <input
              type="file"
              id="products"
              multiple
              {...register("images", { required: "Require" })}
            />
            {errors["images"] && (
              <small className="text-red-500">
                {errors["images"]?.message}
              </small>
            )}
          </div>

          {preview.images.length > 0 && (
            <div className="my-4 flex w-full gap-3 flex-wrap">
              {preview.images?.map((el, index) => (
                <div
                  onMouseEnter={() => setHoverImg(el.name)}
                  key={index}
                  className="w-fit relative"
                  onMouseLeave={() => setHoverImg(null)}
                >
                  <img
                    src={el}
                    alt="product"
                    className="w-[200px] object-contain"
                  />
                  {hoverImg === el.name && (
                    <div className="absolute inset-0 animate-slide-fwd-center bg-[#1c1c1c42] flex justify-center items-center">
                      <span
                        className="text-white bg-red-600 rounded-full p-4 cursor-pointer"
                        onClick={() => handleDeleteImage(index)}
                      >
                        <FaTrashCan size={24} />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="mt-8">
            <Button type="submit" name="Add New Variant" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(CustomVariant);
