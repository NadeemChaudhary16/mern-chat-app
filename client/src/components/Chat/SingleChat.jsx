import { useEffect, useState } from "react";
import axios from "axios";
import ScrollableChat from "@/components/Chat/ScrollableChat";
import { getSender, getSenderFull } from "@/config/ChatLogics";
import ProfileModal from "@/components/Chat/ProfileModal";
import { ChatState } from "@/ContextApi/ChatContext";
import { io } from "socket.io-client";
import { useToast } from "../ui/use-toast";
import Lottie from "react-lottie";
import animationData from "@/animations/typing";
import UpdateGroupChatModal from "@/components/Chat/UpdateGroupChatModal";

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

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Fetch messages from the backend
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Failed to load messages",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, fetchAgain]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
        console.log(newMessageReceived)
      }
    });

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.off("message received");
    };
  }, [user, selectedChat, notification, fetchAgain]);

  // Send message to the backend
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
        setNewMessage("");
      } catch (error) {
        toast({
          title: "Failed to send the message",
          description: error.message,
        });
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
    <div>
      {selectedChat ? (
        <div>
          <div className="text-2xl pb-3 px-2 flex justify-between items-center w-full">
            <button className="flex md:hidden p-2" onClick={() => setSelectedChat("")}>
              &#8592;
            </button>
            {messages && (
              !selectedChat.isGroupChat ? (
                <div>
                  <span>{getSender(user, selectedChat.users)}</span>
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </div>
              ) : (
                <div>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </div>
              )
            )}
          </div>
          <div className="flex flex-col justify-end p-3 bg-gray-200 w-full h-full rounded-lg overflow-y-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="loader"></div>
              </div>
            ) : (
              <div className="">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <div className="mt-3">
              {isTyping && (
                <div className="mb-3">
                  <Lottie options={defaultOptions} width={70} />
                </div>
              )}
              <input
                className="w-full p-2 bg-gray-300 rounded-md"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-3xl font-sans">Click on a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default SingleChat;
