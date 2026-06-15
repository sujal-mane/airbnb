
const User=require("../models/user.js");
module.exports.renderSignupForm=(req , res)=>{
    res.render("user/signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
let {username , email ,password}=req.body;
 const newUser=new User({username,email});
 const registeruser= await User.register(newUser ,password);
req.login(registeruser, (err) =>{
    if(err){
 return next(err);
    }
    req.flash("success","Welcome to Wanderlust! Signup successful");
res.redirect("/listings"); 
});

}catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    };


    module.exports.renderLoginForm=(req ,res) =>{

res.render("user/login.ejs");

};
    module.exports.login=async  (req,res)=>{
res.redirect(res.locals.redirectUrl || "/listings");
    }

    module.exports.logout=async (req ,res)=>{
req.logout((err) =>{
if(err){
    return next(err);
}
req.flash("success","You have logged out successfully");
res.redirect("/listings");
})

};