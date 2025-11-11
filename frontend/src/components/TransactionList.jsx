import React from "react";
import API from "../services/api";

export default function TransactionList({ transactions, onChanged }) {
  const remove = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      await API.delete(`/api/transactions/${id}`);
      if (onChanged) onChanged();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const editAmount = async (tx) => {
    const newAmount = prompt("New amount", tx.amount);
    if (newAmount === null) return;
    try {
      await API.put(`/api/transactions/${tx._id}`, { amount: Number(newAmount) });
      if (onChanged) onChanged();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  if (!transactions?.length) return <div className="card p-3">No transactions</div>;

  return (
    <div className="card p-3">
      <h6>Transactions</h6>
      <table className="table table-sm">
        <thead><tr><th>Date</th><th>Desc</th><th>Category</th><th className="text-end">Amount</th><th></th></tr></thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx._id}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.description}</td>
              <td>{tx.category}</td>
              <td className="text-end">{tx.amount}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-secondary me-1" onClick={()=>editAmount(tx)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(tx._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
