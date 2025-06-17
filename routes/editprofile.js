const express=require('express');
const router=express.Router();
const {User}=require('../models/User');
const multer = require('multer');
const authentiCate=require('../middleware')




// Multer setup (store in memory, not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put('/editprofile/:id',authentiCate, upload.single('photo'),async (req,res)=>{
  const {name,photo,bio,location,website,birthDate}=req.body
  const id=req.params.id
try{

    // Check: user can only update their own profile
    // if (req.user.userId !== id) {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare photo object (if uploaded)
    let photoData = user.photo; // keep existing if not uploading
    if (req.file) {
      photoData = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

  user.name = name || user.name;
    user.bio = bio || user.bio;
    user.location = location || user.location;
    user.website = website || user.website;
    user.birthDate = birthDate || user.birthDate;
    user.photo = photoData;

    const updatedUser = await user.save();

    const userToSend = updatedUser.toObject();
if (userToSend.photo && userToSend.photo.data) {
  userToSend.photo.data = userToSend.photo.data.toString('base64');
}
 return res.status(200).json({updatedUser:userToSend,message:' Profile updated successfully'})
}catch(err){
   return res.status(401).json({ message: 'Error updating profile',error:err.message})
}

})

module.exports=router
