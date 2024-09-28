import React, { useState, useEffect } from "react";
import Header from "@/components/Chat/Header";
import Sidebar from "@/components/Chat/Sidebar";
import Chatbox from "@/components/Chat/Chatbox";
import { useToast } from "@/components/ui/use-toast";
import { ChatState } from "@/ContextApi/ChatContext";
import MyChats from "@/components/Chat/MyChats";
import Footer from "@/components/Chat/Footer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import axios from "axios";

const Chat = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { selectedChat } = ChatState();
  const { toast } = useToast();
  const { user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]); // Clear results when the input is empty
      // toast({
      //   title: "Please enter something in search",
      // });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);

      setSearchResult(data);
      console.log("Search Query:",query);
      console.log("Search Results:", data);
    } catch (error) {
      toast({
        description: "Failed to load search results",
      });
    }
  };

  useEffect(() => {
    console.log("Updated searchResult:", searchResult);
  }, [searchResult]);

  return (
    <div className="font-playpen mb-0">
      <Header
        setIsDrawerOpen={setIsDrawerOpen}
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      <div className="">
        <Sidebar
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          searchResult={searchResult}
          setSearchResult={setSearchResult}
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />

        <ResizablePanelGroup
          direction="horizontal"
          className="h-full  rounded-lg rounded-t-none border"
        >
          <ResizablePanel
            defaultSize={20}
            className={`${selectedChat ? "hidden md:block" : "block"}`}
          >
            <div className="flex h-full items-center justify-center p-2  pt-0 ">
              <span className="font-semibold w-full h-full">
                <MyChats fetchAgain={fetchAgain} />
              </span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={80}
            className={`${selectedChat ? "block" : "hidden sm:block"}`}
          >
            <div className="flex  h-full w-full items-center justify-center">
              <div className="font-semibold font-playpen w-full h-full">
                <Chatbox
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
