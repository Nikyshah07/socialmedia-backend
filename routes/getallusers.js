const express=require('express');
const router=express.Router();
const {User}=require('../models/User');
const authentiCate=require('../middleware');

router.get('/getAllUsers', authentiCate, async (req, res) => {
    try {
        const loginUserId = req.user.userId;
        const { name } = req.query;

        let query = { _id: { $ne: loginUserId } };
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const users = await User.find(query).populate('post');

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'Users not found' });
        }

        // Format each user data
        const formattedUsers = users.map(user => {
            
            let profilePhoto = user.photo || null;


            return {
                _id: user._id,
                name: user.name,
                profilePhoto,
                postCount: user.post.length,
                followersCount: user.followers.length,
                followingCount: user.following.length
            };
        });

        res.status(200).json({ user: formattedUsers });

    } catch (err) {
        console.error("Error in getAllUsers:", err);
        return res.status(500).json({ message: 'Error during fetching all users' });
    }
});


module.exports=router;