// const express=require('express');
// const router=express.Router();
// const authentiCate = require('../middleware');
// const { User } = require('../models/User');
// const { Post } = require('../models/Post');
// router.get('/getlikes/:postId',authentiCate,async(req,res)=>{
//     const postId=req.params.postId;
//     const userId=req.user.userId;
//     const user=await User.findById(userId);
//     try{
//      if(!user)
//     {
//     return res.status(404).json({message:'User not found'})
//     }
//     const getLikes=await Post.findById(postId).populate('likes', 'name photo');;
//     console.log(getLikes.likes);
//      return res.status(200).json({getLikes})
// }catch(err)
// {
//     return res.status(404).json({message:'Error fetching likes'})
// }
// })

// module.exports=router


const express = require('express');
const router = express.Router();
const authentiCate = require('../middleware');
const { User } = require('../models/User');
const { Post } = require('../models/Post');




router.get('/getlikes/:postId', authentiCate, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Populate likes with full photo object
    const post = await Post.findById(postId).populate('likes', 'name photo');

    // Convert photo buffer to base64 string
    const likesWithPhotos = post.likes.map(likeUser => {
      let photoBase64 = '';
      if (likeUser.photo && likeUser.photo.data && likeUser.photo.contentType) {
        photoBase64 = `data:${likeUser.photo.contentType};base64,${likeUser.photo.data.toString('base64')}`;
      }

      return {
        _id: likeUser._id,
        name: likeUser.name,
        photo: photoBase64,
      };
    });

    return res.status(200).json({ getLikes: { likes: likesWithPhotos } });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching likes' });
  }
});

module.exports = router;
