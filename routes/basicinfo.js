const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const authentiCate = require('../middleware');

router.get('/basic/:id', authentiCate, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id)
      .select('name photo post followers following') // only needed fields
      .populate({
        path: 'post',
        select: '-__v'
      })
      .populate({
        path: 'followers',
        select: 'name'
      })
      .populate({
        path: 'following',
        select: 'name'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = user.toObject();

    // Convert photo to base64 if it exists
    if (userObj.photo && userObj.photo.data) {
      userObj.photo = {
        contentType: userObj.photo.contentType,
        data: userObj.photo.data.toString('base64'),
      };
    }

    res.status(200).json({
      message: 'Basic user info fetched',
      user: {
        name: userObj.name,
        photo: userObj.photo || null,
        posts: userObj.post,
        followers: userObj.followers,
        following: userObj.following
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching basic user info' });
  }
});

module.exports = router;
