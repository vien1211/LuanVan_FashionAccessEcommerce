import React, { memo, useCallback, useEffect, useState } from "react";
import {
  InputForm,
  Select,
  Button,
  MarkDownEditor,
  Loading,
} from "../../components";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import icons from "../../ultils/icons";
import { showModal } from "../../store/app/appSlice";
import { useSelector, useDispatch } from "react-redux";
import { validate, getBase64 } from "../../ultils/helper";
import { apiUpdateProduct } from "../../apis";
import { fetchBrands } from "../../store/brand/AsyncAction";

const { FaTrashCan, IoReturnDownBackOutline } = icons;

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const { categories } = useSelector((state) => state.app);
  const { brands } = useSelector((state) => state.brand);
  const dispatch = useDispatch();

  const [preview, setPreview] = useState({
    images: [],
  });

  const [payload, setPayload] = useState({
    description: "",
  });

  const [imageChanged, setImageChanged] = useState(false); 

  useEffect(() => {
    dispatch(fetchBrands()).then(() => {
      reset({
        title: editProduct.title || "",
        price: editProduct.price || "",
        quantity: editProduct.quantity || "",
        color: editProduct.color || "",
        category: editProduct.category || "",
        brand: editProduct.brand || "",
      });
      setPayload({
        description:
          typeof editProduct?.description === "object"
            ? editProduct?.description?.join(",")
            : editProduct?.description,
      });
      setPreview({ images: editProduct?.images || [] });
    });
  }, [dispatch, editProduct, reset]);

  

  // useEffect(() => {
  //   // reset({
  //   //     title: editProduct.title || '',
  //   //     price: editProduct.price || '',
  //   //     quantity: editProduct.quantity || '',
  //   //     color: editProduct.color || '',
  //   //     category: editProduct.category || '',
  //   //     brand: editProduct.brand || '',
  //   // })
  //   setPayload({description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(',') : editProduct?.description})
  //   setPreview({images : editProduct?.images || []})
  // }, [editProduct])

  const [invalidField, setInvalidField] = useState([]);

  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const [hoverImg, setHoverImg] = useState(null);

  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images")?.length > 0)
      handlePreview(watch("images"));
  }, [watch("images")]);

  const handleDeleteImage = (index) => {
    setPreview((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages };
    });
  };

  // const handleUpdateProduct = async (data) => {
  //   const invalids = validate(payload, setInvalidField);
  //   if (invalids === 0) {
  //     if (data.category && data.brand)
  //       data.category = categories?.find(
  //         (el) => el.title === data.category
  //       )?.title;

  //     if (data.brand)
  //       data.brand = brands?.find((el) => el.title === watch("brand"))?.title;
  //     const finalPayload = { ...data, ...payload };
  //     console.log(finalPayload);
  //     const formData = new FormData();
  //     for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      
  //     if (finalPayload.images) {
  //       const images =
  //         finalPayload?.images?.length === 0
  //           ? preview.images
  //           : finalPayload.images;
  //       for (let image of images) formData.append("images", image);
  //     }
      
  //     dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
  //     const response = await apiUpdateProduct(formData, editProduct._id);
  //     dispatch(showModal({ isShowModal: false, modalChildren: null }));
  //     console.log(response);
  //     if (response.success) {
  //       Swal.fire({
  //         title: "Updated",
  //         text: "Update Product Successfully!",
  //         icon: "success",
  //         confirmButtonText: "OK",
  //         customClass: {
  //           title: "custom-title",
  //           text: "custom-text",
  //           confirmButton: "custom-confirm-button",
  //         },
  //       });
  //       render();
  //       setEditProduct(null);
  //     } else {
  //       Swal.fire({
  //         title: "Oops!",
  //         text: "Failed to Update Variant Product!",
  //         icon: "error",
  //         confirmButtonText: "OK",
  //         customClass: {
  //           title: "custom-title",
  //           text: "custom-text",
  //           confirmButton: "custom-confirm-button",
  //         },
  //       });
  //     }
  //   }
  // };

  const handleUpdateProduct = async (data) => {
    if (!editProduct) {
      Swal.fire({
        title: "Error",
        text: "No product selected for updating!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  
    const formData = new FormData();
  
    // Append fields to formData only if they are provided
    if (data.title) formData.append("title", data.title);
    if (data.price) formData.append("price", data.price);
    if (data.category) {
      const categoryTitle = categories?.find((el) => el.title === data.category)?.title;
      if (categoryTitle) formData.append("category", categoryTitle);
    }
    if (data.brand) {
      const brandTitle = brands?.find((el) => el.title === data.brand)?.title;
      if (brandTitle) formData.append("brand", brandTitle);
    }
    if (data.description) formData.append("description", data.description);
  
    // Append new images to the FormData object if they are changed
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }
  
    // Dispatch loading modal
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
  
    try {
      // Call the API with the product ID
      const productId = editProduct?._id; // Use the ID of the product being edited
      const response = await apiUpdateProduct(formData, productId);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
  
      // Debugging: Log the response
      console.log("Update Product Response:", response);
  
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
        setEditProduct(null);
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
        text: error.message || "Failed to update product!",
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

    setPreview((prev) => ({ ...prev, images: imgPreview }));
    setImageChanged(true); 
  };

  return (
    <div className="w-full p-4 relative">
      <div className="flex px-6 bg-[#F5F5FA] gap-4 items-center text-3xl font-bold">
        <IoReturnDownBackOutline
          className="cursor-pointer hover:text-[#273526]"
          onClick={() => setEditProduct(null)}
        />
        <h1>Update Product</h1>
      </div>

      <div className="py-4">
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <InputForm
            label="Name Product"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Require",
            }}
            fullWidth
            placeholder="Name Product"
            style="rounded-md"
          />

          <div className="w-full my-8 flex gap-4">
            <InputForm
              label="Price"
              register={register}
              errors={errors}
              id="price"
              // validate={{
              //   required: "Require",
              // }}
              fullWidth={true}
              style="flex-auto rounded-md"
              placeholder="Price Product"
              type="number"
            />

            {/* <InputForm
              label="Quantity"
              register={register}
              errors={errors}
              id="stockInfo"
              readOnly={true}
              fullWidth={true}
              style="flex-auto rounded-md opacity-70"
              placeholder="Quantity"
              type="number"
            /> */}

            <InputForm
              label="Color"
              register={register}
              errors={errors}
              id="color"
              validate={{
                required: "Require",
              }}
              fullWidth={true}
              style="flex-auto rounded-md"
              placeholder="Color"
            />
          </div>

          <div className="w-full my-6 flex gap-4">
            <Select
              label="Category"
              option={categories?.map((el) => ({
                code: el.title,
                value: el.title,
              }))}
              register={register}
              id="category"
              style="flex-auto rounded-md"
              errors={errors}
              validate={{
                required: "Require",
              }}
              fullWidth={true}
            />

            <Select
              label="Brand"
              option={brands?.map((el) => ({
                code: el.title,
                value: el.title,
              }))}
              register={register}
              id="brand"
              style="flex-auto rounded-md"
              errors={errors}
              validate={{
                required: "Require",
              }}
              fullWidth={true}
            />

            {/* <Select
              label="Brand"
              option={brands
                ?.find((el) => el.title === watch("brand"))
                ?.brands?.map((el) => ({ code: el.title, value: el.title }))}
              register={register}
              id="brand"
              style="flex-auto rounded-md"
              errors={errors}
              validate={{
                required: "Require",
              }}
              fullWidth={true}
            /> */}
          </div>
          <MarkDownEditor
            name="description"
            changeValue={changeValue}
            label="Description"
            invalidField={invalidField}
            setInvalidField={setInvalidField}
            value={payload.description}
          />

          <div className="flex flex-col gap-4 mt-8">
            <label className="font-semibold" htmlFor="products">
              Upload Images Product
            </label>
            <input type="file" id="products" multiple {...register("images")} />
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
                  onMouseEnter={() => setHoverImg(index)} 
                  key={index}
                  className="w-fit relative"
                  onMouseLeave={() => setHoverImg(null)}
                >
                  
                  <img
                    src={el}
                    alt="product"
                    className="w-[180px] object-contain"
                  />
                  {hoverImg === index && ( // Only show overlay on the image being hovered
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
            <Button type="submit" name="Update Product" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateProduct);
