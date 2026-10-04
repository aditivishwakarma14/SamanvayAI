import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";
import router from "./routes/chat.routes.js";

dotenv.config();

const port = process.env.PORT || 8002;

const app = express();

app.use(express.json());

app.use("/", router);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello from chat",
    });
});

const startServer = async () => {
    const dbConnected = await connectToDB();

    if (!dbConnected) {
        console.error("Chat service started without database connection");
    }

    app.listen(port, () => {
        console.log(`Chat started ${port}`);
    });
};

startServer();