import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.emit("joinRoom", roomId);

    newSocket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit("sendMessage", { roomId, message });
      setMessages((prev) => [...prev, { sender: "user", message }]);
    }
  };

  return { messages, sendMessage };
};

export default useChat;
