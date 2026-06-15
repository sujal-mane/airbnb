const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {saveRedirectUrl} =require("../middleware.js");
const userController=require("../controllers/users.js");

const User=require("../models/user.js");
const passport = require("passport");
router.get("/signup",userController.renderSignupForm);

router.post("/signup",wrapAsync(userController.signup));

router.get("/login",userController.renderLoginForm);

router.post(
    "/login",
        saveRedirectUrl,                     // Middleware to save the redirect URL in res.locals
     passport.authenticate('local', {
         failureRedirect: '/login' ,
         failureFlash : true 
        }) , 
   wrapAsync( userController.login));


router.get("/logout", wrapAsync(userController.logout));

module.exports=router;