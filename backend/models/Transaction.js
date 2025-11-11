// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true }, // positive = income, negative = expense
    description: { type: String, trim: true, default: "" },
    date: { type: Date, required: true },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
