import React, { useEffect } from "react";
import { ChatState } from "@/ContextApi/ChatContext";
import { IoNotificationsOutline } from "react-icons/io5";
import { Tooltip } from 'react-tooltip'
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
        <MenubarTrigger data-tooltip-id="my-tooltip2" data-tooltip-content="Notifications" className="cursor-pointer">
          <IoNotificationsOutline size={30}/>
          <Tooltip id="my-tooltip2" place="bottom" type="dark" effect="solid" style={{ borderRadius:"10px" }} />
        </MenubarTrigger>
        <div className="absolute top-1  flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
          {notification.length}
        </div>
        <MenubarContent>
          {!notification.length ? (
            <MenubarItem className="text-center text-gray-500">
              No New Messages
            </MenubarItem>
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
                  : `New Message from ${
                      notif.chat.users.find((u) => u._id !== user._id)?.name
                    }`}
              </MenubarItem>
            ))
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default NotificationMenu;
