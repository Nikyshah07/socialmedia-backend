const express=require('express');
const { User } = require('../models/User');
const router=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
require('dotenv').config()
router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    
    try{
        const user=await User.findOne({email});
    if(!user)
    {
      return res.status(404).json({message:'User not found'})
    }

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch)
    {
       return res.status(404).json({message:'Invalid password'}) 
    }

    const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET
            
        );
    return res.status(200).json({message:'Login successfully...',token})
}
catch(err)
{
    return res.status(404).json({message:'Error during Login'})
}
})
module.exports=router