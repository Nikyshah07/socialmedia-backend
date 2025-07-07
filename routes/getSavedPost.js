const express=require('express');
const router=express.Router();
const {User}=require('../models/User');
const {Post}=require('../models/Post');
const authentiCate = require('../middleware');

router.get('/getSavedPost',authentiCate,async(req,res)=>{
const userId=req.user.userId;
try{

let savedPosts = await Post.find({ saved_by: userId }).populate("user", "name photo");
 savedPosts = savedPosts.map(post => ({
      ...post._doc, // Convert Mongoose doc to plain object
      likesCount: post.likes.length,
      commentsCount: post.comments.length
    }));
return res.status(200).json({savedPosts})
}catch(err)
{
    console.error("Error in /getSavedPost:", err); 
    return res.status(400).json({message:"Server error",err})
}
})
module.exports=router;