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
      <span className="">{label}</span>
      <Editor
        apiKey="1mkp0l5t4oxb6xhs1xywjr3tsdtb2zzgreg5mblbqu7j7ykj"
        init={{
          height: 500,
          menubar: true,
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
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
