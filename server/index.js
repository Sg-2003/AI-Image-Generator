import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import PostRouter from "./routes/Posts.js";
import GenerateImageRouter from "./routes/GenerateImage.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/post", PostRouter);
app.use("/api/generateImage", GenerateImageRouter);

// Default route
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "PixelForge API is running!",
  });
});

// Error handler (must be after routes)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  console.error("Error:", message);
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

import { connectDB } from "./db.js";

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("Initial database connection failed:", err);
});

// Function to start the server locally
const startServer = () => {
  try {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server locally:", error);
    process.exit(1);
  }
};

// Start the server if not running on Vercel serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
