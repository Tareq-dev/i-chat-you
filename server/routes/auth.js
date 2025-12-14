const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed });

  res.json({ message: "Registered" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json("User not found");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json("Wrong password");

  const token = jwt.sign({ id: user._id }, "SECRET");

  res.json({ token, username });
});

module.exports = router;
