// configs/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables (important for db.js to get MONGODB_URI)
dotenv.config({ path: '../.env' });

let cached = globalThis.mongoose || { conn: null, promise: null };
globalThis.mongoose = cached;

const connectDB = async () => {
  if (cached.conn) {
    console.log("DB already connected ✔");
    return cached.conn;
  }

  try {
    console.log("DB Connecting to:", process.env.MONGODB_URI); // Debug log

    cached.promise =
      cached.promise ||
      mongoose.connect(process.env.MONGODB_URI, {
        bufferCommands: false,
      });

    cached.conn = await cached.promise;

    console.log("MongoDB Connected Successfully 🚀");
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
