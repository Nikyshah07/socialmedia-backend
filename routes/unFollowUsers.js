const express=require('express');
const router=express.Router();
const {User}=require('../models/User');
const authentiCate = require('../middleware');
router.post('/unfollow/:id',authentiCate,async(req,res)=>{
    const id=req.params.id;
    const userId=req.user.userId;
    try{
    const user=await User.findById(id);
    if(!user)
    {
        return res.status(404).json({message:"User not found"})
    }

    await User.findByIdAndUpdate(id,{$pull:{followers:userId}});
    await User.findByIdAndUpdate(userId,{$pull:{following:id}});
    // return res.status(200).json({message:"you have unfollow this user"})
}
 catch(err)
    {
        return res.status(404).json({message:'Error during unfollow user'})
    }
})

module.exports=router;