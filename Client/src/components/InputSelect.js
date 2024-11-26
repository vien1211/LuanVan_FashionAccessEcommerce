import React, { memo } from 'react';

const InputSelect = ({ value, changeValue, options }) => {
  return (
    <select
      className='form-select h-[41px] shadow-md border border-gray-300 rounded-md bg-white text-gray-700 text-sm' // Adjusted classes for styling
      value={value}
      onChange={e => changeValue(e.target.value)}
    > 
      {/* <option value="">Products</option> */}
      {options?.map(el => (
        <option key={el.id} value={el.value}>{el.text}</option>
      ))}
    </select>
  );
};

export default memo(InputSelect);
