const jwt=require("jsonwebtoken")
const Register=require("../models/register")
const auth=async(req,res,next)=>{
    try{
     const token=req.cookies.jwtt;
     const tokenData=jwt.verify(token,process.env.SECRET_KEY)
    //  console.log(tokenData)
     const data=await Register.findOne({_id:tokenData._id})
     req.data=data
     req.tokens=token
    //  console.log(data)
     next()
    }catch(e){
        res.status(401).send(e)
    }
    
}
module.exports=auth;