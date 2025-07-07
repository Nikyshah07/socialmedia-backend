const express=require('express');
const router=express.Router();
const {User}=require('../models/User');
const authentiCate = require('../middleware');
const { Post } = require('../models/Post');


router.get('/getuserpost', authentiCate, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.userId }).populate('user', 'name photo');

    const postsWithImage = posts.map(post => ({
      _id: post._id,
      caption: post.caption,
      location: post.location,
      image: post.image || null, // Cloudinary URL directly
      likes: post.likes.length,
      comments: post.comments || [],
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      saved_by: post.saved_by.map(u => u._id.toString()),
      user: {
        _id: post.user._id,
        name: post.user.name,
        photo: typeof post.user.photo === 'string' ? post.user.photo : null // Cloudinary URL
      }
    }));

    res.status(200).json({ posts: postsWithImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});
module.exports=router