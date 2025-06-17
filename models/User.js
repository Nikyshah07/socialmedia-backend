const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        default:null
    },
    photo:
    {
       data: Buffer,           // store binary data
    contentType: String 
    },
    bio:{
  type:String,
  default:null,
   maxlength: [150, 'Bio cannot exceed 150 characters'],
    },

    followers:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
    following:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  location: {
    type: String,
    default: ''
  },

  website: {
    type: String,
    default: ''
  },

  birthDate: {
    type: Date,
    default:null
  },
     email:{
        type:String,
        required:true
    },
     password:{
        type:String,
        required:true
    },
    post: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Post'
}],
fcmToken: {
    type: String,
    default: null,
  },

    
})

const User=mongoose.model('user',userSchema);
module.exports={User}

