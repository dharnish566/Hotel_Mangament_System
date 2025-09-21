import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http"; // ✅ import serverless-http
dotenv.config();

import connectDB from "../configs/db.js";
import authRoutes from "../routes/authRoutes.js";
import roomRoutes from "../routes/roomRoutes.js";
import bookingRoutes from "../routes/bookingRoutes.js";

connectDB();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/rooms", roomRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/uploads", express.static(path.resolve(__dirname, "../public/uploads")));

app.get("/", (req, res) => res.send("API running"));

// ✅ Export the app for serverless
export default app;

// ✅ Export handler for Vercel
export const handler = serverless(app);

// ✅ Optional: run locally when not in production
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running locally on http://localhost:${PORT}`)
  );
}
