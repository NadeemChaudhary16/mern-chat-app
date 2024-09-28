const express = require("express");
const isLoggedIn = require("../middlewares/AuthMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/ChatController");
const router = express.Router();

router.post("/", isLoggedIn, accessChat);
router.get("/", isLoggedIn, fetchChats);
router.post("/group", isLoggedIn, createGroupChat);
router.patch("/renameGroup", isLoggedIn, renameGroup);
router.patch("/groupAdd", isLoggedIn, addToGroup);
router.patch("/groupRemove", isLoggedIn, removeFromGroup);

module.exports = router;
