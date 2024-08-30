import React, { useCallback, useEffect, useState } from "react";
import {
  InputForm,
  Select,
  Button,
  MarkDownEditor,
  Loading,
} from "../../components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { validate, getBase64 } from "../../ultils/helper";
import Swal from "sweetalert2";
import icons from "../../ultils/icons";
import { apiCreateProduct } from "../../apis";
import { showModal } from "../../store/app/appSlice";
import { fetchBrands } from "../../store/brand/AsyncAction";

const { FaTrashCan } = icons;

const CreateProduct = () => {
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

  const [invalidField, setInvalidField] = useState([]);

  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const [hoverImg, setHoverImg] = useState(null);

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
      imgPreview.push({ name: file.name, path: base64Image });
    }

    setPreview((prev) => ({ ...prev, images: imgPreview }));
  };

  useEffect(() => {
    const images = watch("images");
    if (images && images.length > 0) {
      handlePreview(images);
    }
  }, [watch("images")]);

  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidField);
    if (invalids === 0) {
      if (data.category)
        data.category = categories?.find(
          (el) => el._id === data.category
        )?.title;
      if (data.brand)
        data.brand = brands?.find((el) => el._id === data.brand)?.title;
      const finalPayload = { ...data, ...payload };
      console.log(finalPayload);
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
      if (finalPayload.images) {
        for (let image of finalPayload.images) formData.append("images", image);
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiCreateProduct(formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      console.log(response);
      if (response.success) {
        Swal.fire({
          title: "Created",
          text: "Create Product Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        reset();
        setPayload({
          images: [],
        });
      } else {
        Swal.fire({
          title: "Oops!",
          text: "Failed to Create Product!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // const handleCreateProduct = async (data) => {
  //   const invalids = validate(payload, setInvalidField);
  //   if (invalids === 0) {
  //     if (data.category)
  //       data.category = categories?.find(
  //         (el) => el._id === data.category
  //       )?.title;

  //       if (data.brand)
  //         data.brand = brands?.find(
  //           (el) => el._id === data.brand
  //         )?.title;

  //     const finalPayload = { ...data, ...payload };

  //     const formData = new FormData();
  //     for (let [key, value] of Object.entries(finalPayload)) {
  //       formData.append(key, value);
  //     }

  //     //if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);

  //     // Sử dụng `preview.images` để gửi dữ liệu ảnh
  //     if (preview.images.length > 0) {
  //       for (let image of preview.images) {
  //         // Chuyển đổi chuỗi base64 thành Blob
  //         const blob = await fetch(image.path).then(r => r.blob());
  //         formData.append("images", blob, image.name);
  //       }
  //     }

  //     // Kiểm tra nội dung của formData trước khi gửi
  //     for (let pair of formData.entries()) {
  //       //console.log(pair[0] + ': ', pair[1]);
  //     }

  //     dispatch(showModal({ isShowModal: true, modalChildren: <Loading/> }));
  //     const response = await apiCreateProduct(formData);
  //     dispatch(showModal({ isShowModal: false, modalChildren: null }));

  //     if (response.success) {
  //       Swal.fire({
  //         title: "Created",
  //         text: "Create Product Successfully!",
  //         icon: "success",
  //         confirmButtonText: "OK",
  //       });
  //       reset();
  //       setPayload({ images: [] });
  //     } else {
  //       Swal.fire({
  //         title: "Oops!",
  //         text: "Failed to Create Product!",
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });
  //     }
  //   }
  // };

  const handleDeleteImage = (index) => {
    setPreview((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages };
    });
  };

  return (
    <div className="w-full p-6">
      <h1 className="flex justify-between items-center text-3xl font-bold px-8">
        <span>Create New Product</span>
      </h1>
      <div className="py-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label="Name Product"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Require",
            }}
            fullWidth
            placeholder="Name of Product"
            style="rounded-md"
          />

          <div className="w-full my-8 flex gap-4">
            <InputForm
              label="Price"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: "Require",
              }}
              fullWidth={true}
              style="flex-auto rounded-md"
              placeholder="Price of Product"
              type="number"
            />

            <InputForm
              label="Quantity"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Require",
              }}
              fullWidth={true}
              style="flex-auto rounded-md"
              placeholder="Quantity"
              type="number"
            />

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
                code: el._id,
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
              option={brands.map((el) => ({
                code: el._id,
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
          </div>
          <MarkDownEditor
            name="description"
            changeValue={changeValue}
            label="Description"
            invalidField={invalidField}
            setInvalidField={setInvalidField}
          />

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
                    src={el.path}
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
            <Button type="submit" name="Create New Product" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
