import React, {memo} from 'react'

const SelectQuantity = ({quantity, handleQuantity, handleChangeQuantity}) => {
  return (
    <div className="flex items-center bg-[#F5F5FA] rounded-md">
        <span onClick={() => handleChangeQuantity('minus')} className="text-[20px] px-2 border-r border-gray-300 cursor-pointer">-</span>
        <input 
        className="py-2 w-[40px] text-center outline-none bg-slate-100" 
        type="text" 
        value={quantity}
        onChange={e => handleQuantity(e.target.value)}
        />
        <span onClick={() => handleChangeQuantity('plus')} className="text-[20px] px-2 border-l border-gray-300 cursor-pointer">+</span>
    </div>
  )
}

export default memo(SelectQuantity)