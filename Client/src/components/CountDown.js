import React, {memo} from 'react'

const CountDown = ({unit, number}) => {
  return (
    <div className='w-[30%] h-[60px] rounded-md bg-white flex flex-col items-center justify-center'>
        <span className='text-[18px] text-main'>{number}</span>
        <span className='text-xs text-gray-600'>{unit}</span>
    </div>
  )
}

export default memo(CountDown)