// const express=require("express")
const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/registrationForm").then(()=>{
    console.log("db created")
}).catch(()=>{
    console.log(e)
})