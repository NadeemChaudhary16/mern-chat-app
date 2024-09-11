const express=require("express")
const router=express.Router();
const {registerUser, loginUser, allUser}=require("../controllers/AuthController");
const isLoggedIn = require("../middlewares/AuthMiddleware");

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/",isLoggedIn, allUser)


module.exports=router