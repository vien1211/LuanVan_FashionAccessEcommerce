import React, { memo } from "react";

const Button = ({
  name,
  onClick,
  handleOnClick,
  style,
  iconBefore,
  iconAfter,
  fw,
  type = 'button'
}) => {
  return (
    <div className={fw ? 'w-full' : 'w-fit'}>
      <button
        type={type}
        className={style ? style : `px-4 py-2 rounded-md text-white bg-main flex items-center justify-center my-2 ${fw ? 'w-full' : 'w-fit'}`}
        onClick={() => { 
          handleOnClick && handleOnClick(); 
          onClick && onClick();              
        }}
      >
        {iconBefore && <span className="mr-2 ml-2">{iconBefore}</span>}
        <span>{name}</span>
        {iconAfter && <span className="ml-2">{iconAfter}</span>}
      </button>
    </div>
  );
};

export default memo(Button);
