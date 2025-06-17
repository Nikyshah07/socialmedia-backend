// routes/user.js or wherever appropriate
const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const authentiCate = require("../middleware");




router.post("/save-fcm-token", authentiCate, async (req, res) => {
  const userId = req.user.userId;
  const { token } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { fcmToken: token });
    res.status(200).json({ message: "FCM token saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save FCM token" });
  }
});

module.exports = router;
