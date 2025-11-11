// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

  app.use("/api/auth", authRoutes);

// a protected test route
import { requireAuth } from "./middleware/authMiddleware.js";
app.get("/api/protected", requireAuth, (req, res) => {
  res.json({ message: "You reached a protected route", user: req.user });
});

// Simple test route
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
