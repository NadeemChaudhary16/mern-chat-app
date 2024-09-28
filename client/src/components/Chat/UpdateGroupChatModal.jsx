import React, { useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain, children }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const { toast } = useToast();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        description: "Only Admin Has Permission To Remove Users",
      });
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
      const { data } = await axios.patch(
        `/api/chat/groupRemove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        description: error.message,
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

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
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        `/api/chat/renameGroup`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toast({
        description: "Group name updated successfully",
      });
    } catch (error) {
      toast({
        description: error.message,
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        description: "User Already In Group",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        description: "Only Admin Can Add Users",
      });
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
      const { data } = await axios.patch(
        `/api/chat/groupAdd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({
        description: "User added successfully",
      });
    } catch (error) {
      toast({
        description: error.message,
      });
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>{children}</span>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[430px] rounded-lg">
        <DialogHeader>
          <DialogTitle>{selectedChat.chatName}</DialogTitle>
          <DialogDescription>
            Manage group members and settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Group Members */}
          <div className="flex flex-wrap gap-2">
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </div>

          {/* Rename Group */}
          <div className="grid md:grid-cols-4 items-center gap-3">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Button onClick={handleRename} disabled={renameloading}>
            {renameloading ? "Renaming..." : "Rename"}
          </Button>

          {/* Add Users */}
          <div className="grid md:grid-cols-4 items-center gap-3">
            <Label htmlFor="add-users">Add Users</Label>
            <Input
              id="add-users"
              placeholder="Search users"
              onChange={(e) => handleSearch(e.target.value)}
              className="col-span-3"
            />
          </div>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 3).map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}

          {/* Leave Group */}
          <Button variant="destructive" onClick={() => handleRemove(user)}>
            Leave Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGroupChatModal;
