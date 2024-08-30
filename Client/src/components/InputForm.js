import React, { memo } from "react";
import clsx from "clsx";

const InputForm = ({
  label,
  disable,
  register,
  errors,
  id,
  validate,
  type = "text",
  placeholder,
  fullWidth,
  defaultValue,
  style,
  readOnly
}) => {
  return (
    <div className={clsx("flex flex-col gap-2", style)}>
      {label && <label className="font-medium" htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        {...register(id, validate)}
        disabled={disable}
        placeholder={placeholder}
        className={clsx(
          "form-input my-auto text-sm p-2",
          fullWidth ? "w-full" : "w-[120px]", style
        )}
        defaultValue={defaultValue}
        readOnly={readOnly}
      />
      {errors[id] && (
        <small className="text-red-500">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(InputForm);
