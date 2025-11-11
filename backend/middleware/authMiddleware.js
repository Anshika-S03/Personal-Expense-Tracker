// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
    if (!token) return res.status(401).json({ message: "No token provided" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token (user not found)" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
