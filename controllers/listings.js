const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

// Lazy initialize geocoding client only when needed
let geocodingClient = null;

const getGeocodingClient = () => {
  if (!geocodingClient) {
    const token = process.env.MAP_TOKEN;
    if (!token) {
      throw new Error('MAP_TOKEN environment variable is not set');
    }
    geocodingClient = mbxGeocoding({ accessToken: token });
  }
  return geocodingClient;
};

// module.exports.indx=async(req,res)=>{
//      const listings=await Listing.find({});
//     res.render("listings/index.ejs",{listings});
// };
module.exports.new=async(req,res)=>{
     res.render("listings/new.ejs");
};

module.exports.show=(async (req,res)=>{
    let {id}=req.params;
  const listing=await  Listing.findById(id).populate({path :"reviews",
populate :{
    path :"author"
},
  })
  .populate("owner");
  if(!listing){
      throw new ExpressError(404,"Listing not found");
  }
  res.render("listings/show.ejs",{listing});
});


module.exports.create=async (req,res,next)=>{
const geocodingClient = getGeocodingClient();
let response= await geocodingClient.forwardGeocode({
  query:req.body.listing.location,
  limit: 2
})
.send();
 
 const newlisting= new Listing(req.body.listing);
  newlisting.owner=req.user._id;
  if(req.file){
    newlisting.image = {url: req.file.path, filename: req.file.filename};
  }
  newlisting.geometry=response.body.features[0].geometry;
await newlisting.save();
req.flash("success", "New Listing created ");
 res.redirect(`/listings/${newlisting._id}`);
 };

 module.exports.edit=async(req ,res)=>{
     let {id}=req.params;
   const listing=await  Listing.findById(id);
   res.render("listings/edit.ejs",{listing});
 };

 module.exports.update=async(req,res)=>{
     let {id}=req.params;
     let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});

if(typeof req.file !="undefined"){
let url=req.file.path;
     let filename=req.file.filename;
   listing.image={url,filename};
    await listing.save();
}
   req.flash("success", "Listing updated successfully");
   res.redirect(`/listings/${id}`);
 };

 module.exports.delet=async(req,res)=>{
     let {id}=req.params;
     let delet =await  Listing.findByIdAndDelete(id);
     req.flash("success", "Listing deleted successfully");
     res.redirect("/listings");
 };
