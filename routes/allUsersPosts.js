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


      let userProfilePhoto = post.user.photo || null;
let postImage = post.image || null;


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
        saved_by: post.saved_by || [],
      };
    });

   
    return res.status(200).json({ posts: updatedPosts });
    
  } catch (err) {
    console.log('Error in getalluserspost:', err);
    return res.status(500).json({ message: 'Error during fetching all users posts' });
  }
});

module.exports = router;
