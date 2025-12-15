const router = require("express").Router();
const User = require("../models/Users");

router.get("/search/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({
      username: {
        $regex: `^${username}$`,
        $options: "i", // 👈 case-insensitive
      },
    }).select("username online");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
