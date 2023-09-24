let mongoose = require('mongoose');

const HeaderMenuSchema = new mongoose.Schema ({
    title: String,
    sub_title: [{sub_title:String}]
  });
  const headerMenu=  mongoose.model("headerMenu", HeaderMenuSchema);
  module.exports = headerMenu