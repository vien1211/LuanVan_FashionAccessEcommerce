// import React, { useCallback, useEffect, useState } from 'react'
// import icons from "../../ultils/icons";
// import { apiUpdateBlog } from '../../apis';
// import Swal from 'sweetalert2';
// import { useForm } from 'react-hook-form';
// import { InputForm, Loading, MarkDownEditor, Select } from '../../components';
// import { useDispatch, useSelector } from 'react-redux';
// import { showModal } from '../../store/app/appSlice';
// import { fetchBlogCategories } from "../../store/blogcategory/AsyncAction";
// import { validate, getBase64 } from "../../ultils/helper";

// const { FaTrashCan,  IoReturnDownBackOutline } = icons;

// const UpdateBlog = ({editBlog, render, setEditBlog}) => {
//   const {
//     register,
//     formState: { errors },
//     reset,
//     handleSubmit,
//     watch,
//   } = useForm();


//   const { blogcategories } = useSelector((state) => state.blogcategory);

//   const dispatch = useDispatch()

//   const [preview, setPreview] = useState({
//     image: [],
//   });

//   const [payload, setPayload] = useState({
//     description: "",
//   });

//   const [invalidField, setInvalidField] = useState([]);

//   // useEffect(() => {
//   //   dispatch(fetchBlogCategories())
//   // }, [dispatch]);

//   const changeValue = useCallback(
//     (e) => {
//       setPayload(e);
//     },
//     [payload]
//   );

//   useEffect(() => {
//     dispatch(fetchBlogCategories()).then(() => {
//       if (editBlog) {
//         reset({
//           title: editBlog.title || '',
//           category: editBlog.category.title || '',
//         });
//         setPayload({
//           description: typeof editBlog?.description === 'object' ? editBlog?.description?.join(',') : editBlog?.description
//         });
//         setPreview({ image: editBlog?.image || [] });
//       }
//     });
//   }, [dispatch, editBlog, reset]);
  

//   // useEffect(() => {
//   //   reset({
//   //       title: editBlog.title || '',
//   //       category: editBlog.category?.title || '',
//   //   })
//   //   setPayload({description: typeof editBlog?.description === 'object' ? editBlog?.description?.join(',') : editBlog?.description})
//   //   setPreview({image : editBlog?.image || []})
//   // }, [editBlog])

//   // useEffect(() => {
//   //   if (editBlog) {
//   //     reset({
//   //       title: editBlog.title || '',
//   //       category: editBlog.category?.title || '',
//   //     });
//   //     setPayload({
//   //       description: typeof editBlog?.description === 'object' ? editBlog?.description?.join(',') : editBlog?.description
//   //     });
//   //     setPreview({ image: editBlog?.image || [] });
//   //   }
//   // }, [editBlog, reset]); // Thêm reset vào dependency array

//   useEffect(() => {
//     if(watch('image') instanceof FileList && watch('image')?.length > 0)
//         handlePreview(watch('image'))
//   }, [watch('image')]);

//   const handlePreview = async (files) => {
//     const imgPreview = [];
//     for (let file of files) {
//       if (
//         file.type !== "image/png" &&
//         file.type !== "image/jpg" &&
//         file.type !== "image/jpeg" &&
//         file.type !== "image/avif" &&
//         file.type !== "image/webp"
//       ) {
//         Swal.fire({
//           title: "File not supported!",
//           icon: "warning",
//           confirmButtonText: "Ok",
//         });
//         return;
//       }
//       const base64Image = await getBase64(file);
//       imgPreview.push(base64Image);
//     }

//     setPreview((prev) => ({ ...prev, image: imgPreview }));
    
//   };
  

//   const handleUpdateBlog = async (data) => {
//     const invalids = validate(payload, setInvalidField);
//     if (invalids === 0) {
//       if (data.blogcategory)
//         data.blogcategory = blogcategories?.find(
//           // (el) => el.category.title === data.blogcategory
//           (el) => el.blogcategory.title === watch("blogcategory")
//         )?.title;
//         // if (data.blogcategory)
//         //   data.blogcategory = blogcategories?.find((el) => el.title === watch("blogcategory"))?.title;
        
