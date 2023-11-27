//jshint esversion:6
require('dotenv').config()
const dotenv=require('dotenv');
const cookieParser=require('cookie-parser')
require('mongodb')
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const findOrCreate = require("mongoose-findorcreate");
let multer=require('multer')
let methodOverride = require('method-override')
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const axios = require('axios');


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method'))

app.use(express.json());
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false,
  cookie:{secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());

const LoginuserSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

LoginuserSchema.plugin(passportLocalMongoose);
LoginuserSchema.plugin(findOrCreate);

const LOGINUSER = new mongoose.model("loginUser", LoginuserSchema);

passport.use(LOGINUSER.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    LOGINUSER.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
// mongoose.set('strictQuery', true); mongoose.connect('mongodb://127.0.0.1/webDB');
// mongoose.set('strictQuery', false);

// MAIN //
//HEADER DATABASE//
let pageModel = require('./model/pageModal')
let headerMenu=require('./model/headerMenu')
let products=require('./model/productModal')
let Order=require('./backend/models/order')

//update part*******************************************************************************************
const errorMiddleware=require('./backend/middlewares/errors')

//Import all routes
const product=require('./backend/routes/product');
const user=require('./backend/routes/user');
const order = require("./backend/routes/order");
//const payment=require("./backend/routes/payment");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
//app.use("/api/v1",payment);

//middleware to handle errors
app.use(errorMiddleware);
//updated part*********************************************************************************************


//default items
const title1=new headerMenu({title:"Men's",sub_title:[{sub_title:"Shirt"},{sub_title:"Shorts & Jeans"},{sub_title:"Safety Shoes"}]});
  const title2=new headerMenu({title:"Women's",sub_title:[{sub_title:"Dress & Frock"},{sub_title:"Earrings"},{sub_title:"Necklace"}]});
  const title3=new headerMenu({title:"Jewelry",sub_title:[{sub_title:"Earrings"},{sub_title:"Couple Rings"},{sub_title:"Necklace"}]});
  const title4=new headerMenu({title:"Perfume",sub_title:[{sub_title:"Clothes Perfume"},{sub_title:"Deodorant"},{sub_title:"Flower Fragrance"}]});
  const defaulttitles=[title1,title2,title3,title4]
headerMenu.find({}).then(function (founditems) {
  if(founditems.length == 0){
  headerMenu.insertMany(defaulttitles)
  .then(function () {
    console.log("Successfully saved defult items to DB");
  })
  .catch(function (err) {
    console.log(err);
  });}
});

//storage and filename
  let storage = multer.diskStorage({
    destination: 'public/backend/images/',
    filename: (req, file, cb) => {
        //cb(null, Date.now() + file.originalname) // file name setting with current –date
	cb(null ,  file.originalname) // file name setting with original name
    }
})

//IMAGE UPLOAD SETTING
let upload = multer({
  storage: storage,
  // here image validation
  fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png") {
          cb(null, true)
      }
      else { 
          cb(null, false)
          return cb(new Error('Only Jpg, png, jpeg, allow'))
      }
  }})  
// ROUTES//
app.get("/",function(req,res){
  products.find({}).then(function (foundproducts) {
  headerMenu.find({}).then(function (founditems) {
  res.render("home", {titles: founditems,products: foundproducts});
  });
});

});
app.get("/favouriteItem",function(req,res){
  res.render("favoriteItems");
});
app.get("/shoppingCart",function(req,res){
  res.render("shoppingCart");
});
////// authorization/////////////////
app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/Account");
  });
app.get("/personalAccount",function(req,res){
  res.render("login");
});
app.get("/Account", function(req, res){
        res.render("personalAccount",{t:false});
});

///////////////////////////////////////
app.get("/BlogMainPage", async (req, res) => {
  pageModel.find({})
  .then((x)=>{
      res.render('Blog', {x})
  })
});
app.get("/BlogMainPage/:id", async (req, res) => {
  pageModel.findOne({PageUrl :req.params.id})
  .then((y)=>{
    res.render("singleBlog",{y});
})
});


app.get("/admin", async (req, res) => {
  res.render("admin");
});
app.get("/admin/dynamicPage",function(req,res){
  pageModel.find({}).count()
  .then((x)=>{
  res.render("dynamicPage",{x});
  })
});

