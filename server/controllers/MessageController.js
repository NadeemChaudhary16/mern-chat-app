const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");

// Send Message Controller
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Invalid data passed into request" });
  }

  try {
    let message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    // Populating the message fields with relevant data
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // Use { new: true } to return the updated document
    await Chat.findByIdAndUpdate(
      chatId,
      { latestMessage: message },
      { new: true }  // This returns the updated chat document after modification
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
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error); // Debug message
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

module.exports = { allMessages, sendMessage };
