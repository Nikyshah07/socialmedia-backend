const jwt = require('jsonwebtoken');
const {User}=require('./models/User')
require('dotenv').config()
const authentiCate = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

     req.user = {
      userId: user._id,
      email: user.email,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authentiCate;

// const jwt = require("jsonwebtoken");
// require('dotenv').config()
// const authentiCate = (req, res, next) => {
  // const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // 🔁 Secret should match what you used during signup/login
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };

// module.exports = authentiCate ;
