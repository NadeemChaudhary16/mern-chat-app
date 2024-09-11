import React from "react";
import SingleChat from  "@/components/Chat/SingleChat"
import { ChatState } from "@/ContextApi/ChatContext";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`flex flex-col items-center p-3 bg-white rounded-lg  w-full  ${selectedChat ? "flex" : "hidden md:flex"}`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    
    </div>
  );
};

export default Chatbox;
