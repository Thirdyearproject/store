let mongoose = require('mongoose');
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
const pageModel = mongoose.model('dynamicPages', pageSchema)
module.exports = pageModel