// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import { useSelector } from "react-redux";

// const socket = io("http://localhost:3001");

// const UserChat = ({ chatHistory, socket }) => {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const chatBoxRef = useRef(null);

//   // Lấy vai trò từ Redux (user/admin)
//   const userType = useSelector((state) => state.user.role);

//   useEffect(() => {
//     // Đăng ký vai trò với server
//     socket.emit("register", userType);

//     // Lắng nghe tin nhắn từ server
//     socket.on("receive_message", (data) => {
//       // Chỉ thêm tin nhắn từ người khác vào
//       if (data.userType !== userType) {
//         setChat((prev) => [...prev, data]);
//       }
//     });

//     return () => {
//       socket.off("receive_message");
//     };
//   }, [userType]);

//   // Cuộn tự động khi có tin nhắn mới
//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   }, [chat]);

//   // Gửi tin nhắn
//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const data = {
//       userType, // Gửi vai trò của người dùng
//       message,
//       time: new Date().toLocaleTimeString(),
//     };

//     socket.emit("send_message", data); // Gửi tin nhắn đến server
//     setChat((prev) => [...prev, data]); // Hiển thị tin nhắn của mình ngay lập tức
//     setMessage("");
//   };

//   return (
//     <div className="flex flex-col w-full">
//       <h3 className="flex flex-col text-2xl font-semibold text-center mb-2 text-gray-700">
//         {userType === "99" ? "Admin Chat" : "User Chat"}
//       </h3>
//       <div
//         className="flex flex-col h-[380px] overflow-y-auto border border-gray-300 rounded-lg p-3"
//         ref={chatBoxRef}
//       >
//         {chat.length === 0 ? (
//           <p className="text-center text-gray-500">No messages yet...</p>
//         ) : (
//           chat.map((c, idx) => (
//             <div
//               key={idx}
//               className={`flex flex-col mb-2 ${
//                 c.userType === userType ? "items-end" : "items-start"
//               }`}
//             >
//               <div
//                 className={`p-2 rounded-lg max-w-xs break-words ${
//                   c.userType === userType
//                     ? "bg-green-200 text-gray-800"
//                     : "bg-blue-200 text-gray-800"
//                 }`}
//               >
//                 {c.message}
//               </div>
//               <small className="text-sm text-gray-500 mt-1">{c.time}</small>
//             </div>
//           ))
//         )}
//       </div>
//       <div className="flex items-center gap-2 mt-3">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
//         />
//         <button
//           onClick={sendMessage}
//           className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserChat;

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { IoIosSend } from "react-icons/io";

const UserChat = ({ chatHistory, socket }) => {
  const [message, setMessage] = useState("");
  const userType = useSelector((state) => state.user.role);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // Cuộn xuống cuối khi có tin nhắn mới
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const currentUser = useSelector((state) => state.user.current);
  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      userType: currentUser.role,
      message: message,
      time: new Date().toLocaleTimeString(),
      avatar: currentUser.avatar,
    };

    socket?.emit("send_message", data); // Gửi dữ liệu tới server qua socket
    setMessage(""); // Xóa nội dung sau khi gửi
  };

  return (
    <div className="flex flex-col w-full">
      <h3 className="text-2xl font-semibold text-center mb-2 text-gray-700">
        {userType === "99" ? "Assist Customer" : "Chat With Admin Page"}
      </h3>
      <div
        className="flex flex-col h-[380px] overflow-y-auto border border-main border-opacity-40 rounded-lg p-3"
        ref={chatBoxRef}
      >
        <div className="text-center text-main text-[13px] mb-2">
          {userType === "22"
            ? "Do you have a question or need assistance? Our team is ready to help you instantly! Don’t hesitate to reach out."
            : "Dedicated Support Team"}
        </div>
        {chatHistory?.map((c, idx) => (
          <div
            key={idx}
            className={`flex flex-col mb-2 ${
              c.userType === userType ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                c.userType === userType ? "flex-row-reverse" : ""
              }`}
            >
              <img
                src={c.avatar || "/default-avatar.png"}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <div
                className={`p-2 text-[14px] rounded-lg max-w-xs break-words ${
                  c.userType === userType
                    ? "bg-[#d7e7d3] text-gray-800 ml-8"
                    : "bg-[#e7e4d3] text-gray-800 mr-8"
                }`}
              >
                {c.message}
              </div>
            </div>
            <small className="flex text-xs text-gray-500 mt-1">{c.time}</small>
          </div>
        ))}
        <div className=" flex text-center text-[13px] text-gray-300">
          {userType === "22"
            ? "We do not store your conversation. Rest assured, your privacy is our priority!"
            : ""}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        {/* <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
        /> */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Write your message here..."
          className="flex-1 text-[14px] p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700"
        />

        <button
          onClick={sendMessage}
          className="px-6 py-2.5 bg-main text-white rounded-lg hover:bg-[#3C5644] transition duration-200"
        >
          <IoIosSend size={22} />
        </button>
      </div>
    </div>
  );
};

export default UserChat;
