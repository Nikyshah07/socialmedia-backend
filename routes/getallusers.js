const express=require('express');
const router=express.Router();
const {User}=require('../models/User');
const authentiCate=require('../middleware');

// router.get('/getAllUsers',authentiCate,async(req,res)=>{
//     try{
//     const loginUserId=req.user.userId
//     // const user=await User.find().select(-loginUserId)
//     const user = await User.find({ _id: { $ne: loginUserId } });

//     if(!user)
//     {
//         return res.status(404).json({message:'Users not found'})
//     }
//     console.log(user)
//     res.status(200).json({user})
//     }catch(err)
//     {
//         return res.status(404).json({message:'Error during fetching all users'})
//     }
// })
router.get('/getAllUsers', authentiCate, async (req, res) => {
    try {
        const loginUserId = req.user.userId;
        const { name } = req.query;

        let query = { _id: { $ne: loginUserId } };

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const user = await User.find(query);

        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'Users not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ message: 'Error during fetching all users' });
    }
});

module.exports=router