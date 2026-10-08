import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { getCurrentUser } from "./controllers/user.controller.js"
import protect from "./middleware/auth.middleware.js"
import { proxyWithHeader } from "./utils/proxyWithHeader.js"
import morgan from "morgan"
const port =process.env.PORT

const app=express()
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(morgan("dev"))
app.use(cookieParser())
app.use("/api/auth",proxy(process.env.AUTH_SERVICE))
app.use("/api/chat",protect,proxyWithHeader(process.env.CHAT_SERVICE))
app.use("/api/agent",protect,proxyWithHeader(process.env.AGENT_SERVICE))
app.use("/api/billing",protect,proxyWithHeader(process.env.BILLING_SERVICE))
app.get("/api/me",protect,getCurrentUser)

const here = path.dirname(fileURLToPath(import.meta.url))
const publicDir = process.env.FRONTEND_DIST || path.resolve(here, "../public")

if (fs.existsSync(path.join(publicDir, "index.html"))) {
    app.use(express.static(publicDir))
    app.get(/^\/(?!api\/).*/, (req,res)=>{
        res.sendFile(path.join(publicDir, "index.html"))
    })
} else {
    app.get("/",(req,res)=>{
        res.json({message:"hello from gateway v5"})
    })
}

app.listen(port,()=>{
    console.log(`gateway started at ${port}`)
})