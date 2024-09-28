import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ScrollableChat from "@/components/Chat/ScrollableChat";
import { getSender, getSenderFull } from "@/config/ChatLogics";
import ProfileModal from "@/components/Chat/ProfileModal";
import { ChatState } from "@/ContextApi/ChatContext";
import { io } from "socket.io-client";
import { useToast } from "../ui/use-toast";
import UpdateGroupChatModal from "@/components/Chat/UpdateGroupChatModal";
import { MdOutlineArrowBackIos } from "react-icons/md";
import Spinner from "@/components/Chat/Spinner";
import { FaUserGroup } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip } from "react-tooltip";
import { IoSend } from "react-icons/io5";
const ENDPOINT = "http://localhost:8080"; // Update to your backend server URL
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Failed to load messages",
        description: error.message,
      });
    }
  }, [selectedChat]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [fetchMessages, selectedChat, fetchAgain]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    socket.on("message received", (newMessageReceived) => {
      // console.log("New message received:", newMessageReceived);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.off("message received");
    };
  }, [user, selectedChat, notification, fetchAgain]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" || event.type === "click") {
      if (newMessage.trim()) {
        socket.emit("stop typing", selectedChat._id);

        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };

          const recipientId = selectedChat.users.find(
            (u) => u._id !== user._id
          )?._id;
          setNewMessage("");
          const { data } = await axios.post(
            "/api/message",
            { content: newMessage, chatId: selectedChat._id, recipientId },
            config
          );

          socket.emit("new message", data);
          setMessages((prevMessages) => [...prevMessages, data]);
        } catch (error) {
          toast({
            title: "Failed to send the message",
            description: error.message,
          });
        }
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      if (timeNow - lastTypingTime >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className="">
      {selectedChat ? (
        <div>
          <div className="text-2xl bg-blue-400 flex justify-between items-center w-full">
            <button
              className="flex md:hidden p-2"
              onClick={() => setSelectedChat("")}
            >
              <MdOutlineArrowBackIos />
            </button>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <div className="flex items-center gap-2 px-2 py-3 ">
                  <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={getSenderFull(user, selectedChat.users).image || "https://github.com/shadcn.png"}
                      />
                      <AvatarFallback>{getSender(user, selectedChat.users).charAt(0)}</AvatarFallback>
                    </Avatar>
                  </ProfileModal>
                  <span>{getSender(user, selectedChat.users)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-2 py-3 ">
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  >
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full"
                      data-tooltip-id="my-tooltip3"
                      data-tooltip-content="Group Detail"
                    >
                      <FaUserGroup size={30} />
                    </button>

                    <Tooltip
                      id="my-tooltip3"
                      place="bottom"
                      type="dark"
                      effect="solid"
                      style={{
                        borderRadius: "10px",
                        zIndex: "10",
                        fontSize: "0.5em", // Adjust font size
                        padding: "3px 12px", // Adjust padding
                      }}
                    />
                  </UpdateGroupChatModal>
                  <span>{selectedChat.chatName.toUpperCase()}</span>
                </div>
              ))}
          </div>
          <div className="flex flex-col justify-end p-3 mb-3 bg-gray-200 rounded-lg rounded-t-none overflow-y-hidden h-[71vh]">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            ) : (
              <div className="">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <div className="mt-3 relative">
              {isTyping && (
                <div className="-top-6 absolute left-1/2 -translate-x-1/2 text-xs">
                  <p>{getSender(user, selectedChat.users)} is typing...</p>
                </div>
              )}
              <div className="flex items-center">
                <input
                  className="w-full p-2 pr-10 bg-gray-300 rounded-md"
                  placeholder="Enter a message..."
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={sendMessage}
                />
                <button
                  className="absolute right-3 text-blue-600 hover:text-blue-700"
                  onClick={sendMessage}
                >
                  <IoSend size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="custom-height flex flex-col pb-2 items-center justify-center bg-gradient-to-b from-blue-100 to-white">
          <p className="text-3xl ">Click on a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default SingleChat;
