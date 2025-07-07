
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const multer = require('multer');
const authentiCate = require('../middleware');
const { cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');

// Multer setup (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put('/editprofile/:id', authentiCate, upload.single('photo'), async (req, res) => {
  const { name, bio, location, website, birthDate } = req.body;
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let photoUrl = user.photo; // keep existing photo URL

    if (req.file) {
      const streamUpload = () => {
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

      const result = await streamUpload();
      photoUrl = result.secure_url;
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.location = location || user.location;
    user.website = website || user.website;
    user.birthDate = birthDate || user.birthDate;
    user.photo = photoUrl;

    const updatedUser = await user.save();

    return res.status(200).json({ updatedUser, message: 'Profile updated successfully' });
  } catch (err) {
    return res.status(401).json({ message: 'Error updating profile', error: err.message });
  }
});

module.exports = router;
