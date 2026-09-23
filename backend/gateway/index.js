import express from "express"
import dotnev from "dotenv"
import proxy from "express-http-proxy"
dotnev.config()

const port = process.env.PORT ;

const app = express()

app.use(express.json())

app.use("/auth" , proxy(process.env.AUTH_SERVICE))

app.get("/" , (req , res)=>{
    res.status(201).json({
        message : "Hello from gateway"
    })
})

app.listen(port , ()=>{
    console.log(`Gateway started ${port}`)
})