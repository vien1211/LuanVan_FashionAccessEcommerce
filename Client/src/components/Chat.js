


import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserChat from "./UserChat";
import { io } from "socket.io-client";
import iconChat from "../assets/iconchat.png";
import { TfiClose } from "react-icons/tfi";

// Kết nối tới socket server
const socket = io("http://localhost:3001");

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState(false); // Dấu chấm thông báo
  const [chatHistory, setChatHistory] = useState([]); // Lịch sử tin nhắn
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
    location.pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <div className="fixed right-6">
      <button
        onClick={toggleChatbot}
        className={`chatbot-toggle-btn fixed bottom-[120px] right-6 hover:scale-105 duration-200 rounded-full p-2 ${!isOpen ? 'animate-pulse-animation' : ''}`}
        style={{
        //   width: "60px",
        //   height: "60px",
          //backgroundColor: isOpen ? "#FF5722" : "#FFFFFF",
        //   display: "flex",
          alignItems: "center",
          justifyContent: "center",
          //position: "relative",
        }}
      >
        {isOpen ? (
          <TfiClose size={14} color="#FFFFFF" />
        ) : (
          <img src={iconChat} alt="Chat Icon" className="w-14 h-14 object-cover" />
        )}

        {/* Dấu chấm thông báo khi có tin nhắn mới */}
        {newMessage && !isOpen && (
          <span
            className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"
            style={{ transform: "translate(50%, -50%)" }}
          ></span>
        )}
      </button>

      {isOpen && (
        <div
          className="chatbot-container bg-[#FCFFFB] shadow-xl rounded-lg p-4"
          style={{
            width: "350px",
            height: "500px",
            position: "fixed",
            bottom: "170px",
            right: "20px",
            border: "1px solid #e0e0e0",
          }}
        >
          <UserChat chatHistory={chatHistory} socket={socket} />
        </div>
      )}
    </div>
  );
};

export default Chat;

