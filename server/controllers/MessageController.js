const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");

// Send Message Controller
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, recipientId } = req.body;
  // Validation check for content and chatId
  if (!content || !chatId || !recipientId) {
    return res.status(400).json({ message: "Invalid data passed into request" });
  }

  try {
    // Create a new message
    let message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,  // Assuming recipientId is passed in req.body
      content: content,
      chat: chatId,
    });

    // Populate the necessary fields (sender, chat, recipient)
    message = await message.populate("sender", "name image email");
    message = await message.populate("chat");
    message = await message.populate("recipient","name image email");

    message = await User.populate(message, {
      path: "chat.users",
      select: "name image email",
    });

    // Update the latest message in the chat
    await Chat.findByIdAndUpdate(
      chatId,
      { latestMessage: message },
      { new: true }  // Return the updated document
    );

    res.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ message: "Error creating message", error });
  }
});

// Get all Messages for a Chat
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name image email")
      .populate("recipient", "name image email") // Populating recipient's info
      .populate("chat");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

module.exports = { allMessages, sendMessage };
