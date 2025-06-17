const express=require('express');
const authentiCate = require('../middleware');
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const router=express.Router();



router.put('/unlike/:id',authentiCate,async(req,res)=>{
    const id=req.params.id;
    const userId=req.user.userId;

    try{
       const user=await User.findById(userId);
       if(!user)
       {
        return res.status(500).json({ message: 'User not found' });
       }
       const post=await Post.findById(id);
       if(!post)
       {
        return res.status(500).json({ message: 'Post not found' });
       }
       await Post.findByIdAndUpdate(id,{$pull:{likes:userId}});
       
        return res.status(200).json({ message: 'You have unlike this post' });
       
    }
    catch(err)
    {
        return res.status(500).json({ message: 'Error during unlike posts' });
    }
})
module.exports=router