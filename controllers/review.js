const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.create=async(req,res)=>{
   let listing= await Listing.findById(req.params.id);
   if(!listing){
      throw new ExpressError(404,"Listing not found");
   }
   let newreview=new Review(req.body.review);

   listing.reviews.push(newreview);
   await listing.save();
   await newreview.save();
   req.flash("success", "Review created successfully");
   res.redirect(`/listings/${listing._id}`);

};

module.exports.delet=async(req,res)=>{
let { id,reviewId} = req.params;
const listing = await Listing.findById(id);
if(!listing){
   throw new ExpressError(404,"Listing not found");
}
await Review.findByIdAndUpdate(reviewId);
await Listing.findByIdAndUpdate(id,{$pull :{reviews : reviewId}});
req.flash("success", "Review deleted successfully");
res.redirect(`/listings/${id}`);
};