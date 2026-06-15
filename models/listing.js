const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const listingSchema=new Schema({
    title:{
        type:String,
        required:[true,"Title is required"],
        trim:true,
        minlength:[3,"Title must be at least 3 characters"],
        maxlength:[100,"Title cannot exceed 100 characters"]
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        trim:true,
        minlength:[10,"Description must be at least 10 characters"],
        maxlength:[1000,"Description cannot exceed 1000 characters"]
    },
    image:{
        filename: String,
            
            
        
        url : String,
            
        
    },
    price:{
        type:Number,
        set:(v)=> v==null ? 0 : v,
        min:[0,"Price cannot be negative"],
        max:[1000000,"Price seems too high"],
    },
    location:{
        type:String,
        required:[true,"Location is required"],
        trim:true,
        minlength:[2,"Location must be at least 2 characters"]
    },
    country:{
        type:String,
        required:[true,"Country is required"],
        trim:true,
        minlength:[2,"Country must be at least 2 characters"]
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
   owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},

   geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
   }
   
});

// if aany post will be deleted then all the review associate with that post will also be deletd
listingSchema.post("findOneAndDelete",async (listing)=>{
if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
}
});
    
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;