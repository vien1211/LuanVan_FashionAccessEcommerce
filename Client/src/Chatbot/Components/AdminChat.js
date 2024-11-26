import React, { useState } from 'react';

const AdminChat = ({ socket }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (socket) {
      socket.emit('sendMessageToUser', message);  // Gửi tin nhắn cho người dùng
      setMessage(""); // Xóa tin nhắn đã gửi
    }
  };

  return (
    <div>
      <h3>Admin Chat</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default AdminChat;
