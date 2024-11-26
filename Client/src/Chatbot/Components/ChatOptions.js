import React, { useState } from "react";
import UserChat from "../../components/UserChat";

// const ChatOptions = () => {
//   return (
//     <div className="flex flex-col space-y-2">
//       <button
//         className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        
//       >
//         Chat with Admin
//       </button>
//     </div>
//   );
// };

// export default ChatOptions;


const ChatOptions = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen((prev) => !prev); // Đảo trạng thái mở/đóng chat
  };

  return (
    <div className="flex flex-col">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={handleToggleChat}
      >
        Chat with Admin
      </button>

      {/* Hiển thị UserChat nếu isChatOpen là true */}
      {isChatOpen && (
        <div
          className="chat-window fixed right-6 bottom-16 bg-white shadow-lg rounded-lg"
          style={{
            width: "350px",
            height: "500px",
            border: "1px solid #e0e0e0",
            zIndex: 1000,
          }}
        >
          <UserChat />
        </div>
      )}
    </div>
  );
};

export default ChatOptions;

