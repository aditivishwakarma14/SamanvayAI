import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is missing");
    }

    console.log(
      "MongoDB target:",
      uri.replace(/\/\/.*@/, "//***@")
    );

    await mongoose.connect(uri);

    console.log("Database connected in agent");
  } catch (error) {
    console.error(
      "error on connection of database in agent:",
      error.message
    );

    throw error;
  }
};

export default connectToDB;