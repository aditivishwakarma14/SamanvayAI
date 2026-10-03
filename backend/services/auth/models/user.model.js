import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
// hum firebase se authetication  karenge

firebaseUid : {
    type : String ,
    unique : true
    },
    name : String ,
    email : String ,
    avatar : String,
    plan : {
        type : String ,
        default : "free"
    },
    credits  : {
       type : Number ,
       default : 100
    },
    totalCredits : {
        type : Number ,
        default : 100
    },
    planExpiresAt : Date
    

}, {timestamps : true})

const userModel =  mongoose.model("User" , userSchema) ;

export default userModel 