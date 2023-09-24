const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'enter product name'],
        trim: true,
        maxlength:[100,'product name within 100 char']
    
    },
    price:{
        type:Number,
        required:[true,'enter product price'],
        maxlength:[5,'price cannot exid 5 char'],
        default:0.00
    },
    description:{
        type:String,
        required:[true,'enter product description'],
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type:String,
                required:true
            },
        }
    ],
    category:{
        type:String,
        required:[true,'choose catagory of product'],
        /*enum:{
            values:[
                "women",
                "men",
                "shoe"
            ],
            message:'select correct category'
        }*/
    },
    seller:{
        type:String,
        required:[true,'product seller']
    },
    stock:{
        type:Number,
        required:[true,'enter product stock'],
        maxLength:[5,'max 5 char'],
        default:0
    },
    numofReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports=mongoose.model('product',productSchema);