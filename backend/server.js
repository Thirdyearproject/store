const app=require('../app')
const connectDatabase=require('./config/database');
import Razorpay from 'razorpay';

const dotenv=require('dotenv');

//razorpay
export const instance=new Razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_API_SECRET
})

//handle uncaught exceptions
process.on('uncaughtException',err=>{
    console.log(`ERROR : ${err.message}`);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1);
})

//SETTING UP CONFIG FILE
dotenv.config({path:'backend/config/config.env'})

//CONNECTING TO DATABASE
connectDatabase();

const server=app.listen(process.env.PORT, () =>{
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

//handle unhandles promise rejection
process.on('unhandledRejection',err=>{
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to unhandles promise rejection');
    server.close(()=>{
        process.exit(1);
    })
})