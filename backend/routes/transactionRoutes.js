// routes/transactionRoutes.js
import express from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary
} from "../controllers/transactionController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/summary", getSummary);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
