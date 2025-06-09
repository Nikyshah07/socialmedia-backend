const express=require('express');
const authentiCate = require('../middleware');
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const router=express.Router();
const sendNotification = require('../utils/sendNotification'); // Add this

router.post('/comment/:id',authentiCate,async(req,res)=>{
    const id=req.params.id;
    const {commentText}=req.body;
    const userId=req.user.userId;
    try{
    const user=await User.findById(userId);
    if(!user)
    {
    return res.status(404).json({message:'User not found'})
    }
    const likeposts=await Post.findByIdAndUpdate(id,{$push:{comments:{user:userId,text:commentText}}},{new:true})

    const postOwner = await User.findById(likeposts.user);
if (postOwner && postOwner.fcmToken && postOwner._id.toString() !== userId) {
  const currentUser = await User.findById(userId);
  await sendNotification(
    postOwner.fcmToken,
    "New Comment!",
    `${currentUser.name} commented on your post.`
  );
}

  
    // return res.status(200).json({message:'you have comment on this post'})
}
    catch(err)
    {
        return res.status(404).json({message:'Error during like user post'})
    }
}
)
module.exports=router