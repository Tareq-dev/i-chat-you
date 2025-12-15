const express = require("express");
const Conversation = require("../models/Conversation");

const router = express.Router();
// 🔹 get single conversation by id
router.get("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate("participants", "username");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
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
// 🔹 get single conversation
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.find({
      participants: userId
    })
      .populate("participants", "username")
      .sort({ updatedAt: -1 }); // 🔥 latest chat first

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// // 🔹 get all conversations of a user
// router.get("/user/:userId", async (req, res) => {
//   const conversations = await Conversation.find({
//     participants: req.params.userId
//   }).populate("participants", "username");

//   res.json(conversations);
// });



module.exports = router;
