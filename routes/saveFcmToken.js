// PUT /api/user/save-fcm-token

const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const authentiCate = require('../middleware');
router.put('/save-fcm-token', authentiCate, async (req, res) => {
  const { token } = req.body;
  const userId = req.user.userId;

  try {
    await User.findByIdAndUpdate(userId, { fcmToken: token });
    res.status(200).json({ message: "FCM token saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving FCM token" });
  }
});
module.exports=router