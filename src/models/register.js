const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const clientSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    },
    confirmpassword:{
        type:String,
        required:true,
       
    },
    tokens:[{
     token:{
        type:String,
        required:true
     }
    }]
})

 clientSchema.methods.gettokens=async function(){
    const token=await jwt.sign({_id:this._id},process.env.SECRET_KEY,{expiresIn:"10 minutes"})
    // console.log("token generated",token)
   this.tokens=this.tokens.concat({token:token})
   await this.save()
   return token
 }

clientSchema.pre("save",async function(next){
    if(this.isModified("password")){
        // console.log("the password is",this.password)
       this.password=await bcrypt.hash(this.password,10)
    //    console.log("the hash password is",this.password)
       this.confirmpassword=await bcrypt.hash(this.confirmpassword,10);
    }

    next()
})
const Register=new mongoose.model("Register",clientSchema)
module.exports=Register