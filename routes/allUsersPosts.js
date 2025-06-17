const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const authentiCate = require('../middleware');

router.get('/getalluserspost', authentiCate, async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get posts with populated user data
    const posts = await Post.find({ user: { $in: user.following } })
      .populate('user', 'name photo') // Populate user info
      .sort({ createdAt: -1 });

    // Map posts with correct user and post data
    const updatedPosts = posts.map((post) => {
      // Handle USER profile photo
      let userProfilePhoto = null;
      if (post.user.photo && post.user.photo.data) {
        userProfilePhoto = `data:${post.user.photo.contentType};base64,${post.user.photo.data.toString('base64')}`;
      }

      // Handle POST image (your model uses 'image' field)
      let postImage = null;
      if (post.image && post.image.data) {
        postImage = `data:${post.image.contentType};base64,${post.image.data.toString('base64')}`;
      }

      // Debug: Log to check if image exists
      console.log(`Post ${post._id}:`, {
        hasImage: !!post.image,
        hasImageData: !!(post.image && post.image.data),
        caption: post.caption
      });

      return {
        _id: post._id,
        location: post.location,
        caption: post.caption,
        likes: post.likes || [],
        comments: post.comments || [],
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: {
          _id: post.user._id,
          name: post.user.name,
        },
        userPhoto: userProfilePhoto,    // User's profile picture
        postPhoto: postImage,           // The actual post image/content
        likesCount: post.likes?.length || 0,
        commentsCount: post.comments?.length || 0,
      };
    });

   
    return res.status(200).json({ posts: updatedPosts });
    
  } catch (err) {
    console.log('Error in getalluserspost:', err);
    return res.status(500).json({ message: 'Error during fetching all users posts' });
  }
});

module.exports = router;
