


// import React, { memo } from "react";
// import { Editor } from "@tinymce/tinymce-react";

// const MarkDownEditor = ({
//   label,
//   value,
//   changeValue,
//   name,
//   invalidField,
//   setInvalidField,
// }) => {
//   return (
//     <div className="flex flex-col">
//       <span className="">{label}</span>
//       <Editor
//         apiKey="1mkp0l5t4oxb6xhs1xywjr3tsdtb2zzgreg5mblbqu7j7ykj"
//         init={{
//           height: 500,
//           menubar: true,
//           plugins:
//             "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
//           toolbar:
//             "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
//         }}
//         initialValue={value}
//         onEditorChange={(content) =>
//           changeValue((prev) => ({ ...prev, [name]: content }))
//         }
//         onFocus={() =>
//           setInvalidField &&
//           setInvalidField((prev) => prev.filter((el) => el.name !== name))
//         }
//       />
//     </div>
//   );
// };

// export default memo(MarkDownEditor);



import React, { memo } from "react";
import { Editor } from "@tinymce/tinymce-react";

const MarkDownEditor = ({
  label,
  value,
  changeValue,
  name,
  invalidField,
  setInvalidField,
}) => {
  
  return (
    <div className="flex flex-col">
      <span>{label}</span>
      <Editor
        apiKey="1mkp0l5t4oxb6xhs1xywjr3tsdtb2zzgreg5mblbqu7j7ykj"
        init={{
          height: 500,
          menubar: true,
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          //images_upload_handler: handleImageUpload, // Add the image upload handler
          file_picker_types: "file image media", // Enable image file picker
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.onchange = function () {
                const file = this.files[0];
                const reader = new FileReader();
                reader.onload = function () {
                  callback(reader.result, {
                    alt: file.name,
                  });
                };
                reader.readAsDataURL(file);
              };
              input.click();
            }
          },
        }}
        initialValue={value}
        onEditorChange={(content) =>
          changeValue((prev) => ({ ...prev, [name]: content }))
        }
        onFocus={() =>
          setInvalidField &&
          setInvalidField((prev) => prev.filter((el) => el.name !== name))
        }
      />
    </div>
  );
};

export default memo(MarkDownEditor);



