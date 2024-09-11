import { ChatState } from "@/ContextApi/ChatContext";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import bg from "@/assets/chatbg.png";
import { Resizable } from "re-resizable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const Chat = () => {
  const { user, setSelectedChat, chats, setChats } = ChatState()
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // useEffect(() => {
  //     console.log("User :", user);

  // }, []);

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
      });
      return;
    }

    try {
      // setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      // setLoading(false);
      setSearchResult(data);
      console.log("Search Query:", search);
      console.log("Search Results:", data);
      console.log(searchResult);
    } catch (error) {
      toast({
        // title: "Error occurred!",
        description: "Failed to load search results",
      });
    }
  };

  const style = {
    display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    border: "solid 1px #ddd",
    background: "white",
  };

  const accessChat = async (userId) => {
    try {
      // setLoadingChat(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      // setLoadingChat(false);
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center border-b-2 pb-1">
        <div className="flex gap-2">
          <Input
            type="text"
            name="searchUser"
            id=""
            placeholder="Search User"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch}>Go</Button>
        </div>
        <div>
          <p>Chat App</p>
        </div>
        <div className="flex gap-2 ">
          <Button className="">Logout</Button>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div
        className="relative flex  h-[88vh] bg-cover"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <Resizable
          defaultSize={{ width: 300 }}
          enable={{ right: true }}
          style={style}
        >
          <div className="">
            {searchResult.length > 0 ? (
              searchResult.map((user) => (
                <div
                  key={user._id}
                  user={user}
                  className="flex gap-2 items-center p-2 border-b cursor-pointer"
                  onClick={() => accessChat(user._id)}
                >
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p>{user.name}</p>
                </div>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </Resizable>
        <div className="w-[80vw] z-10">Right</div>
      </div>
    </div>
  );
};

export default Chat;
