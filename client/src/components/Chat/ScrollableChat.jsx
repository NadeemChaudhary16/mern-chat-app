import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatState } from "@/ContextApi/ChatContext";
import { useEffect, useRef } from "react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState(); // Get the current user from context

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="h-[65vh] overflow-y-auto p-2 pt-6">
      {messages &&
        messages.map((message, index) => (
          message.sender.name === user.name ? ( // If the message is from the current user
            <div
              className="flex flex-col items-end mb-4"
              key={message._id || index}
            >
              <p className="text-xs text-gray-500 mb-1">You</p> {/* Sender's name */}
              <div className="bg-green-400 text-white px-3 py-1 rounded-xl max-w-xs break-words">
                <p>{message.content}</p> 
              </div>
            </div>
          ) : ( // If the message is from another user
            <div
              className="flex flex-col items-start mb-4"
              key={message._id || index}
            >
              <p className="text-xs text-gray-500 mb-1">{message.sender.name}</p> {/* Sender's name */}
              <div className="bg-blue-300 text-black px-3 py-1 rounded-xl max-w-xs break-words">
                <p>{message.content}</p>
              </div>
            </div>
          )
        ))}
      <div ref={messagesEndRef}></div>
    </ScrollArea>
  );
};

export default ScrollableChat;
