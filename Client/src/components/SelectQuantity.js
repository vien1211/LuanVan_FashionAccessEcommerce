import React, {memo} from 'react'

const SelectQuantity = ({quantity, handleQuantity, handleChangeQuantity}) => {
  return (
    <div className="flex items-center">
        <span onClick={() => handleChangeQuantity('minus')} className="text-[20px] p-2 border-r border-black cursor-pointer">-</span>
        <input 
        className="py-2 w-[40px] text-center outline-none" 
        type="text" 
        value={quantity}
        onChange={e => handleQuantity(e.target.value)}
        />
        <span onClick={() => handleChangeQuantity('plus')} className="text-[20px] p-2 border-l border-black cursor-pointer">+</span>
    </div>
  )
}

export default memo(SelectQuantity)