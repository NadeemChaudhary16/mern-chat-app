const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/MessageController");
const isLoggedIn = require("../middlewares/AuthMiddleware");


const router = express.Router();

router.route("/:chatId").get(isLoggedIn, allMessages);
router.route("/").post(isLoggedIn, sendMessage);

module.exports = router;