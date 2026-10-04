import "dotenv/config";

import express from "express";
import connectToDB from "./config/db.js";
import router from "./routes/agent.route.js";

const port = process.env.PORT || 8003;

const app = express();

app.use(express.json());

app.use("/", router);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from agent",
  });
});

app.use((err, req, res, next) => {
  console.error("Agent error:", err);

  if (err.status) {
    return res.status(err.status).json(err.data);
  }

  return res.status(500).json({
    message: "Internal agent server error",
  });
});

const startServer = async () => {
  try {
    await connectToDB();

    app.listen(port, () => {
      console.log(`agent started ${port}`);
    });
  } catch (error) {
    console.error("Agent startup failed:", error.message);
    process.exit(1);
  }
};

startServer();