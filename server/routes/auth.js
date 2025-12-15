const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

// Register
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const exist = await User.findOne({ username });
    if (exist) {
        return res.status(400).json({ message: "User already exists" });
    }

    // 🔥 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password: hashedPassword
    });

    res.json({ message: "User registered" });
});

// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json("User not found");

    const ok = await bcrypt.compare(password, user.password);
    
    if (!ok) return res.status(401).json("Wrong password");

    const token = jwt.sign(
        { userId: user._id },
        "SECRET_KEY",
        { expiresIn: "7d" }
    );

    // 🔥 IMPORTANT RESPONSE
    res.json({
        token,
        userId: user._id,
        username: user.username
    });
});

module.exports = router;
