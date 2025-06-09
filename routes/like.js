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

    // const post=await Post.findById(id);
    //  if(post.likes.includes(userId))
    // {
    //     return res.status(200).json({message:'you have already like post'})
    // }

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
  
    return res.status(200).json({message:`you have like this  post`,likeposts})
}
    catch(err)
    {
        return res.status(404).json({message:'Error during like user post'})
    }
}
)
module.exports=router








// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyCfX2Nt7RBH-fOLPGnjI6pvXNrYMsxnmoA",
//   authDomain: "socialmedia-153f7.firebaseapp.com",
//   projectId: "socialmedia-153f7",
//   storageBucket: "socialmedia-153f7.firebasestorage.app",
//   messagingSenderId: "423418543489",
//   appId: "1:423418543489:web:4fff083440605ba2d6fc80"
// };


// const app = initializeApp(firebaseConfig);

// 423418543489

// BDHPqbxiPHzhO0crQ-2WwTMwjmXoW8GhnoFtcPayaga-qyBVpAjFUyMpY07vH8lqInAxSxAZ8F0FTDCr-gJ6m9E