//       const finalPayload = { ...data, ...payload };
//       console.log(finalPayload);
//       const formData = new FormData();
//       for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
//     //   if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
//       if (finalPayload.images) {
//         const image = finalPayload?.image?.length === 0 ? preview.image : finalPayload.image
//         for (let image of image) formData.append("image", image);
//       }
//       dispatch(showModal({ isShowModal: true, modalChildren: <Loading/>}))
//       const response = await apiUpdateBlog(formData, editBlog._id);
//       dispatch(showModal({ isShowModal: false, modalChildren: null}))
//       console.log(response);
//       if(response.success){
//         Swal.fire({
//           title: "Updated",
//           text: "Update Product Successfully!",
//           icon: "success",
//           confirmButtonText: "OK",
//         });
//         render()
//         setEditBlog(null)
//       } else {
//         Swal.fire({
//           title: "Oops!",
//           text: "Failed to Update Product!",
//           icon: "error",
//           confirmButtonText: "OK",
//         });
//       }
//     }
//   };

//   return (
//     <div className="w-full p-4 relative">
//       <div className="flex px-6 bg-[#F5F5FA] gap-4 items-center text-3xl font-bold">
//         <IoReturnDownBackOutline className='cursor-pointer hover:text-[#273526]' onClick={() =>setEditBlog(null)}/>
//         <h1>Update Blog Post</h1>
//       </div>

//       <div className="py-4">
//       <form onSubmit={handleSubmit(handleUpdateBlog)}>
//         <div className="w-full my-8 flex gap-4">
//           <InputForm
//               label="Title Post"
//               register={register}
//               errors={errors}
//               id="title"
//               validate={{
//                 required: "Require",
//               }}
//               fullWidth
//               placeholder="Title Blog Post"
//               style="flex-auto rounded-md"
//             />
            

//             <Select
//               label="Category"
//               option={blogcategories?.map((el) => ({
//                 code: el.title,
//                 value: el.title,
//               }))}
//               register={register}
//               id="category"
//               style="flex-auto rounded-md"
//               errors={errors}
//               validate={{
//                 required: "Require",
//               }}
//               fullWidth={true}
//             />
//           </div>

//           <div className="flex flex-col gap-4 mt-8 mb-2">
//             <label className="font-semibold" htmlFor="blogs">
//               Upload Image
//             </label>
//             <input
//               type="file"
//               id="blogs"
//               {...register("image", { required: "Require" })}
//             />
//             {errors["image"] && (
//               <small className="text-red-500">
//                 {errors["image"]?.message}
//               </small>
//             )}
//           </div>
//           <div className="flex flex-wrap mt-4">
//             {preview.image.map((img, index) => (
//               <img key={index} src={img} alt={`Preview ${index}`} className="w-32 h-32 object-cover mr-2 mb-2" />
//             ))}
//           </div>

//           <MarkDownEditor
//             name="description"
//             changeValue={changeValue}
//             label="Description"
//             invalidField={invalidField}
//             setInvalidField={setInvalidField}
//             value={payload.description}
            
//           />
      
//       </form>
//       </div>
//     </div>
//   )
// }

// export default UpdateBlog

import React, { useCallback, useEffect, useState } from 'react';
import icons from "../../ultils/icons";
import { apiUpdateBlog } from '../../apis';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { Button, InputForm, Loading, MarkDownEditor, Select } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '../../store/app/appSlice';
import { fetchBlogCategories } from "../../store/blogcategory/AsyncAction";
import { validate, getBase64 } from "../../ultils/helper";

const { FaTrashCan, IoReturnDownBackOutline } = icons;

