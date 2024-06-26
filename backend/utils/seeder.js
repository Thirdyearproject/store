const Product=require('../models/product');
const dotenv=require('dotenv');
const connectDatabase=require('../config/database');

const products=require('../data/products');
const{connect}=require('mongoose');

dotenv.config({path:'backend/config/config.env'})

connectDatabase();

const seedProducts=async()=>{
    try{
        await Product.deleteMany();
        console.log('Products deleted');

        await Product.insertMany(products);
        console.log('All products added')

        process.exit();

    }catch(error){
        console.log(error.message);
        process.exit();
    }
}

seedProducts()