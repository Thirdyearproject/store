const Product=require('../models/product')

const ErrorHandler=require('../utils/errorHandler');


const Features=('../utils/features');

exports.newProduct=async(req,res,next)=>{  

    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
}



//get products=>/api/v1/products
exports.getProducts=async(req,res,next)=>{


    const features=new Features(Product.find(),req.query).search()


    const products=await features.find();

    res.status(200).json({
        success:true,
        count:products.length,
        products
    })
}

//get seingle product=>/api/v1/admin/product/:id
exports.getSingleProduct=async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }

    res.status(200).json({
        success:true,
        product
    })
}

//update product=>/api/v1/admin/product/:id
exports.updateProduct = async(req,res,next)=>{
    let product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }

    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        //useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })

}

//Delete product=> /api/v1/admin/product/:id
exports.deleteProduct=async(req,res,next)=>{
    const product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }

    await product.remove();

    res.status(200).json({
        success:true,
        message:'product deleted'
    })
}