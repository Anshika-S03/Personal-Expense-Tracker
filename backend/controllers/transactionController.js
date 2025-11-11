// controllers/transactionController.js
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

/** POST /api/transactions */
export const createTransaction = async (req, res) => {
  try {
    const { amount, description, date, category } = req.body;
    if (amount === undefined || !date || !category) {
      return res.status(400).json({ message: "amount, date and category are required" });
    }
    if (isNaN(Number(amount))) return res.status(400).json({ message: "amount must be a number" });

    const tx = new Transaction({
      userId: req.user._id,
      amount,
      description: description || "",
      date: new Date(date),
      category,
    });
    await tx.save();
    return res.status(201).json({ message: "Transaction created", transaction: tx });
  } catch (err) {
    console.error("createTransaction error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/transactions */
export const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    const filter = { userId: req.user._id };

    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23,59,59,999);
        filter.date.$lte = e;
      }
    }

    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    return res.json({ transactions });
  } catch (err) {
    console.error("getTransactions error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/** PUT /api/transactions/:id */
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    if (tx.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

    const { amount, description, date, category } = req.body;
    if (amount !== undefined) tx.amount = amount;
    if (description !== undefined) tx.description = description;
    if (date !== undefined) tx.date = new Date(date);
    if (category !== undefined) tx.category = category;

    await tx.save();
    return res.json({ message: "Transaction updated", transaction: tx });
  } catch (err) {
    console.error("updateTransaction error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/** DELETE /api/transactions/:id */
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    if (tx.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

    await tx.deleteOne();
    return res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("deleteTransaction error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/transactions/summary */
export const getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { userId: req.user._id };

    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) { const e = new Date(endDate); e.setHours(23,59,59,999); match.date.$lte = e; }
    }

    const totalsAgg = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] } },
          balance: { $sum: "$amount" },
        }
      }
    ]);

    const categories = await Transaction.aggregate([
      { $match: match },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $project: { category: "$_id", total: 1, _id: 0 } }
    ]);

    const totals = totalsAgg[0] || { totalIncome: 0, totalExpense: 0, balance: 0 };
    return res.json({ totals, categories });
  } catch (err) {
    console.error("getSummary error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
