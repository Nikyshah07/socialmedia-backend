const express=require('express');
const {  mongoose } = require('mongoose');
const cors=require('cors')
const app = express(); 
app.use(express.json()); 

app.use(cors({
  origin: '*'
  
}));
require('dotenv').config()
const login=require('./routes/login');
const register=require('./routes/register');

const forgot=require('./routes/forgotPassword')
const verifyotp=require('./routes/verifyotp')
const resetpass=require('./routes/resetpassword')

const addprofile=require('./routes/addProfile')
const getprofile=require('./routes/getProfile')
const editprofile=require('./routes/editprofile')

const getallusers=require('./routes/getallusers')
const getallprofiles=require('./routes/getallprofiles')

const followers=require('./routes/followUsers')
const unfollowers=require('./routes/unFollowUsers')


const createPost=require('./routes/postRoutes');
const deletePost=require('./routes/deletePost')
const getAllUsersPost=require('./routes/allUsersPosts')
const getUserPost=require('./routes/getUserPost')

const likePost=require('./routes/like');
const unLikePost=require('./routes/unLike')
const commentPost=require('./routes/comment');
const getComments=require('./routes/getComments');
const getLikes=require('./routes/getLikes')

const basicinfo=require('./routes/basicinfo')
const getPrivateUserPost=require('./routes/getPrivateUserPost')
const saveFcmToken=require('./routes/saveFcmToken')

const getpersonallike=require('./routes/getPersonalLikes');



const response=mongoose.connect(process.env.URL)
if(response)
{
    console.log('connected');
}
else{
    console.log('not connected')
}

app.use('/',register)
app.use('/',login)

app.use('/',forgot)
app.use('/',verifyotp)
app.use('/',resetpass)

app.use('/',addprofile)
app.use('/',getprofile)
app.use('/',editprofile)

app.use('/',getallusers)
app.use('/',getallprofiles)

app.use('/',followers)
app.use('/',unfollowers)

app.use('/',createPost)
app.use('/',deletePost)
app.use('/',getAllUsersPost)
app.use('/',getUserPost)

app.use('/',likePost)
app.use('/',unLikePost)
app.use('/',commentPost)
app.use('/',getComments)
app.use('/',getLikes)

app.use('/',basicinfo)
app.use('/',getPrivateUserPost)
app.use('/',saveFcmToken)

app.use('/',getpersonallike)

app.listen(process.env.PORT,()=>{
    console.log('Server started...');
})