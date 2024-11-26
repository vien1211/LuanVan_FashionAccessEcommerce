import React from 'react'
import ChatBot from'../../assets/chatbot.png'
import ChatBot2 from'../../assets/chatbot2.png'

const BotAvatar = () => {
  return (
    <div className='w-[40px] h-[40px] grid rounded-full'>
       <img
        src={ChatBot2}
        alt="Bot Avatar"
        className="object-cover"
      />
    </div>
  )
}

export default BotAvatar