import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "@/ContextApi/ChatContext";
import { useToast } from "@/components/ui/use-toast";
import { getSender } from "@/config/ChatLogics";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const { toast } = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className={`h-[80vh] flex flex-col items-center p-3 bg-white rounded-lg border ${selectedChat ? "hidden md:flex" : "flex"}`}>
      <div className="flex justify-between gap-4 items-center  pb-3 px-3  font-sans">
        Chats
        <button className="flex items-center  px-2 py-1 border rounded">
          New Group Chat
        </button>
      </div>
      <div className="flex flex-col p-3 bg-gray-200 w-full h-full rounded-lg overflow-y-hidden">
        {chats ? (
          <div className="overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer p-2 mb-2 rounded-lg ${selectedChat === chat ? "bg-teal-600 text-white" : "bg-gray-300 text-black"}`}
              >
                <p>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </p>
                {chat.latestMessage && (
                  <p className="text-xs">
                    <b>{chat.latestMessage.sender.name}: </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default MyChats;
