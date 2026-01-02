// api/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

// IMPORTANT: NO /api prefix here
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API running on Vercel 🚀");
});


export const handler = serverless(app);



// // api/index.js
//   import express from "express";
//   import dotenv from "dotenv";
//   import cors from "cors";
//   import path from "path";
//   import { fileURLToPath } from "url";
//   import serverless from "serverless-http";

//   // Load environment variables
//   dotenv.config();

//   // DB connection
//   import connectDB from "../configs/db.js";

//   // Routes
//   import authRoutes from "../routes/authRoutes.js";
//   import roomRoutes from "../routes/roomRoutes.js";
//   import bookingRoutes from "../routes/bookingRoutes.js";

//   // Connect to MongoDB
//   connectDB();

//   const app = express();

//   app.use(cors({ origin: "*" }));
//   app.use(express.json());


//   // console.log("ENV - ",process.env.MONGODB_URI)

//   // Handle __dirname for ES modules
//   // const __filename = fileURLToPath(import.meta.url);
//   // const __dirname = path.dirname(__filename);

//   // Routes
//   app.use("/api/auth", authRoutes);
//   app.use("/api/rooms", roomRoutes);
//   app.use("/api/bookings", bookingRoutes);
//   // app.use("/uploads", express.static(path.resolve(__dirname, "../public/uploads")));

//   app.get("/", (req, res) => res.send("API running 🚀"));

//   // Local development server (only when not in serverless env)
//   if (process.env.NODE_ENV !== "production") {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () =>
//       console.log(`Server running locally at http://localhost:${PORT}`)
//     );
//   }

//   // Export for Vercel serverless
//   export const handler = serverless(app);
