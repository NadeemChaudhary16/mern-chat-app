import React, { useState, useEffect } from "react";
import Header from "@/components/Chat/Header";
import Sidebar from "@/components/Chat/Sidebar";
import Chatbox from "@/components/Chat/Chatbox";
import { useToast } from "@/components/ui/use-toast";
import { ChatState } from "@/ContextApi/ChatContext";
import MyChats from "@/components/Chat/MyChats";

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
  const { toast } = useToast();
  const { user } = ChatState();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setSearchResult(data);
      console.log("Search Query:", search);
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
    <div>
      <Header
        setIsDrawerOpen={setIsDrawerOpen} 
        search={search} 
        setSearch={setSearch} 
        handleSearch={handleSearch} 
      />
      <div className="">
        <Sidebar isDrawerOpen={isDrawerOpen} 
        setIsDrawerOpen={setIsDrawerOpen} 
        searchResult={searchResult} 
        search={search} 
        setSearch={setSearch} 
        handleSearch={handleSearch}  />
       

        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full rounded-lg border"
        >
          <ResizablePanel defaultSize={20}>
            <div className="flex h-full w-full items-center justify-center p-6">
              <span className="font-semibold w-full h-full">
                <MyChats fetchAgain={fetchAgain} />
              </span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <div className="flex h-full w-full items-center justify-center p-6">
              <span className="font-semibold w-full h-full">
                <Chatbox
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Chat;
