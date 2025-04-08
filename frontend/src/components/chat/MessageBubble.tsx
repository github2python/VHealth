import React from "react";

interface MessageBubbleProps {
  message: string;
  sender: "doctor" | "patient";
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sender }) => {
  const isDoctor = sender === "doctor";

  return (
    <div
      className={`flex ${
        isDoctor ? "justify-end" : "justify-start"
      } my-2 px-4`}
    >
      <div
        className={`${
          isDoctor ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        } rounded-lg p-3 max-w-xs`}
      >
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;
