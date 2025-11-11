import React, { useEffect, useState } from "react";
import API from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF6384'];

export default function Summary({ filters, refresh }) {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({ totalIncome:0, totalExpense:0, balance:0 });

  useEffect(()=>{
    const fetch = async () => {
      try {
        const params = {};
        if (filters?.startDate) params.startDate = filters.startDate;
        if (filters?.endDate) params.endDate = filters.endDate;
        const res = await API.get("/api/transactions/summary", { params });
        setTotals(res.data.totals || {});
        const cats = (res.data.categories || []).map((c,i)=>({ name:c.category, value: Math.abs(c.total), fill: COLORS[i % COLORS.length] }));
        setData(cats);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [filters, refresh]);

  return (
    <div className="card p-3">
      <h6>Summary</h6>
      <div className="mb-2">
        <div><strong>Balance:</strong> {totals.balance ?? 0}</div>
        <div><strong>Total Income:</strong> {totals.totalIncome ?? 0}</div>
        <div><strong>Total Expense:</strong> {totals.totalExpense ?? 0}</div>
      </div>

      <div style={{ width: '100%', height: 250 }}>
        <PieChart width={300} height={250}>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={70} label>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
