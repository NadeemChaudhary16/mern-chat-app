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
router.put("/rename", isLoggedIn, renameGroup);
router.put("/groupAdd", isLoggedIn, addToGroup);
router.put("/groupRemove", isLoggedIn, removeFromGroup);

module.exports = router;
