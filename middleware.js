const Listing=require("./models/listing.js");
const wrapAsync=require("./utils/wrapAsync.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req ,res ,next)=>{
let {id}= req.params;
let listing=await Listing.findById(id);
if(!listing.owner.equals(req.user._id)){
    req.flash("error","You do not have permission to do that");
    return res.redirect(`/listings/${id}`);
}
next();
}