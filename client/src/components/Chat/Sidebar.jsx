import React from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { ChatState } from "@/ContextApi/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const Sidebar = ({
  searchResult,
  search,
  setSearch,
  setSearchResult,
  handleSearch,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const { toast } = useToast();

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId }, config);
      console.log("Chat data:", data);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setIsDrawerOpen(false); // Close drawer after chat is accessed
      setSearch(""); // Clear search input
      setSearchResult([]); // Clear search results
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
      });
    }
  };

  return (
    <div>
      <Drawer
        direction="left"
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      >
        {/* <DrawerTrigger asChild>
          <Button onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>
        </DrawerTrigger> */}
        <DrawerContent className="w-[300px] font-playpen">
          <DrawerHeader>
            <DrawerTitle>Search User by name or email</DrawerTitle>
            <DrawerDescription>
             
              <div className="flex gap-2 mt-4">
                <Input
                  type="text"
                  name="searchUser"
                  placeholder="Search User"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  
                />
                {/* <Button onClick={handleSearch}>Go</Button> */}
              </div>
            </DrawerDescription>
          </DrawerHeader>
          <div>
            {searchResult.length > 0 ? (
              searchResult.map((user) => (
                <div
                  key={user._id}
                  user={user}
                  className="flex gap-2 items-center p-2 border-b cursor-pointer"
                  onClick={() => accessChat(user._id)}
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        user.profilePicture || "https://github.com/shadcn.png"
                      }
                    />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </div>
              ))
            ) : (
              <div className="text-center">No users found.</div>
            )}
          </div>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Sidebar;
