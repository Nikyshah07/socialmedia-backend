const express=require('express');
const { User } = require('../models/User');
const jwt=require('jsonwebtoken')



require('dotenv').config()
const router=express.Router();
const bcrypt=require('bcrypt');
router.post('/register',async(req,res)=>{
    const {email,password,confirmPassword}=req.body;

    
    const existingUser=await User.findOne({email});
    if(existingUser)
    {
        return res.status(404).json({message:'User already exist'});

    }
    if(confirmPassword!==password)
    {
        return res.status(404).json({message:'Password and confirmPassword should be same'})
    }
    const hashPassword=await bcrypt.hash(password,10);

    
    const newUser=new User({
        email,
        password:hashPassword,
        
    })
    await newUser.save();

     const token = jwt.sign(
                { userId: newUser._id, email:newUser.email },
                process.env.JWT_SECRET
                
            );
    res.status(200).json({message:'Register successfully..',newUser,token})
})
module.exports=router