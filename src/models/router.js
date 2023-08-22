const express=require("express")
const mongoose=require('mongoose')
const bcrypt=require("bcryptjs")
const router=new express.Router()
const Register=require("./register")
const auth=require("../middleware/auth")
router.get("",(req,res)=>{
    res.render("register")
})
router.get("/login",(req,res)=>{
    res.render("login")
})
router.get("/secret",auth,(req,res)=>{
  // console.log(`the cookie is${req.cookies.jwtt}`)
    res.render("secret")
})
router.get("/logout", auth,async (req,res)=>{
  // console.log(`the cookie is${req.cookies.jwtt}`)
   try {
    res.clearCookie("jwtt")
    // single log out -----------------
    // req.data.tokens=req.data.tokens.filter((element)=>{
    //   return req.tokens != element.token
    // })
    // logout from all devices------------
    req.data.tokens=[]
    await req.data.save()
    res.render("register")
   } catch (error) {
    
   }
})
router.get("/register",(req,res)=>{
    res.render("register")
})
router.post("/register",async (req,res)=>{
    try{
        const password=req.body.password
        const cpassword=req.body.confirmpassword
        if(password===cpassword){
          const data=new Register({
            username:req.body.username,
            email:req.body.email,
            password:password,
            confirmpassword:cpassword,
          })
      //  jwt authentication   
      const token=await data.gettokens()
      res.cookie("jwtt",token,{expires:new Date(Date.now()+30000),httpOnly:true})
      // console.log("i get the token ",token)
       const result=await data.save() 
      //  console.log("page result ", result)
       res.render("index")  
     
    } else{
        res.status(404).send("page not found") 
      }
    }catch(e){
        res.status(404).send("pagewaswrong found")
    }
})
router.post("/login",async (req,res)=>{
    try{
        const loginemail=req.body.email
        const password=req.body.password
        const detail=await Register.findOne({email:loginemail})
        // console.log(detail.password)
        // console.log(typeof password)
        const isMathch=await bcrypt.compare(password,detail.password)
        const token=await detail.gettokens()
        res.cookie("jwtt",token,{expires:new Date(Date.now()+30000),httpOnly:true})
        // console.log(cookie)
        // console.log("login token ",token)
  if(isMathch){
    res.render("index")
  }   
     else{
        res.status(404).send("invalid login detail") 
      }
    }catch(e){
        res.status(404).send("page not found")
    }
})
module.exports=router;