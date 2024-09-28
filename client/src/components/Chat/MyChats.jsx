import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "@/ContextApi/ChatContext";
import { useToast } from "@/components/ui/use-toast";
import GroupChatModal from "@/components/Chat/GroupChatModal";
import Spinner from "@/components/Chat/Spinner";
import { FaUserPlus } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false); // New loading state

  const fetchChats = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log("Fetched chats:", data); // Debugging: log the chats
      setChats(data);
      setLoading(false); // Stop loading after chats are fetched
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
      });
      setLoading(false); // Stop loading even if an error occurs
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log("Logged in user:", userInfo);
    setLoggedUser(userInfo);
    fetchChats();
  }, [user, fetchAgain]);

  return (
    <div
      className={`h-[80vh] flex flex-col items-center p-3 bg-green-300 rounded-lg  ${
        selectedChat ? "hidden sm:flex" : "flex"
      }`}
    >
      <div className="flex justify-around gap-1 w-full items-center pb-3 ">
        <h3>Chats</h3>
        <GroupChatModal>
          <button
            className="flex items-center px-2 py-1 border rounded-lg bg-blue-400 hover:bg-blue-500"
            data-tooltip-id="my-tooltip1"
            data-tooltip-content="Create a Group"
          >
            <FaUserPlus size={25} />
          </button>

          <Tooltip
            id="my-tooltip1"
            place="bottom"
            type="dark"
            effect="solid"
            style={{
              borderRadius: "10px",
              zIndex: "10",
              fontSize: "0.8em", // Adjust font size
            }}
          />
        </GroupChatModal>
      </div>
      <div className="flex flex-col p-3 bg-gray-200 w-full h-full rounded-lg overflow-y-hidden">
        {loading ? (
          <Spinner /> // Render spinner when loading
        ) : chats.length > 0 ? ( // Check if chats are present after loading
          <div className="overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer p-2 mb-2 rounded-lg ${
                  selectedChat === chat
                    ? "bg-teal-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                <p>
                  {!chat.isGroupChat
                    ? chat.users.find((u) => u._id !== user._id)?.name
                    : chat.chatName}
                </p>
                {chat.latestMessage && (
                  <b className="text-xs">
                    {chat.latestMessage.content.length > 25
                      ? chat.latestMessage.content.substring(0, 26) + "..."
                      : chat.latestMessage.content}
                  </b>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No chats available</p> // Show message if there are no chats
        )}
      </div>
    </div>
  );
};

export default MyChats;
