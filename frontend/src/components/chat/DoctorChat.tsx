import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import MessageBubble from "./MessageBubble";

// Set up the socket connection (adjust the URL as necessary)
const socket = io("http://localhost:5000");

const DoctorChat: React.FC = () => {
  const [messages, setMessages] = useState<{ message: string; sender: string }[]>([]);
  const [input, setInput] = useState("");

  // Listen for new messages from the socket
  useEffect(() => {
    socket.on("receive_message", (msg: { message: string; sender: string }) => {
      console.log(msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Notify backend about the doctor joining
    socket.emit("join_room", { role: "doctor" });

    // Cleanup socket listener on component unmount
    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Send message to the socket server
  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = { message: input, sender: "doctor" };
      // setMessages([...messages, newMessage]);

      // Emit the message to the backend (socket server)
      socket.emit("send_message", newMessage);

      setInput(""); // Clear the input after sending the message
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-500 text-white py-4 px-6 text-lg font-bold">
        Chat with Patient
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg.message}
            sender={msg.sender as "doctor" | "patient"}
          />
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white p-4 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-green-300"
        />
        <button
          onClick={sendMessage}
          className="ml-3 bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DoctorChat;
