// api/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";

// Load environment variables
dotenv.config();

// DB connection
import connectDB from "../configs/db.js";

// Routes
import authRoutes from "../routes/authRoutes.js";
import roomRoutes from "../routes/roomRoutes.js";
import bookingRoutes from "../routes/bookingRoutes.js";

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Handle __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/rooms", roomRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/uploads", express.static(path.resolve(__dirname, "../public/uploads")));

app.get("/", (req, res) => res.send("API running 🚀"));

// Local development server (only when not in serverless env)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running locally at http://localhost:${PORT}`)
  );
}

// Export for Vercel serverless
export const handler = serverless(app);
