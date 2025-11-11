import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav("/");
    } catch (error) {
      setErr(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3 className="mb-3">Register</h3>
          {err && <div className="alert alert-danger">{err}</div>}
          <form onSubmit={submit}>
            <div className="mb-2">
              <label>Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="form-control" required />
            </div>
            <div className="mb-2">
              <label>Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="form-control" type="email" required />
            </div>
            <div className="mb-2">
              <label>Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} className="form-control" type="password" required />
            </div>
            <button className="btn btn-success w-100">Register</button>
          </form>
          <p className="mt-3">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
