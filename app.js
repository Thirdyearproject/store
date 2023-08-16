//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("home");

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
