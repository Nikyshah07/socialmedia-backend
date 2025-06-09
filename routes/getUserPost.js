const express=require('express');
const router=express.Router();
const {User}=require('../models/User');
const authentiCate = require('../middleware');
const { Post } = require('../models/Post');

// router.get('/getuserpost',authentiCate,async(req,res)=>{
//    const userId=req.user.userId;
//    try{
//       const user=await User.findById(userId) 
//       if(!userId)
//       {
//         return res.status(404).json({message:'User not found'})
//       }
//       const posts=await Post.find({user:userId})
//       res.status(200).json({posts})
//       console.log(user)
//       console.log(posts)

       
//    }
//    catch(err)
//    {
//     return res.status(404).json({message:'Error during fetching user posts'})
//    }
// })


router.get('/getuserpost', authentiCate, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.userId });

    const postsWithImage = posts.map(post => {
      let imageBase64 = null;
      if (post.image && post.image.data) {
        imageBase64 = `data:${post.image.contentType};base64,${post.image.data.toString('base64')}`;
      }

      return {
        _id: post._id,
        caption: post.caption,
        location: post.location,
        image: imageBase64,
        // likes: post.likes.map(id => id.toString()) || [], 
        likes:post.likes.length,
        comments: post.comments || [],
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
        user: post.user,
      };
    });

    res.status(200).json({ posts: postsWithImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});


module.exports=router