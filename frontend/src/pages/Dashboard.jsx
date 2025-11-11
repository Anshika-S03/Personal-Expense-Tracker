import React, { useEffect, useState } from "react";
import API from "../services/api";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Summary from "../components/Summary";

export default function Dashboard(){
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({ startDate: "", endDate: "", category: "" });
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(()=> {
    const fetchData = async () => {
      try {
        const params = {};
        if (filter.startDate) params.startDate = filter.startDate;
        if (filter.endDate) params.endDate = filter.endDate;
        if (filter.category) params.category = filter.category;
        const res = await API.get("/api/transactions", { params });
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [filter, refreshFlag]);

  const onAdded = () => setRefreshFlag(f=>f+1);
  const onDeletedOrUpdated = () => setRefreshFlag(f=>f+1);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Expense Tracker</h4>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <TransactionForm onAdded={onAdded} />
          <Summary filters={filter} refresh={refreshFlag} />
        </div>

        <div className="col-lg-8">
          <div className="card p-3 mb-3">
            <h6>Filters</h6>
            <div className="row g-2">
              <div className="col-4"><input className="form-control" type="date" value={filter.startDate} onChange={e=>setFilter({...filter, startDate:e.target.value})} /></div>
              <div className="col-4"><input className="form-control" type="date" value={filter.endDate} onChange={e=>setFilter({...filter, endDate:e.target.value})} /></div>
              <div className="col-4"><input placeholder="Category" className="form-control" value={filter.category} onChange={e=>setFilter({...filter, category:e.target.value})} /></div>
            </div>
          </div>

          <TransactionList transactions={transactions} onChanged={onDeletedOrUpdated} />
        </div>
      </div>
    </div>
  );
}
