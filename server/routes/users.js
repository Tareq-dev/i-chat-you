const router = require("express").Router();
const User = require("../models/User");

router.get("/search/:username", async (req, res) => {
  const user = await User.findOne({
    username: req.params.username,
  }).select("username online");

  if (!user) return res.status(404).json("User not found");

  res.json(user);
});

module.exports = router;
