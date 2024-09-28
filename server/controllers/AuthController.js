const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const generateToken = require("../config/generateToken");
const bcrypt=require("bcrypt")

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password,confirmPassword, image } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("All fields are required");
  }
  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    // res.status(400);
    // throw new Error("User already exists");
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = await User.create({
    name,
    email,
    password,
    image: image || undefined,
  });
  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      image: newUser.image,
      token: generateToken(newUser.email,newUser._id)
    });
  } else {
    res.status(400);
    throw new Error("Failed to register user");
  }
});

const loginUser=asyncHandler(async(req,res)=>{
       const { email, password } = req.body
       const user=await User.findOne({email})
       if(user && (await bcrypt.compare(password, user.password))){
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          password:user.password,
          isAdmin: user.isAdmin,
          image: user.image,
          token: generateToken(user.email,user._id)
        })
       }
       else{
        res.status(400);
        throw new Error("Email or Password is incorrect");
       }

});

const allUser=asyncHandler(async(req,res)=>{
  const keyword=req.query.search ? 
  {
    $or: [
      {name :{$regex: req.query.search,$options:"i"}},
      {email :{$regex: req.query.search,$options:"i"}},
    ],
  }
  :{};
  const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
  res.send(users)
})

module.exports = {
  registerUser,
  loginUser,
  allUser
};
