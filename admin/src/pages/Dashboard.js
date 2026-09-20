import React, { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders")
      .then((res) => {
        setOrders(res.data);
        setError("");
      })
      .catch(() => setError("Could not load sales"));
  }, []);

  const sales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pending = orders.filter((order) => order.status === "pending").length;

  return (
    <div className="main">
      <h1>Dashboard</h1>
      <p className="muted">Sales overview</p>
      {error ? <div className="error">{error}</div> : null}
      <div className="stats">
        <div className="stat">
          Orders
          <b>{orders.length}</b>
        </div>
        <div className="stat">
          Pending
          <b>{pending}</b>
        </div>
        <div className="stat">
          Sales
          <b>{sales}</b>
        </div>
      </div>
    </div>
  );
}
