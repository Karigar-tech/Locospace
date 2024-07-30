const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authenticateToken = require("../middlewares/tokenauthentication");

router.post("/send/:id", authenticateToken, chatController.sendMessages);

router.get("/:id", authenticateToken, chatController.getMessages);

router.get("/search", authenticateToken, chatController.searchUser);

router.get("/currentChats", authenticateToken, chatController.getChatters);

module.exports = router;
