import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import Swal from "sweetalert2";
import {
  Button,
  InputForm,
  Loading,
  MarkDownEditor,
  Select,
} from "../../components";
import { getBase64, validate } from "../../ultils/helper";
import { apiCreateBlogPost } from "../../apis";
import { fetchBlogCategories } from "../../store/blogcategory/AsyncAction";

const CreateBlogPost = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const { blogcategories } = useSelector((state) => state.blogcategory);
  const dispatch = useDispatch();

  const [payload, setPayload] = useState({
    description: "",
  });

  const [invalidField, setInvalidField] = useState([]);

  const [preview, setPreview] = useState({
    image: [], // Đảm bảo luôn là một mảng
  });

  const [imageChanged, setImageChanged] = useState(false); 

  useEffect(() => {
    dispatch(fetchBlogCategories());
  }, [dispatch]);

  const changeValue = useCallback((e) => {
    setPayload(e);
  }, []);

  const handleCreatePost = async (data) => {
    const invalids = validate(payload, setInvalidField);
    if (invalids === 0) {
      if (data.category) {
        // Ensure we are using the ObjectId for the category
        const selectedCategory = blogcategories.find(
          (el) => el.title === data.category
        );
        if (selectedCategory) {
          data.category = selectedCategory._id; // Use ObjectId
        }
      }

      const finalPayload = { ...data, ...payload };
      console.log("Final Payload:", finalPayload); // Check final payload

      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);

      if (finalPayload.image) formData.append("image", finalPayload.image[0]);

      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiCreateBlogPost(formData); // Pass final payload
      dispatch(showModal({ isShowModal: false, modalChildren: null }));

      if (response.success) {
        Swal.fire({
          title: "Created",
          text: "Create Blog Post Successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
        reset();
      setPreview({ image: [] }); // Clear the previewed image
      setImageChanged(false); // Reset image changed flag
        setPayload({ description: "" }); // Reset the description as well
      } else {
        Swal.fire({
          title: "Oops!",
          text: "Failed to Create Blog Post!",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      }
    } else {
      Swal.fire({
        title: "Validation Error",
        text: invalidField.join(", "), // Show the invalid fields if any
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

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

  return (
    <div className="w-full p-6">
      <h1 className="flex justify-between items-center text-3xl font-bold px-8">
        <span>Create New Blog Post</span>
      </h1>

      <div className="py-4">
        <form onSubmit={handleSubmit(handleCreatePost)}>
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
              option={blogcategories.map((el) => ({
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
          </div>

          <div className="mt-4">
            {Array.isArray(preview.image) && preview.image.length > 0 ? (
              <img
                src={preview.image[0]}
                alt="Preview"
                className="w-[950px] h-[380px] rounded-lg object-cover mx-auto"
              />
            ) : (
              <p>No image available</p>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-8 mb-2">
            <label className="font-semibold" htmlFor="blogs">
              Upload Thumbnail Image
            </label>
            <input
              type="file"
              id="blogs"
              {...register("image", { required: "Require" })}
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
          />

          <div className="mt-8">
            <Button type="submit" name="Create New Post" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPost;

// const handleCreatePost = async (data) => {
//   // Check if category is selected
//   if (data.category) {
//     const selectedCategory = blogcategories.find(
//       (el) => el.title === data.category
//     );
//     if (selectedCategory) {
//       data.category = selectedCategory._id;
//     }
//   }

//   const finalPayload = {
//     ...data,
//     description, // Include the array of descriptions
//   };

//   dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));

//   const response = await apiCreateBlogPost(finalPayload);

//   dispatch(showModal({ isShowModal: false, modalChildren: null }));

//   if (response.success) {
//     Swal.fire({
//       title: "Created",
//       text: "Create Blog Post Successfully!",
//       icon: "success",
//       confirmButtonText: "OK",
//     });
//     reset();
//     setDescription([{ text: "", image: {} }]); // Reset the description list
//   } else {
//     Swal.fire({
//       title: "Oops!",
//       text: "Failed to Create Blog Post!",
//       icon: "error",
//       confirmButtonText: "OK",
//     });
//   }
// };

// const handleCreatePost = async (data) => {
//   // Check if category is selected
//   if (data.category) {
//     const selectedCategory = blogcategories.find(
//       (el) => el.title === data.category
//     );
//     if (selectedCategory) {
//       data.category = selectedCategory._id;
//     }
//   }

//   // Prepare the payload with only text descriptions
//   const descriptions = description.map((desc) => desc.text);

//   const finalPayload = {
//     ...data,
//     description: descriptions, // Send only an array of text
//   };

//   dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));

//   const response = await apiCreateBlogPost(finalPayload);

//   dispatch(showModal({ isShowModal: false, modalChildren: null }));

//   if (response.success) {
//     Swal.fire({
//       title: "Created",
//       text: "Create Blog Post Successfully!",
//       icon: "success",
//       confirmButtonText: "OK",
//     });
//     reset();
//     setDescription([{ text: "", image: {} }]); // Reset the description list
//   } else {
//     Swal.fire({
//       title: "Oops!",
//       text: "Failed to Create Blog Post!",
//       icon: "error",
//       confirmButtonText: "OK",
//     });
//   }
// };

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import Swal from "sweetalert2";
// import { Button, InputForm, Select, Loading } from "../../components";
// import { showModal } from "../../store/app/appSlice";
// import { apiCreateBlogPost, apiUploadBlogImage } from "../../apis";
// import { fetchBlogCategories } from "../../store/blogcategory/AsyncAction";

// const CreateBlogPost = () => {
//   const {
//     register,
//     formState: { errors },
//     reset,
//     handleSubmit,
//   } = useForm();

//   const dispatch = useDispatch();
//   const { blogcategories } = useSelector((state) => state.blogcategory);

//   const [description, setDescription] = useState([{ text: "", image: null }]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch blog categories
//   useEffect(() => {
//     dispatch(fetchBlogCategories());
//   }, [dispatch]);

//   // Add new description
//   const addDescription = () => {
//     setDescription([...description, { text: "", image: null }]);
//   };

//   // Remove description
//   const removeDescription = (index) => {
//     const updatedList = description.filter((_, i) => i !== index);
//     setDescription(updatedList);
//   };

//   // Handle text change in description
//   const handleTextChange = (index, e) => {
//     const updatedList = [...description];
//     updatedList[index].text = e.target.value;
//     setDescription(updatedList);
//   };

//   // Handle image change in description
//   const handleImageChange = (index, e) => {
//     const updatedList = [...description];
//     updatedList[index].image = e.target.files[0] || null; // Handle empty image selection
//     setDescription(updatedList);
//   };

//   // Handle form submission
//   const handleCreatePost = async (data) => {
//     if (isSubmitting) return;

//     // Check if category is selected
//     if (data.category) {
//       const selectedCategory = blogcategories.find(
//         (el) => el.title === data.category
//       );
//       if (selectedCategory) {
//         data.category = selectedCategory._id;
//       }
//     }

//     try {
//       setIsSubmitting(true);
//       dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));

//       // Prepare the final payload with title, category, and descriptions
//       const finalPayload = {
//         ...data,
//         description: await Promise.all(
//           description.map(async (desc) => {
//             const imageUrl = desc.image ? await uploadImage(desc.image, bid) : null;
//             return { text: desc.text, image: imageUrl };
//           })
//         ),
//       };

//       // Create blog post with all necessary data
//       const response = await apiCreateBlogPost(finalPayload);
//       if (!response.success) {
//         throw new Error("Failed to create blog post");
//       }

//       const bid = response.data._id; // Get the created blog post ID

//       // Optionally, upload images if they exist
//       for (const desc of description) {
//         if (desc.image) {
//           await uploadImage(desc.image, bid); // Upload image for each description
//         }
//       }

//       Swal.fire({
//         title: "Created",
//         text: "Create Blog Post Successfully!",
//         icon: "success",
//         confirmButtonText: "OK",
//       });
//       reset();
//       setDescription([{ text: "", image: null }]); // Reset the description list
//     } catch (error) {
//       Swal.fire({
//         title: "Oops!",
//         text: error.message || "Failed to Create Blog Post!",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     } finally {
//       dispatch(showModal({ isShowModal: false, modalChildren: null }));
//       setIsSubmitting(false);
//     }
//   };

//   // Function to upload an image and return the URL
//   const uploadImage = async (imageFile, bid) => {
//     try {
//       const formData = new FormData();
//       formData.append("image", imageFile); // Assuming the API expects 'file'

//       const imageResponse = await apiUploadBlogImage(bid, formData); // Call your image upload API
//       if (!imageResponse.success) {
//         throw new Error(imageResponse.mes || "Image upload failed");
//       }

//       return imageResponse.data.url; // Return the uploaded image URL
//     } catch (error) {
//       console.error("Image upload failed:", error);
//       throw new Error("Failed to upload image");
//     }
//   };

//   return (
//     <div className="w-full p-6">
//       <h1 className="text-3xl font-bold px-8">Create New Blog Post</h1>
//       <div className="py-4">
//         <form onSubmit={handleSubmit(handleCreatePost)}>
//           <div className="w-full my-8 flex gap-4">
//             <InputForm
//               label="Title Post"
//               register={register}
//               errors={errors}
//               id="title"
//               validate={{ required: "Require" }}
//               fullWidth
//               placeholder="Title Blog Post"
//               style="flex-auto rounded-md"
//             />
//             <Select
//               label="Category"
//               option={blogcategories.map((el) => ({
//                 code: el._id,
//                 value: el.title,
//               }))}
//               register={register}
//               id="category"
//               style="flex-auto rounded-md"
//               errors={errors}
//               validate={{ required: "Require" }}
//               fullWidth
//             />
//           </div>

//           {/* Dynamic Descriptions */}
//           {description.map((desc, index) => (
//             <div key={index} className="mb-4">
//               <textarea
//                 value={desc.text}
//                 onChange={(e) => handleTextChange(index, e)}
//                 placeholder={`Description ${index + 1}`}
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleImageChange(index, e)}
//                 className="mt-2"
//               />
//               <Button
//                 type="button"
//                 name="Remove"
//                 onClick={() => removeDescription(index)}
//                 style="bg-red-500 mt-2"
//               />
//             </div>
//           ))}

//           <Button type="button" name="Add Description" onClick={addDescription} />

//           <div className="mt-8">
//             <Button type="submit" name="Create New Post" disabled={isSubmitting} />
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateBlogPost;
