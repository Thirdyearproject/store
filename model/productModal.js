const mongoose = require('mongoose');

// Define the schema for products
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  ratings: Number,
  images: [{
    public_id: String,
    url: String
  }],
  category: String,
  seller: String,
  stock: Number,
  numOfReviews: Number,
  reviews: []
});

// Create a model named 'productModel' associated with the 'dynamicPages' collection
const productModel = mongoose.model('products', productSchema);

// Export the product model to be used elsewhere in the application
module.exports = productModel;
