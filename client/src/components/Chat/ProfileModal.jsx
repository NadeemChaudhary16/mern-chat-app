import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ProfileModal = ({ children, user }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>{children}</span>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[430px] rounded-lg font-playpen">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Details of the user</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={user.image || "https://github.com/shadcn.png"} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
        {/* <DialogFooter>
          <Button onClick={handleChange}>Change DP</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
