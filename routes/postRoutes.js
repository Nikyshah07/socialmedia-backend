

const express = require('express');
const router = express.Router();
const { Post } = require('../models/Post');
const authentiCate = require('../middleware');
const multer = require('multer');
const { User } = require('../models/User');




// Multer setup to handle file uploads (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/createpost', authentiCate, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;
    const userId=req.user.userId;
    const newPost = new Post({
      user: req.user.userId,
      caption,
      
    });

    // If image is uploaded
    if (req.file) {
      newPost.image.data = req.file.buffer;
      newPost.image.contentType = req.file.mimetype;
    }

    const savedPost = await newPost.save();
    await User.findByIdAndUpdate(userId,{$push:{post:savedPost.id}})
    res.status(201).json({ message: 'Post created successfully', post: savedPost });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

module.exports = router;
