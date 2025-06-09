// // const express=require('express');
// // const router=express.Router();
// // const {User}=require('../models/User');
// // const authentiCate = require('../middleware');
// // const { Post } = require('../models/Post');

// // router.get('/getalluserspost',authentiCate,async(req,res)=>{
// //    const userId=req.user.userId;
// //    try{
// //       const user=await User.findById(userId)
// //       if(!userId)
// //       {
// //         return res.status(404).json({message:'User not found'})
// //       }
// //     //   const posts=await Post.find();

// //     const posts=await Post.find({user:{$in:user.following}})
      
// //       return res.status(200).json({posts})
      
// //    }catch(err)
// //    {
// //     return res.status(404).json({message:'Error during fetching all users posts'})
// //    }
// // })

// // module.exports=router


// const express = require('express');
// const router = express.Router();
// const { User } = require('../models/User');
// const { Post } = require('../models/Post');
// const authentiCate = require('../middleware');

// router.get('/getalluserspost', authentiCate, async (req, res) => {
//   const userId = req.user.userId;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const posts = await Post.find({ user: { $in: user.following } }).populate(
//       'user',
//       'name photo'
//     );

//     // Inject user photo as base64 string into post object
//     const updatedPosts = posts.map((post) => {
//       const userPhoto = post.user?.photo?.data
//         ? `data:${post.user.photo.contentType};base64,${post.user.photo.data.toString('base64')}`
//         : null;

//       return {
//         ...post._doc,
//         user: {
//           _id: post.user._id,
//           name: post.user.name,
          
//         },
//         userPhoto,
//         likesCount: post.likes?.length || 0,
//         commentsCount: post.comments?.length || 0,
//       };
//     });
// // console.log(updatedPosts)
//     return res.status(200).json({ posts: updatedPosts });
    
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: 'Error during fetching all users posts' });
//   }
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { User } = require('../models/User');
// const { Post } = require('../models/Post');
// const authentiCate = require('../middleware');

// router.get('/getalluserspost', authentiCate, async (req, res) => {
//   const userId = req.user.userId;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // ALTERNATIVE APPROACH: Get posts and users separately
//     const posts = await Post.find({ user: { $in: user.following } })
//       .sort({ createdAt: -1 });

//     // Get all unique user IDs from posts
//     const userIds = [...new Set(posts.map(post => post.user.toString()))];
    
//     // Get all users at once
//     const users = await User.find({ _id: { $in: userIds } }).select('name photo');
    
//     // Create a map of userId to user data for quick lookup
//     const userMap = {};
//     users.forEach(user => {
//       let userPhoto = null;
//       if (user.photo && user.photo.data) {
//         userPhoto = `data:${user.photo.contentType};base64,${user.photo.data.toString('base64')}`;
//       }
      
//       userMap[user._id.toString()] = {
//         _id: user._id,
//         name: user.name,
//         userPhoto: userPhoto
//       };
//     });

//     // Map posts with correct user data
//     const updatedPosts = posts.map((post) => {
//       const postUserId = post.user.toString();
//       const userData = userMap[postUserId] || { _id: postUserId, name: 'Unknown User', userPhoto: null };

//       return {
//         _id: post._id,
//         location: post.location,
//         caption: post.caption,
//         likes: post.likes || [],
//         comments: post.comments || [],
//         createdAt: post.createdAt,
//         updatedAt: post.updatedAt,
//         user: {
//           _id: userData._id,
//           name: userData.name,
//         },
//         userPhoto: userData.userPhoto,
//         likesCount: post.likes?.length || 0,
//         commentsCount: post.comments?.length || 0,
//       };
//     });

//     // Debug log to verify different users
//     console.log('User mapping verification:');
//     updatedPosts.forEach((post, index) => {
//       console.log(`Post ${index + 1}:`, {
//         postId: post._id,
//         userId: post.user._id,
//         userName: post.user.name,
//         hasUniquePhoto: !!post.userPhoto,
//         photoPreview: post.userPhoto ? post.userPhoto.substring(0, 50) + '...' : 'No photo'
//       });
//     });

//     return res.status(200).json({ posts: updatedPosts });
    
//   } catch (err) {
//     console.log('Error in getalluserspost:', err);
//     return res.status(500).json({ message: 'Error during fetching all users posts' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const authentiCate = require('../middleware');

router.get('/getalluserspost', authentiCate, async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get posts with populated user data
    const posts = await Post.find({ user: { $in: user.following } })
      .populate('user', 'name photo') // Populate user info
      .sort({ createdAt: -1 });

    // Map posts with correct user and post data
    const updatedPosts = posts.map((post) => {
      // Handle USER profile photo
      let userProfilePhoto = null;
      if (post.user.photo && post.user.photo.data) {
        userProfilePhoto = `data:${post.user.photo.contentType};base64,${post.user.photo.data.toString('base64')}`;
      }

      // Handle POST image (your model uses 'image' field)
      let postImage = null;
      if (post.image && post.image.data) {
        postImage = `data:${post.image.contentType};base64,${post.image.data.toString('base64')}`;
      }

      // Debug: Log to check if image exists
      console.log(`Post ${post._id}:`, {
        hasImage: !!post.image,
        hasImageData: !!(post.image && post.image.data),
        caption: post.caption
      });

      return {
        _id: post._id,
        location: post.location,
        caption: post.caption,
        likes: post.likes || [],
        comments: post.comments || [],
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: {
          _id: post.user._id,
          name: post.user.name,
        },
        userPhoto: userProfilePhoto,    // User's profile picture
        postPhoto: postImage,           // The actual post image/content
        likesCount: post.likes?.length || 0,
        commentsCount: post.comments?.length || 0,
      };
    });

    // Debug log to verify different posts
    console.log('Post mapping verification:');
    updatedPosts.forEach((post, index) => {
      console.log(`Post ${index + 1}:`, {
        postId: post._id,
        userId: post.user._id,
        userName: post.user.name,
        hasUserPhoto: !!post.userPhoto,
        hasPostPhoto: !!post.postPhoto,
        postPhotoPreview: post.postPhoto ? post.postPhoto.substring(0, 50) + '...' : 'No post photo'
      });
    });

    return res.status(200).json({ posts: updatedPosts });
    
  } catch (err) {
    console.log('Error in getalluserspost:', err);
    return res.status(500).json({ message: 'Error during fetching all users posts' });
  }
});

module.exports = router;
