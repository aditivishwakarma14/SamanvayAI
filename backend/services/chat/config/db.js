import mongoose from "mongoose";

const connectToDB = async ()=> {

    try{

    await mongoose.connect(process.env.MONGO_URI)
    console.log("Database connected in chat")

    }catch(error){

    console.error("error on connection of database in chat" , error.message)
    }

}

export default connectToDB ;  