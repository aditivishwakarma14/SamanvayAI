import express from "express"
import dotnev from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
import {getCurrentUser} from "./controllers/user.controller.js"
import protect from "./middleware/auth.middleware.js"
import { proxyWithHeader } from "./utils/proxyWithHeader.js"
import morgan from "morgan"
dotnev.config()

const port = process.env.PORT ;

const app = express()
app.use(express.json())


app.use(cors({
    origin : process.env.FRONTEND_URL ,
    credentials : true
}))

app.use(morgan("dev"))

app.use(cookieParser())


app.use("/api/auth" , proxy(process.env.AUTH_SERVICE))
app.use("/api/chat" , protect , proxyWithHeader(process.env.CHAT_SERVICE ))
app.use("/api/agent" , protect , proxy(process.env.AGENT_SERVICE ))

app.get("/api/me" , protect , getCurrentUser)

app.get("/" , (req , res)=>{
    res.status(201).json({
        message : "Hello from gateway"
    })
})

app.listen(port , ()=>{
    console.log(`Gateway started ${port}`)
})