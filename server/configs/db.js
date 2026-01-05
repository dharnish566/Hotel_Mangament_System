import mongoose from "mongoose";

let cached = globalThis.mongoose || { conn: null, promise: null };
globalThis.mongoose = cached;

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  cached.promise =
    cached.promise ||
    mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
