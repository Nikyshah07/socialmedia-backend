const express = require('express');
const router = express.Router();
const { Post } = require('../models/Post');
const authentiCate = require('../middleware');
const multer = require('multer');
const { User } = require('../models/User');
const { cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/createpost', authentiCate, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.user.userId;

    let imageUrl = null;

    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'post_images',
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    const newPost = new Post({
      user: userId,
      caption,
      image: imageUrl, // cloudinary image url
    });

    const savedPost = await newPost.save();
    await User.findByIdAndUpdate(userId, { $push: { post: savedPost.id } });

    res.status(201).json({ message: 'Post created successfully', post: savedPost });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

module.exports = router;
