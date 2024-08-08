const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authenticateToken = require("../middlewares/tokenauthentication");


router.get("/currentChats", authenticateToken, chatController.getChatters);

router.get("/search", authenticateToken, chatController.searchUser);

router.post("/createChat/:id", authenticateToken, chatController.createMessage);

router.get("/:id", authenticateToken, chatController.getMessages);

router.post("/send/:id", authenticateToken, chatController.sendMessages);





module.exports = router;
