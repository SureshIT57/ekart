import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useCart } from "../CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setError("");
      })
      .catch(() => setError("Not found"));
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <div className="error">{error}</div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="page">
        <div className="note">Loading</div>
      </div>
    );
  }

  return (
    <div className="page split">
      <div className="detail-img">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div>
        <div className="kicker">{product.category}</div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div className="price">{product.price}</div>
        <div className="muted">Stock {product.stock}</div>
        <div className="filters" style={{ marginTop: 16 }}>
          <input
            className="qty"
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
          <button
            className="btn btn-accent"
            type="button"
            onClick={() => {
              add(product, qty);
              setAdded(true);
            }}
            disabled={product.stock < 1}
          >
            {added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
