const mongoose=require('mongoose')
const postschema=new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true, // Who created the post
  },
  caption: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  saved_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }]
},
{timestamps: true} // Automatically add createdAt and updatedAt fields
);

 const Post=mongoose.model('Post',postschema)
module.exports={Post}