//creat and save token and save in cookie 
const sendToken=(user,statusCode,res, redirectRoute)=>{

    //create jwt token
    const token=user.getJwtToken();

    //cookie options
    const options={
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRES_TIME*24*60*60*1000
        ),
        httpOnly:true
    }
    if(user.role=="admin"){  
    if (statusCode === 200 && redirectRoute) {
        res.render("personalAccount",{t:true})
      }else{
        console.log("No redirect route provided.");
        res.status(statusCode).cookie('token',token,options).json({
            success:true,
            token,
            user
        })
      }
    }else{
        if (statusCode === 200 && redirectRoute) {
            res.redirect(redirectRoute);
          }else{
            console.log("No redirect route provided.");
            res.status(statusCode).cookie('token',token,options).json({
                success:true,
                token,
                user
            })
          }
    }
}
module.exports=sendToken;