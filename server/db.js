import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    throw err;
  }
};
