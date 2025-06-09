const express=require('express');
const router=express.Router();
const authentiCate = require('../middleware');
const { User } = require('../models/User');
const { Post } = require('../models/Post');

// router.get('/getprivateuserpost/:id',authentiCate,async(req,res)=>{
//     const id=req.params.id;
//     const userId=req.user.userId;

//     try{
//     const user=await User.findById(userId);
//     if(!user)
//     {
//         return res.status(404).json({message:'User not found'})
//     }
//      const posts = await Post.find({ user: id });
//     console.log(posts)
//     return res.status(200).json({posts})
//     }
//     catch(err)
//     {
//         return res.status(404).json({message:'Error in fetching post'})
//     }
// })


router.get('/getprivateuserpost/:id', authentiCate, async (req, res) => {
    const id = req.params.id;
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = await Post.find({ user: id })
            .populate('likes', '_id') // Optional: add name or email if needed
            .populate('comments.user', 'name'); // Optional: add photo

        // Convert image buffer to base64
        const formattedPosts = posts.map(post => ({
            ...post._doc,
            imageUrl: post.image.data
                ? `data:${post.image.contentType};base64,${post.image.data.toString('base64')}`
                : null,
            likesCount: post.likes.length,
            commentsCount: post.comments.length
        }));

        return res.status(200).json({ posts: formattedPosts });
    } catch (err) {
        return res.status(500).json({ message: 'Error in fetching post' });
    }
});


module.exports=router;