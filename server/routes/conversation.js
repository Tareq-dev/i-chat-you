const express = require("express");
const Conversation = require("../models/Conversation");

const router = express.Router();

// 🔹 get single conversation
router.get("/:conversationId", async (req, res) => {
  const conversation = await Conversation.findById(
    req.params.conversationId
  ).populate("participants", "username");

  res.json(conversation);
});

// 🔹 get all conversations of a user
router.get("/user/:userId", async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.params.userId
  }).populate("participants", "username");

  res.json(conversations);
});

// 🔹 create or get conversation
router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] }
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId]
    });
  }

  res.json(conversation);
});

module.exports = router;
