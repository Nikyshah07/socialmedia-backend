const express=require('express');
const authentiCate = require('../middleware');
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const router=express.Router();




router.delete('/deletepost/:id',authentiCate,async(req,res)=>{
    const id=req.params.id;
    const userId=req.user.userId;
   try{
    const user=await User.findById(userId);
    if(!user)
    {
        return res.status(200).json({message:"User not found"});
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await Post.findByIdAndDelete(id);
    await User.findByIdAndUpdate(userId,{$pull:{post:id}})
    return res.status(200).json({message:"Post deleted successfully..."});
    
}catch(err)
{
    return res.status(200).json({message:"Error during delete post"});
}
})
module.exports=router