import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
// hum firebase se authetication  karenge

firebaseUid : {
    type : String ,
    unique : true
    },
    name : String ,
    email : String ,
    avatar : String

}, {timestamps : true})

const userModel =  mongoose.model("User" , userSchema) ;

export default userModel 