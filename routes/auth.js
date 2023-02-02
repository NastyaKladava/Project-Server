const { Router, response } = require("express");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      return res
        .status(400)
        .json({ message: "User with such an email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: "User were successfully created!" });
  } catch (e) {
    response.status(500).json({ message: "Something went wrong, try again!" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User is not found!" });

    const IsMatch = await bcrypt.compare(password, user.password);

    if (!IsMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect password, try again!" });
    }

    const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
      expiresIn: "1h",
    });

    res.json({ token, userId: user.id });
  } catch (e) {
    response.status(500).json({ message: "Something went wrong, try again!" });
  }
});

module.exports = router;
