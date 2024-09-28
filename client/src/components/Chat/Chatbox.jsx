import React from "react";
import SingleChat from "@/components/Chat/SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  return (
    <div className="">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default Chatbox;
