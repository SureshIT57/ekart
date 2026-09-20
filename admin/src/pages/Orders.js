import React, { useEffect, useState } from "react";
import api from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
      setError("");
    } catch (err) {
      setError("Could not load orders");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      load();
    } catch (err) {
      setError("Update failed");
    }
  };

  return (
    <div className="main">
      <h1>Orders</h1>
      {error ? <div className="error">{error}</div> : null}
      {orders.map((order) => (
        <div className="row" key={order._id}>
          <div>
            <div className="muted">{order._id}</div>
            <div>{new Date(order.createdAt).toLocaleString()}</div>
            {order.products.map((line) => (
              <div key={line.productId} className="muted">
                {line.qty} × {line.price}
              </div>
            ))}
          </div>
          <b>{order.totalAmount}</b>
          <select
            className="select"
            value={order.status}
            onChange={(e) => updateStatus(order._id, e.target.value)}
          >
            <option value="pending">pending</option>
            <option value="shipped">shipped</option>
            <option value="delivered">delivered</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}
