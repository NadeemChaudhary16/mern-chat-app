import React, { useEffect } from "react";
import { getSender } from "@/config/ChatLogics"; // Import your getSender function
import { ChatState } from "@/ContextApi/ChatContext";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

const NotificationMenu = () => {
  const { notification, setSelectedChat, setNotification, user } = ChatState();

   // Handle state updates to ensure the notification count is displayed correctly
   useEffect(() => {
    // You can log or check notifications here to see if they are being updated
    console.log("Current notifications:", notification);
  }, [notification]); // Re-run this effect when `notification` state changes
  return (

      <Menubar>
        <MenubarMenu className="relative">
        
          <MenubarTrigger>Notificatons</MenubarTrigger>
          <div className="absolute top-1  flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
            {notification.length}
          </div>
          <MenubarContent>
          {!notification.length ? (
            <MenubarItem className="text-center text-gray-500">No New Messages</MenubarItem>
          ) : (
            notification.map((notif) => (
              <MenubarItem
                key={notif._id}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenubarItem>
            ))
          )}
          
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
  
  );
};

export default NotificationMenu;
