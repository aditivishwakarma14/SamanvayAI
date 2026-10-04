import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from "mongoose";

const connectToDB = async ()=> {

    try{

    await mongoose.connect(process.env.MONGO_URI)
    console.log("Database connected in auth")

    }catch(error){

    console.error("eroor on connection of databse in autn" , error.message)
    }

}

export default connectToDB ;  