const express=require('express');
const {User}=require('../models/User');
const {Post}=require('../models/Post');
const authentiCate = require('../middleware');
const { messaging } = require('firebase-admin');
const router=express.Router();

router.post('/savePost/:postId',authentiCate,async (req,res)=>{
    const postId=req.params.postId;
    const userId=req.user.userId;

    const post=await Post.findById(postId);
    if(!post)
    {
        return res.status(404).json({message:"Post not found"})
    }

   const alreadySaved= post.saved_by.includes(userId);
   let updatedPost;
   if(alreadySaved)
   {
    updatedPost=await Post.findByIdAndUpdate(postId,{$pull:{saved_by:userId}},{ new: true } );
    return res.status(200).json({ message: "Post unsaved",  updatedPost });


   }

else{
    updatedPost=await Post.findByIdAndUpdate(postId,{$push:{saved_by:userId}},{ new: true });
    return res.status(200).json({message:"Post saved successfully",updatedPost})
}
})
module.exports=router;