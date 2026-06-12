import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

console.log("Connecting to:", process.env.MONGODB_URL);

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log("Successfully connected to MongoDB");
    try {
      console.log("Testing ping...");
      const admin = new mongoose.mongo.Admin(mongoose.connection.db);
      const result = await admin.ping();
      console.log("Ping result:", result);
      
      console.log("Testing listCollections...");
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log("Collections:", collections);
      
      process.exit(0);
    } catch (e) {
      console.error("Query failed:", e);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
