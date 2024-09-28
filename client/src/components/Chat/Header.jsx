import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import NotificationMenu from "./NotificationMenu";
import { FiSearch } from "react-icons/fi";
import { ChatState } from "@/ContextApi/ChatContext";
const Header = ({ setIsDrawerOpen }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {user}=ChatState();
  const userName = user?.name || "U";  // Default to 'U' if name is not available
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/auth");
    toast({
      // title: "Logout Successfully!",
      description: "Logout Successfully!",
    });
  };
  return (
    <div className="flex justify-between items-center p-3 bg-[#004D40] relative ">
      <Button onClick={() => setIsDrawerOpen(true)} className="bg-blue-500 hover:bg-blue-600 rounded-xl flex justify-center items-center gap-1 px-2 sm:px-4"><FiSearch size={20} />Search User</Button>
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
        <p className="text-lg font-semibold text-white">ChatNow</p>
      </div>
      <div className="flex gap-4">
        <NotificationMenu />
        <Button onClick={logoutHandler} className="bg-red-500 hover:bg-red-600 rounded-xl px-2 sm:px-4">Logout</Button>
        <Avatar>
        <AvatarImage src={user?.image || "https://github.com/shadcn.png"} />

          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
