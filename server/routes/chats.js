const router = require("express").Router();
const Message = require("../models/Message");

router.get("/:username", async (req, res) => {
  const { username } = req.params;

  const chats = await Message.find({
    $or: [{ sender: username }, { receiver: username }],
  });

  const users = [
    ...new Set(
      chats.map((m) =>
        m.sender === username ? m.receiver : m.sender
      )
    ),
  ];

  res.json(users);
});

module.exports = router;
