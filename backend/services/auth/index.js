import express from "express"
import dotnev from "dotenv"
import connectToDB from "./config/db.js";
dotnev.config()

const port = process.env.PORT ;

const app = express()

app.get("/" , (req , res)=>{
    res.status(201).json({
        message : "Hello from auth"
    })
})

app.listen(port , ()=>{
    connectToDB()
    console.log(`Auth started ${port}`)
})