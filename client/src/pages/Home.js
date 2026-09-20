import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await api.get("/products", { params });
      setProducts(data);
      setError("");
    } catch (err) {
      setError("Could not load products");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="page">
      <div className="hero">
        <h1>Move in the new drop.</h1>
        <p>Search, filter, and shop a calm storefront with instant cart flow.</p>
      </div>
      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          list="categories"
        />
        <datalist id="categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <button className="btn" type="submit">
          Filter
        </button>
      </form>
      {error ? <div className="error">{error}</div> : null}
      {products.length === 0 && !error ? (
        <div className="empty">No products yet. Add some from Admin.</div>
      ) : null}
      <div className="grid">
        {products.map((product, i) => (
          <div className="card" key={product._id} style={{ animationDelay: `${i * 60}ms` }}>
            <img src={product.imageUrl} alt={product.name} />
            <div className="card-body">
              <div className="kicker">{product.category}</div>
              <div>{product.name}</div>
              <div className="price">{product.price}</div>
              <Link className="btn btn-accent" to={`/product/${product._id}`}>
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
