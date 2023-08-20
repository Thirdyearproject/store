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

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

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

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
