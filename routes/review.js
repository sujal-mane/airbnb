const express=require("express");
const router=express.Router({mergeParams :true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema} =require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const reviewController=require("../controllers/review.js");


const validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
   
 if(error){
    throw new ExpressError(400,error);
 }else{
    next();
 }
};
//creat
router.post("", validateReview ,isLoggedIn, wrapAsync(reviewController.create));

// delet review route
router.delete(":reviewId", wrapAsync(reviewController.delet));

module.exports=router;