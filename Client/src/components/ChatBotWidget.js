// import React, { useState } from "react";
// import Chatbot from "react-chatbot-kit";
// import "react-chatbot-kit/build/main.css";

// import config from "../Chatbot/config";
// import MessageParser from "../Chatbot/MessageParser";
// import ActionProvider from "../Chatbot/ActionProvider";

// import iconChat from'../assets/robot-icon.png';
// import { TfiClose } from "react-icons/tfi";
// import { useLocation } from "react-router-dom";

// const ChatBotWidget = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const toggleChatbot = () => {
//     setIsOpen(!isOpen);
//   };

//   if (location.pathname === "/login" || location.pathname === "/my-cart" || location.pathname.startsWith("/admin")) {
//     return null;
//   }
  
//   return (
//     <div className="">
//       <button
//         onClick={toggleChatbot}
//         // className="chatbot-toggle-btn fixed bottom-5 right-5 hover:scale-105 duration-200 rounded-full p-3"
//         className={`chatbot-toggle-btn2 fixed bottom-6 right-6 hover:scale-105 duration-200 rounded-full p-3 
//             ${!isOpen ? 'animate-pulse-animation' : ''}`}
//       >
//         {isOpen ? (
//           <TfiClose color="white" />
//         ) : (
//           <img
//             src={iconChat}
//             alt=" Chat"
//             className="w-14 h-14 object-cover"
//           />
//         )}
//       </button>
//       {isOpen && (
//         <div className="chatbot-container fixed bottom-16 right-4 z-50">
//           <Chatbot
//             headerText="VieVie Assist"
//             config={config}
//             messageParser={MessageParser}
//             actionProvider={ActionProvider}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBotWidget;


// import React, { useState } from "react";
// import Chatbot from "react-chatbot-kit";
// import "react-chatbot-kit/build/main.css";

// import config from "../Chatbot/config";
// import MessageParser from "../Chatbot/MessageParser";
// import ActionProvider from "../Chatbot/ActionProvider";

// import iconChat from "../assets/robot-icon.png";
// import { TfiClose } from "react-icons/tfi";
// import { useLocation } from "react-router-dom";

// const ChatBotWidget = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const toggleChatbot = () => {
//     setIsOpen(!isOpen);
//   };

//   if (
//     location.pathname === "/login" ||
//     location.pathname === "/my-cart" ||
//     location.pathname.startsWith("/admin")
//   ) {
//     return null;
//   }

//   return (
//     <div className="fixed bottom-4 right-6 z-50">
//       <div className="relative">
//         <div className="w-fit absolute -left-12 bottom-6 transform -translate-x-24 transition-opacity opacity-0 hover:opacity-100 bg-blue-500 text-white text-sm px-6 py-1 rounded-full whitespace-nowrap">
//         VieVie Assist
//         </div>
//         <button
//           onClick={toggleChatbot}
//           className={`chatbot-toggle-btn2 hover:scale-105 duration-200 rounded-full p-3 
//             ${!isOpen ? "animate-pulse-animation" : ""}`}
//         >
//           {isOpen ? (
//             <TfiClose color="white" size={20} />
//           ) : (
//             <img
//               src={iconChat}
//               alt="Chat"
//               className="w-14 h-14 object-cover"
//             />
//           )}
//         </button>
        
//       </div>
//       {isOpen && (
//         <div className="chatbot-container fixed bottom-16 right-4 z-50">
//           <Chatbot
//             headerText="VieVie Assist"
//             config={config}
//             messageParser={MessageParser}
//             actionProvider={ActionProvider}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBotWidget;


import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import iconChat from "../assets/iconchat.png";
import iconBot from "../assets/robot-icon.png";
import { TfiClose } from "react-icons/tfi";
import config from "../Chatbot/config";
import MessageParser from "../Chatbot/MessageParser";
import ActionProvider from "../Chatbot/ActionProvider";
import UserChat from "./UserChat";

// Kết nối tới socket server
const socket = io("http://localhost:3001");

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState(false); // Dấu chấm thông báo
  const [chatHistory, setChatHistory] = useState([]); // Lịch sử tin nhắn
  const [isBotChat, setIsBotChat] = useState(true); // Điều khiển xem là chatbot hay chat admin
  const location = useLocation();

  // Lắng nghe tin nhắn mới từ server
  useEffect(() => {
    const handleNewMessage = (data) => {
      setChatHistory((prev) => [...prev, data]);
      setNewMessage(true); // Hiển thị dấu chấm nếu chatbot đang đóng
    };

    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, []);

  // Mở/đóng khung chat
  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setNewMessage(false); // Tắt dấu chấm khi mở khung chat
    }
  };

  // Ẩn chatbot trên các trang cụ thể
  if (
    location.pathname === "/login" ||
    location.pathname === "/my-cart" ||
    location.pathname === "/checkout" 
    //location.pathname.startsWith("/admin")
  ) {
    return null;
  }

  // Chuyển giữa Chatbot và Chat với Admin
  const switchToChatbot = () => {
    setIsBotChat(true);
  };

  const switchToUserChat = () => {
    setIsBotChat(false);
  };

  return (
    <div className="fixed bottom-7 right-7 z-20">
      <div className="relative">
        <button
          onClick={toggleChatbot}
          className={`chatbot-toggle-btn hover:scale-105 duration-200 rounded-full p-3 
            ${!isOpen ? "animate-pulse-animation" : ""}`}
        >
          {isOpen ? (
            <TfiClose color="white" size={20} />
          ) : (
            <img src={iconChat} alt="Chat" className="w-14 h-14 object-cover" />
          )}

          {/* Dấu chấm thông báo khi có tin nhắn mới */}
          {newMessage && !isOpen && (
            <span
              className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"
              style={{ transform: "translate(50%, -50%)" }}
            ></span>
          )}
        </button>
      </div>

      {/* Hiển thị Chatbot hoặc Chat với Admin */}
      {isOpen && (
        <div
          className="chatbot-container bg-[#FCFFFB] shadow-xl rounded-lg p-4"
          style={{
            width: "350px",
            height: isBotChat ? "580px" : "550px",
            position: "fixed",
            bottom: "80px",
            right: "20px",
            //border: "1px solid #e0e0e0",
          }}
        >
          {isBotChat ? (
            <Chatbot
              headerText="VieVie Assist"
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          ) : (
            <UserChat chatHistory={chatHistory} socket={socket} />
          )}

          {/* Các nút chuyển đổi */}
          <div className="mt-2 flex space-x-2 justify-center">
            <button
              className="flex items-center gap-1 px-2 py-2 bg-[#2A8384] text-white rounded-lg"
              onClick={switchToChatbot}
            >
              <img src={iconBot} className="w-7 h-7"/>
              <span className="text-[15px]">VieVie Assist</span>
            </button>
            <button
              className="flex items-center px-2 py-2 bg-yellow-500 text-white rounded-lg"
              onClick={switchToUserChat}
            >
              <img src={iconChat} className="w-7 h-7"/>
              <span className="text-[15px]">Chat with Admin</span>
              
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotWidget;
