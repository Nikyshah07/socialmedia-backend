// const express=require('express');
// const router=express.Router();
// const {User}=require('../models/User');
// const authentiCate = require('../middleware');

// router.get('/getallprofiles/:id',authentiCate,async(req,res)=>{
// const id=req.params.id;
// try{
// const user=await User.findById(id).select('-password -email');
// if(!user)
// {
//     return res.status(404).json({message:'User not found'})
// }


// return res.status(200).json({user})


// }
// catch(err)
// {
//     return res.status(404).json({message:'Error during get all profiles'})
// }
// })
// module.exports=router



const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const authentiCate = require('../middleware'); 





// GET user profile by ID, including photo
router.get('/getallprofiles/:id', authentiCate, async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id).select('-password -email');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Convert photo Buffer to Base64 if exists
        let photoBase64 = null;
        if (user.photo && user.photo.data) {
            photoBase64 = `data:${user.photo.contentType};base64,${user.photo.data.toString('base64')}`;
        }

        // Send user data with photo in Base64 format
        return res.status(200).json({
            user: {
                ...user.toObject(),  // Convert Mongoose document to plain object
                photo: photoBase64
            }
        });
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        return res.status(500).json({ message: 'Error during get all profiles' });
    }
});

module.exports = router;
