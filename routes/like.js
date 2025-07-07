const express=require('express');
const authentiCate = require('../middleware');
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const router=express.Router()



const sendNotification = require('../utils/sendNotification'); // Add this
router.post('/like/:id',authentiCate,async(req,res)=>{
    const id=req.params.id;
    const userId=req.user.userId;
    try{
    const user=await User.findById(userId);
    if(!user)
    {
    return res.status(404).json({message:'User not found'})
    }

   

    const likeposts=await Post.findByIdAndUpdate(id,{$push:{likes:userId}},{new:true})
 const postOwner = await User.findById(likeposts.user); // changed from postedBy to user
if (postOwner && postOwner.fcmToken && postOwner._id.toString() !== userId) {
  const currentUser = await User.findById(userId);
  await sendNotification(
    postOwner.fcmToken,
    "Post Liked!",
    `${currentUser.name} liked your post.`
  );
}
  

if (postOwner && postOwner._id.toString() !== userId) {
  // Add the post ID to postOwner's notification list if not already there
  if (!postOwner.newLikeNotifications.includes(id)) {
    postOwner.newLikeNotifications.push(id);
    await postOwner.save();
  }
}
    return res.status(200).json({message:`you have like this  post`,likeposts})
}
    catch(err)
    {
        return res.status(404).json({message:'Error during like user post'})
    }
}
)
module.exports=router





