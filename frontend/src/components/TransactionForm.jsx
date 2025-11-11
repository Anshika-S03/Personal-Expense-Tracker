import React, { useState } from "react";
import API from "../services/api";

export default function TransactionForm({ onAdded }){
  const [amount,setAmount]=useState("");
  const [description,setDescription]=useState("");
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [category,setCategory]=useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/transactions", { amount: Number(amount), description, date, category });
      setAmount(""); setDescription(""); setCategory("");
      if (onAdded) onAdded();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add");
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h6>Add Transaction</h6>
      <form onSubmit={submit}>
        <div className="mb-2">
          <label>Amount (positive income, negative expense)</label>
          <input value={amount} onChange={e=>setAmount(e.target.value)} className="form-control" required />
        </div>
        <div className="mb-2">
          <label>Description</label>
          <input value={description} onChange={e=>setDescription(e.target.value)} className="form-control" />
        </div>
        <div className="mb-2">
          <label>Date</label>
          <input value={date} onChange={e=>setDate(e.target.value)} className="form-control" type="date" required />
        </div>
        <div className="mb-2">
          <label>Category</label>
          <input value={category} onChange={e=>setCategory(e.target.value)} className="form-control" required />
        </div>
        <button className="btn btn-primary w-100">Add</button>
      </form>
    </div>
  );
}
