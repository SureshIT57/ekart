import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext";

export default function Cart() {
  const { items, updateQty, remove, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Cart</h1>
        <div className="empty">Cart is empty</div>
        <Link className="btn" to="/">
          Home
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Cart</h1>
      {items.map((item) => (
        <div className="cart-row" key={item.productId}>
          <div>
            <div>{item.name}</div>
            <div className="kicker">{item.price}</div>
          </div>
          <input
            type="number"
            min="1"
            value={item.qty}
            onChange={(e) => updateQty(item.productId, e.target.value)}
          />
          <div className="price">{item.price * item.qty}</div>
          <button className="btn btn-ghost" type="button" onClick={() => remove(item.productId)}>
            Remove
          </button>
        </div>
      ))}
      <div className="total">
        <span>Total</span>
        <span>{total}</span>
      </div>
      <Link className="btn btn-accent" to="/checkout">
        Checkout
      </Link>
    </div>
  );
}
