const express=require('express');
const router=express.Router();
const {User}=require('../models/User');
const authentiCate = require('../middleware');



router.get('/getprofile/:id',authentiCate, async(req,res)=>{

    
    const id=req.params.id;

    try{
      const user=await User.findById(id).select('-password');
      if(!user)
      {
        return res.status(404).json({message:'user not found'})
      }
       const userObj = user.toObject();
    
      res.status(200).json({message:userObj})
    }
    catch(err)
    {
        return res.status(404).json({message:'Error during get profile'})
    }

})
module.exports=router