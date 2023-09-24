//jshint esversion:6
require('dotenv').config()
const dotenv=require('dotenv');
require('mongodb')
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const findOrCreate = require("mongoose-findorcreate");
let multer=require('multer')
let methodOverride = require('method-override')

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride('_method'))

mongoose.set('strictQuery', true); mongoose.connect('mongodb://127.0.0.1/webDB');
mongoose.set('strictQuery', false);

// MAIN //
//HEADER DATABASE//
const HeaderMenuSchema = new mongoose.Schema ({
  title: String,
  sub_title: [{sub_title:String}]
});
const headerMenu=  mongoose.model("headerMenu", HeaderMenuSchema);
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

const pageSchema = new mongoose.Schema({
  PageUrl : String,
  PageNavText : String,
  PageTitle : String,
  PageMetaDescrition : String,
  PageMetaKeyword : String,
  PageHeading : String,
  PagePhoto : String,
  PageDetails : String
  });
  const  pageModel = mongoose.model('dynamicPages', pageSchema)

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
  headerMenu.find({}).then(function (founditems) {
  res.render("home", {titles: founditems});
  });

});
app.get("/favouriteItem",function(req,res){
  res.render("favoriteItems");
});
app.get("/shoppingCart",function(req,res){
  res.render("shoppingCart");
});
app.get("/personalAccount",function(req,res){
  res.render("personalAccount");
});
app.get("/BlogMainPage", async (req, res) => {
  pageModel.find({})
  .then((x)=>{
      res.render('Blog', {x})
  })
});
app.get("/BlogMainPage/:id", async (req, res) => {
  pageModel.findOne({PageUrl :req.params.id})
  .then((y)=>{
    console.log(y)
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
      // console.log(y)
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
}
})

app.delete('/admin/pages/delete-pages/:id', (req, res)=>{
  pageModel.deleteOne({PageUrl:req.params.id})
  .then((x)=>{
      res.redirect('/admin/navigationPage/')
  }).catch((y)=>{
      console.log(y)
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
