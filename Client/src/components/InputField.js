import React, { useState } from "react";
import clsx from 'clsx'

const InputField = ({ value, setValue, nameKey, type, invalidFields, style, fullWidth }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div className={clsx('flex flex-col mb-2 relative', fullWidth && 'w-full')}>
      <input
        type={type || "text"}
        className={clsx(`px-4 py-2 rounded-sm border w-full mt-2 placeholder:text-sm outline-none ${
          value || isFocus ? "pt-5 pb-1" : "py-2"
        }`, style)}
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(value !== "")}
      />
      {invalidFields?.find(el => el.name === nameKey)?.mes && (
        <small className='text-main text-[10px]'>{invalidFields.find(
          el => el.name === nameKey)?.mes
        }</small>
      )}
      
      <label
        className={`absolute left-4 transition-all duration-300 ${
          value || isFocus
            ? "top-0 text-[12px] bg-white text-main"
            : "top-1/2 transform -translate-y-1/3 text-gray-400"
        }`}
        htmlFor={nameKey}
      >
        {nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
      </label>
    </div>
  );
};

export default InputField;
