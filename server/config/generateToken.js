const { sign } = require("jsonwebtoken");


const generateToken=(email,userId)=>{
    return sign({email,userId},process.env.JWT_SECRET_KEY,{expiresIn:"3d"})
}

module.exports=generateToken