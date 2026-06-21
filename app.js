// if(process.env.NODE_ENV !== "production"){
   
// } 
require("dotenv").config();

const express=require('express');
const app=express();
const mongoose =require("mongoose");
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} =require("./schema.js");
const Review=require("./models/review.js");

const session =require("express-session");
const MongoStore = require('connect-mongo').default;

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const reviewController=require("./controllers/review.js");

const listingsRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const path =require("path");

// Ensure required environment variables are set
const dburl = process.env.ATLAST;
if (!dburl) {
    console.error("FATAL: ATLAST environment variable is not set!");
    process.exit(1);
}

main().then(() =>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB",err);
    process.exit(1);
});

async function main(){
    await mongoose.connect(dburl, {
        maxPoolSize: 50,
        minPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        retryWrites: true,
        retryReads: true,
        maxIdleTimeMS: 60000
    });
}

 app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));

// ********* Session and Flash **********
const store= new MongoStore({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET || "defaultsecret"
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.error("MongoStore error:", err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());
// ******** Authentication **********
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});
app.get('/',(req,res)=>{
    res.send("Hello World i am root");
});

// app.get("/register",async(req,res)=>{
//     let demouser=  new User({
//         gmail : " student@gmail.com",
//         username :" Raju",

//     });
//    registeredUser =await  User.register(demouser,"xyz")
// res.send("registeredUser");


// });


app.use("/listings",listingsRouter);
//reviews post route
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((req, res) => {
  res.status(404).send(" Page Not found");
});
 app.use((err,req,res,next) =>{
    let {statusCode=500 , message="something went wrong"} =err;
    res.render("error.ejs",{message});
    // res.status(statusCode).send(message);
// res.send("something went wrong");
 });
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
