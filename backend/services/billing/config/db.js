import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from "mongoose"

const connectDb=async ()=>{
    try {
              await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
       console.log("db connected")
    } catch (error) {
       console.log(`db error ${error}`) 
    }
}

export default connectDb