const app=require('./app')
const connectDatabase=require('./config/database');

const dotenv=require('dotenv');

//SETTING UP CONFIG FILE
dotenv.config({path:'backend/config/config.env'})

//CONNECTING TO DATABASE
connectDatabase();

app.listen(process.env.PORT, () =>{
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})