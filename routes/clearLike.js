const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const authentiCate = require('../middleware');


router.post('/clearNewLikes', authentiCate, async (req, res) => {
  try {
    const userId = req.user.userId;
    await User.findByIdAndUpdate(userId, { $set: { newLikeNotifications: [] } });
    res.status(200).json({ message: 'Notifications cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear notifications' });
  }
});

module.exports=router