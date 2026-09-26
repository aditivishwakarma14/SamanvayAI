import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";
import router from "./routes/agent.route.js";

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use("/", router);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from agent"
  });
});

app.listen(port, () => {
  connectToDB();
  console.log(`agent started ${port}`);
});