const express=require('express');
const router=express.Router();
const {User}=require('../models/User');
const authentiCate = require('../middleware');
const sendNotification = require('../utils/sendNotification'); // Add this


router.post('/follow/:id',authentiCate,async(req,res)=>{
    const id=req.params.id;//request
    const userId=req.user.userId;//login id
    try{
    const user=await User.findById(id);
    if(!user)
    {
        return res.status(404).json({message:'User not found'})
    }
    await User.findByIdAndUpdate(id,{$push:{followers:userId}});
    await User.findByIdAndUpdate(userId,{$push:{following:id}});

    if (user.fcmToken) {
  const currentUser = await User.findById(userId);
  await sendNotification(
    user.fcmToken,
    "New Follower!",
    `${currentUser.name} started following you.`
  );
}
    // return res.status(200).json({message:"you have follow this user"})
    }
    catch(err)
    {
        return res.status(404).json({message:'Error during follow user'})
    }
})

module.exports=router