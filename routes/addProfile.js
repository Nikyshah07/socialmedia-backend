
const express = require('express');
const router = express.Router();
const multer = require('multer');
const authentiCate = require('../middleware');
const { User } = require('../models/User');



// Use memory storage (so photo is kept in memory and then stored in MongoDB)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put('/addprofile', authentiCate, upload.single('photo'), async (req, res) => {
  const { name, bio, location, birthDate, website } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prepare photo if uploaded
    let photoData = {};
    if (req.file) {
      photoData = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        bio,
        photo: photoData, // photo is binary buffer + contentType
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
