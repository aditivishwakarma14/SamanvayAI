import mongoose from "mongoose";

const connectToDB = async ()=> {

    try{

    await mongoose.connect(process.env.MONGO_URI)
    console.log("Database connected in agent")

    }catch(error){

    console.error("error on connection of database in agent" , error.message)
    }

}

export default connectToDB ;  