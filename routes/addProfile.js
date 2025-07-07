const express = require('express');
const router = express.Router();
const multer = require('multer');
const authentiCate = require('../middleware');
const { User } = require('../models/User');
const { cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');

// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put('/addprofile', authentiCate, upload.single('photo'), async (req, res) => {
  const { name, bio, location, birthDate, website } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Upload image to Cloudinary if present
    let photoUrl = user.photo || '';
    if (req.file) {
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'profile_photos',
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

      const result = await streamUpload(req);
      photoUrl = result.secure_url;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        bio,
        photo: photoUrl, // Store URL now
        location,
        birthDate,
        website
      },
      { new: true }
    );

    res.status(200).json({ message: 'Profile added', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error during add profile' });
  }
});

module.exports = router;
