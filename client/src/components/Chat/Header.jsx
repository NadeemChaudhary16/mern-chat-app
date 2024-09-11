import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import NotificationMenu from "./NotificationMenu";

const Header = ({ setIsDrawerOpen }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/auth");
    toast({
      // title: "Logout Successfully!",
      description: "Logout Successfully!",
    });
  };
  return (
    <div className="flex justify-between items-center border-b-2 pb-1">
      <Button onClick={() => setIsDrawerOpen(true)}>Search User</Button>
      <div className="flex justify-center">
        <p>Chat App</p>
      </div>
      <div className="flex gap-4">
        <NotificationMenu></NotificationMenu>
        <Button onClick={logoutHandler}>Logout</Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
