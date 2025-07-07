const express=require('express');
const router=express.Router();
const authentiCate = require('../middleware');
const { User } = require('../models/User');
const { Post } = require('../models/Post');

router.get('/getprivateuserpost/:id', authentiCate, async (req, res) => {
  const id = req.params.id;

  try {
    const posts = await Post.find({ user: id })
      .populate('user', 'name photo')
      .populate('likes', '_id')
      .populate('comments.user', 'name');

    const formattedPosts = posts.map(post => ({
      ...post._doc,
      imageUrl: post.image || null, // Cloudinary URL directly
      userPhoto: typeof post.user.photo === 'string' ? post.user.photo : null,
      likesCount: post.likes.length,
      commentsCount: post.comments.length
    }));

    return res.status(200).json({ posts: formattedPosts });
  } catch (err) {
    return res.status(500).json({ message: 'Error in fetching post' });
  }
});


module.exports=router;