const express=require('express');
const authentiCate = require('../middleware');
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const router=express.Router();

router.get('/getcomments/:id',authentiCate,async(req,res)=>{
    const id=req.params.id;
    const userId=req.user.userId;
    try{
    const user=await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post=await Post.findById(id);
           if(!post)
           {
            return res.status(404).json({ message: 'Post not found' });
           }

     const getComments= await Post.findById(id).populate('comments.user', 'name photo');
     return res.status(200).json({getComments});
      }
    catch(err)
    {
        return res.status(500).json({ message: 'Error during fetching comments ' });
    }
})
module.exports=router
