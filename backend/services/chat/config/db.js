import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);


import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("Database connected in chat");
        return true;

    } catch (error) {
        console.error(
            "error on connection of database in chat:",
            error.message
        );

        return false;
    }
};

export default connectToDB;