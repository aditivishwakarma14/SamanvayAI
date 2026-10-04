import express from "express"
import dotnev from "dotenv"
import connectToDB from "./config/db.js";
import router from "./routes/auth.route.js";
import cors from "cors";

dotnev.config()

const port = process.env.PORT ;

const app = express()

app.use(
  cors({
    origin: "https://d2d9savvtvd89l.cloudfront.net",
    credentials: true,
  })
);


app.use(express.json())
app.use("/" , router)



app.get("/" , (req , res)=>{
    res.status(201).json({
        message : "Hello from auth"
    })
})

app.listen(port , ()=>{
    connectToDB()
    console.log(`Auth started ${port}`)
})