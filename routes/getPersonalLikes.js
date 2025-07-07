const express = require('express');
const router = express.Router();
const authentiCate = require('../middleware');
const { Post } = require('../models/Post');



// Route: GET /getpersonallike - Get all likes for current user's posts
router.get('/getpersonallike', authentiCate, async (req, res) => {
    const userId = req.user.userId; // Current logged-in user

    try {
        // Find all posts by the current user and populate likes with user info
        const posts = await Post.find({ user: userId })
            .populate('likes', 'name email photo') // Get user details who liked
            .select('caption location createdAt likes image'); // Select post fields you want

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        // Format the response to show which user liked which post
        const allLikes = [];
        let totalLikes = 0;

        posts.forEach(post => {
            post.likes.forEach(likedUser => {
                allLikes.push({
                    postId: post._id,
                    postCaption: post.caption || 'No caption',
                    postLocation: post.location || '',
                    postCreatedAt: post.createdAt,
                    // postImage: post.image ? {
                    //     data: post.image.data.toString('base64'),
                    //     contentType: post.image.contentType
                    // } : null,
                    postImage: post.image || null,

                    likedBy: {
                        userId: likedUser._id,
                        name: likedUser.name,
                        email: likedUser.email,
                        photo: likedUser.photo
                    }
                });
                totalLikes++;
            });
        });

        return res.status(200).json({
            totalLikes,
            totalPosts: posts.length,
            allLikes,
            message: "All likes retrieved successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching likes" });
    }
});

module.exports = router;