import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const placeOrder = async () => {
    try {
      await api.post("/orders", {
        products: items.map((item) => ({
          productId: item.productId,
          qty: item.qty,
        })),
      });
      clear();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Checkout</h1>
        <div className="empty">Cart is empty</div>
      </div>
    );
  }

  return (
    <div className="page split">
      <div className="card pad">
        <h1>Checkout</h1>
        <div className="kicker">Ship to</div>
        <div>{user.name}</div>
        <div>{user.email}</div>
        <div>{user.address}</div>
      </div>
      <div>
        {items.map((item) => (
          <div className="cart-row" key={item.productId}>
            <div>
              {item.name} · {item.qty} × {item.price}
            </div>
          </div>
        ))}
        <div className="total">
          <span>Total</span>
          <span>{total}</span>
        </div>
        {error ? <div className="error">{error}</div> : null}
        <button className="btn btn-accent" type="button" onClick={placeOrder}>
          Place order
        </button>
      </div>
    </div>
  );
}
