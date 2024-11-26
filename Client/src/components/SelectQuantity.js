import React, {memo} from 'react'

const SelectQuantity = ({quantity, handleQuantity, handleChangeQuantity}) => {
  return (
    <div className="flex items-center bg-[#F5F5FA] border border-main rounded-md">
        <span onClick={() => handleChangeQuantity('minus')} className="text-[18px] text-main font-light px-2 border-r border-main cursor-pointer">-</span>
        <input 
        className="py-1 px-2 font-semibold text-main w-[40px] text-center outline-none bg-slate-100" 
        type="text" 
        value={quantity}
        onChange={e => handleQuantity(e.target.value)}
        />
        <span onClick={() => handleChangeQuantity('plus')} className="text-[18px] text-main font-light px-2 border-l border-main cursor-pointer">+</span>
    </div>
  )
}

export default memo(SelectQuantity)