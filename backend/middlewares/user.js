const User=require('../models/user')

const jwt=require('jsonwebtoken');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

//checks if user authenticated or not
exports.isAuthenticatedUser=catchAsyncErrors(async(req,res,next)=>{
    const { token } = req.cookies
    if(!token){
        return next(new ErrorHandler('Please login first to access this resource',401))
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=await User.findById(decoded.id);
    next()
})

//Handling user roles
exports.authorizedRoles=(...roles)=>{
    return (req,res,next)=>{
        if(roles.includes(req.user.role)=="user"){
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allowed to access the resource`,403)
        )}
        next()
    }
}