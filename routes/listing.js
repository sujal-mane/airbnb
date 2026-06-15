const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema} =require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}= require("../cloudConfig.js");

const upload = multer({ storage });







    const validateListing=(req,res,next)=>{
      let {error}= listingSchema.validate(req.body);
       if(error){
       throw new ExpressError(400,error);
    }else{
      next();
   }
    };



//indx 
router.get('/',wrapAsync(listingController.indx));
    

// new route
router.get("/new", isLoggedIn ,wrapAsync(listingController.new));
    
   

// show route
router.get("/:id",wrapAsync(listingController.show));
//create route

router.post("/",
     
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(listingController.create));

//Edit route
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingController.edit));
//update route
router.put("/:id",
    isLoggedIn,
     isOwner,
     upload.single("listing[image]"),
    validateListing,
       wrapAsync(listingController.update));
// delet route
router.delete("/:id",isLoggedIn, isOwner,wrapAsync(listingController.delet));
module.exports=router;