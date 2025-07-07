const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const authentiCate = require('../middleware');

router.get('/hasNewLikeNotification/:id', authentiCate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ hasNewLike: false });

    const hasNewLike = user.newLikeNotifications.length > 0;

    res.status(200).json({ hasNewLike });
  } catch (err) {
    res.status(500).json({ hasNewLike: false });
  }
});

module.exports=router
