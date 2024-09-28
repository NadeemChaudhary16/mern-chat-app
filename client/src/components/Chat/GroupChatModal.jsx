import React, { useState, useContext } from "react";
import axios from "axios";
import UserBadgeItem from "@/components/Chat/UserBadgeItem";
import UserListItem from "@/components/Chat/UserListItem";
import { useToast } from "../ui/use-toast";
import { ChatState } from "@/ContextApi/ChatContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { chats, setChats, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        description: error.message,
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        description: "User already added",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        description: "Please Fill Up All The Fields",
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
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      toast({
        description: "Successfully Created New Group",
      });
    } catch (error) {
      toast({
        description: "Failed To Create Group.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>{children}</span>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[430px] rounded-lg font-playpen">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
          <DialogDescription>
            Enter a group chat name and select users to create a group.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid  md:grid-cols-4 items-center gap-3 md:gap-1">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid  md:grid-cols-4 items-center gap-3 md:gap-1">
            <Label htmlFor="add-users">Add Users</Label>
            <Input
              id="add-users"
              placeholder="Search users"
              onChange={(e) => handleSearch(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
                admin={user}
              />
            ))}
          </div>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 3)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full md:w-auto">
            Create Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupChatModal;
