import { ScrollArea } from "@/components/ui/scroll-area"

import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "@/config/ChatLogics"
import { ChatState } from "@/ContextApi/ChatContext"

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollArea className="h-[60vh]">
      {messages &&
        messages.map((m, i) => (
          <div className="flex" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div className="">
                <img
                  className="w-8 h-8 rounded-full mt-2 mr-1 cursor-pointer"
                  src={m.sender.pic}
                  alt={m.sender.name}
                />
              </div>
            )}
            <span 
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollArea>
  );
};

export default ScrollableChat;