app.get("/admin/navigationPage",function(req,res){
  pageModel.find({})
    .then((x)=>{
        res.render("navigationPage", {x})
    })
});
app.get("/admin/pages/add-pages/",function(req,res){
  res.render("add-pages");
});
app.post("/admin/pages/add-pages/",upload.single('Page_Photo'),function(req,res){
if(!req.body.page_url){
  pageModel.findOne({PageUrl :req.body.Page_Url})
  .then((a)=>{
      if(a){
              res.redirect('/admin/navigationPage/') 
      }
      else if(!req.file){
              //create page without photo
              let data ={
                  PageUrl : req.body.Page_Url,
                  PageNavText : req.body.Page_Nav_Text,
                  PageTitle : req.body.Page_Title,
                  PageMetaDescrition : req.body.Page_Meta_Description,
                  PageMetaKeyword : req.body.Page_Meta_Keyword,
                  PageHeading : req.body.Page_Heading,
                  //PagePhoto : req.body.file,
                  PageDetails :req.body.Page_Details
              }
              pageModel.create(data)
              .then((x)=>{
                  res.redirect('/admin/navigationPage/')

              }).catch((y)=>{
                  console.log(y)
              })
              //end create page
          
      }
      else{
          //create page with photo
          let data ={
              PageUrl : req.body.Page_Url,
              PageNavText : req.body.Page_Nav_Text,
              PageTitle : req.body.Page_Title,
              PageMetaDescrition : req.body.Page_Meta_Description,
              PageMetaKeyword : req.body.Page_Meta_Keyword,
              PageHeading : req.body.Page_Heading,
              PagePhoto : req.file.filename,
              PageDetails :req.body.Page_Details
          }
          pageModel.create(data)
          .then((x)=>{
              res.redirect('/admin/navigationPage/')

          }).catch((y)=>{
              console.log(y)
          })
          //end create page
      }
  })
 }
 else{
  res.redirect('/admin/navigationPage/')
 }
});
app.get('/admin/pages/edit-pages/:id', (req, res)=>{
  pageModel.findOne({PageUrl:req.params.id})
  .then((x)=>{
      res.render('edit-pages', {x})
  })
  .catch((y)=>{
      console.log(y)
  })
})

app.put('/admin/pages/edit-pages/:id', upload.single('Page_Photo'), (req, res)=>{
  if(!req.file){
    // without image update
    pageModel.updateOne({PageUrl:req.params.id}, {$set:{
      PageUrl : req.body.Page_Url,
      PageNavText : req.body.Page_Nav_Text,
      PageTitle : req.body.Page_Title,
      PageMetaDescrition : req.body.Page_Meta_Description,
      PageMetaKeyword : req.body.Page_Meta_Keyword,
      PageHeading : req.body.Page_Heading,
      //PagePhoto : req.body.file,
      PageDetails :req.body.Page_Details}})
    .then((x)=>{
        res.redirect('/admin/navigationPage/')
    }).catch((y)=>{
  })
    //end
}
else{
    // with image update
    pageModel.updateOne({PageUrl:req.params.id}, {$set:{
      PageUrl : req.body.Page_Url,
      PageNavText : req.body.Page_Nav_Text,
      PageTitle : req.body.Page_Title,
      PageMetaDescrition : req.body.Page_Meta_Description,
      PageMetaKeyword : req.body.Page_Meta_Keyword,
      PageHeading : req.body.Page_Heading,
      PagePhoto : req.file.filename,
      PageDetails :req.body.Page_Details
    }})
    .then((x)=>{
      
        res.redirect('/admin/navigationPage/')
    }).catch((y)=>{
      // console.log(y)
  })
} console.log(req.body.Page_Meta_Description)
})

app.delete('/admin/pages/delete-pages/:id', (req, res)=>{
  pageModel.deleteOne({PageUrl:req.params.id})
  .then((x)=>{
      res.redirect('/admin/navigationPage/')
  }).catch((y)=>{
      console.log(y)
  })
})


app.get("/admin/product",function(req,res){
  res.render("product")
})

app.get("/admin/productView",function(req,res){
  products.find({}).then(function (foundproducts) {
  res.render("adminProductView", {products: foundproducts})
});
})
 
app.get("/admin/productUpdate/:id",function(req,res){
  products.findById(req.params.id).then(function (foundprods) {
  res.render("adminUpdateProduct",{p:foundprods})
  });
})
app.get("/adminOrder",function(req,res){
  Order.find({}).then(function (foundorder) {
    res.render("order", {orders: foundorder})
  });
})
app.get("/product/:id",function(req,res){
  products.findById(req.params.id).then(function (foundprods) {
  res.render("singleProduct",{p:foundprods})
  });
})
// app.get("/order/:id",function(req,res){
//   Order.findById(req.params.id).then(function (foundorder) {
//   res.render("singleOrder",{p:foundorder})
//   });
// })
module.exports = app;