const UpdateBlog = ({ editBlog, render, setEditBlog }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const { blogcategories } = useSelector((state) => state.blogcategory);
  const dispatch = useDispatch();

  const [preview, setPreview] = useState({
    image: [], // Đảm bảo luôn là một mảng
  });

  const [payload, setPayload] = useState({
    description: "",
  });

  const [invalidField, setInvalidField] = useState([]);
  const [imageChanged, setImageChanged] = useState(false); 

  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  useEffect(() => {
    dispatch(fetchBlogCategories()).then(() => {
      if (editBlog) {
        reset({
          title: editBlog.title || '',
          category: editBlog.category.title || '',
        });
        setPayload({
          description: typeof editBlog?.description === 'object' ? editBlog?.description?.join(',') : editBlog?.description
        });
        setPreview({ image: editBlog?.image ? [editBlog.image] : [] }); 
      }
    });
  }, [dispatch, editBlog, reset]);

  const handlePreview = async (files) => {
    if (files.length === 0) return;

    const file = files[0]; // Chỉ lấy ảnh đầu tiên

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
    setPreview((prev) => ({ ...prev, image: [base64Image] })); 
    setImageChanged(true); 
  };

  const handleUpdateBlog = async (data) => {
    const invalids = validate(payload, setInvalidField);
    if (invalids === 0) {
      const selectedCategory = blogcategories.find(
        (el) => el.title === watch("category")
      );

      if (selectedCategory) {
        data.category = selectedCategory._id;
      } else {
        Swal.fire({
          title: "Invalid Category",
          text: "The selected category does not exist.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      const finalPayload = { ...data, ...payload };
      const formData = new FormData();

      for (let [key, value] of Object.entries(finalPayload)) {
        if (key !== "image") {
          formData.append(key, value);
        }
      }

      if (imageChanged && preview.image[0]) {
        // Chỉ thêm ảnh vào form nếu ảnh đã được thay đổi
        formData.append("image", preview.image[0]);
      }

      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdateBlog(formData, editBlog._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));

      if (response.success) {
        Swal.fire({
          title: "Cập nhật thành công",
          text: "Blog đã được cập nhật thành công!",
          icon: "success",
          confirmButtonText: "OK",
        });
        render();
        setEditBlog(null);
      } else {
        Swal.fire({
          title: "Lỗi",
          text: "Cập nhật blog thất bại!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="w-full p-4 relative">
      <div className="flex px-6 bg-[#F5F5FA] gap-4 items-center text-3xl font-bold">
        <IoReturnDownBackOutline className='cursor-pointer hover:text-[#273526]' onClick={() => setEditBlog(null)} />
        <h1>Update Blog Post</h1>
      </div>

      <div className="py-4">
        <form onSubmit={handleSubmit(handleUpdateBlog)}>
          <div className="w-full my-8 flex gap-4">
            <InputForm
              label="Title Post"
              register={register}
              errors={errors}
              id="title"
              validate={{
                required: "Require",
              }}
              fullWidth
              placeholder="Title Blog Post"
              style="flex-auto rounded-md"
            />

            <Select
              label="Category"
              option={blogcategories?.map((el) => ({
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
          </div>

          <div className="mt-4">
            {Array.isArray(preview.image) && preview.image.length > 0 ? (
              <img
                src={preview.image[0]} // Chỉ lấy ảnh đầu tiên (nếu có)
                alt="Preview"
                className="w-[950px] h-[380px] rounded-lg object-cover mx-auto"
              />
            ) : (
              <p>No image available</p>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-8 mb-2">
            <label className="font-semibold" htmlFor="blogs">
              Upload Image
            </label>
            <input
              type="file"
              id="blogs"
              {...register("image")}
              onChange={(e) => handlePreview(e.target.files)}
              accept="image/*"
            />
            {errors["image"] && (
              <small className="text-red-500">{errors["image"]?.message}</small>
            )}
          </div>

          <MarkDownEditor
            name="description"
            changeValue={changeValue}
            label="Description"
            invalidField={invalidField}
            setInvalidField={setInvalidField}
            value={payload.description}
          />

          

          <Button name="Update Blog Post" type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBlog;

