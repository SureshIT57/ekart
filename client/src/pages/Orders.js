import React, { useEffect, useState } from "react";
import api from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/mine")
      .then((res) => {
        setOrders(res.data);
        setError("");
      })
      .catch(() => setError("Could not load orders"));
  }, []);

  return (
    <div className="page">
      <h1>My orders</h1>
      {error ? <div className="error">{error}</div> : null}
      {orders.length === 0 && !error ? <div className="empty">No orders</div> : null}
      {orders.map((order) => (
        <div className="order" key={order._id}>
          <div>
            <div className="kicker">{order._id}</div>
            <div>{new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <span className="pill">{order.status}</span>
          <div className="price">{order.totalAmount}</div>
          <div>
            {order.products.map((line) => (
              <div key={line.productId}>
                {line.qty} × {line.price}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
