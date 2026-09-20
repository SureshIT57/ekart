import React, { useEffect, useState } from "react";
import api from "../api";

const empty = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  imageUrl: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
      setError("");
    } catch (err) {
      setError("Could not load products");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      imageUrl: form.imageUrl,
    };
    try {
      if (editId) {
        await api.put(`/products/${editId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setForm(empty);
      setEditId("");
      load();
    } catch (err) {
      setError("Save failed");
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      imageUrl: product.imageUrl,
    });
  };

  const remove = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      load();
    } catch (err) {
      setError("Delete failed");
    }
  };

  return (
    <div className="main">
      <h1>Products</h1>
      {error ? <div className="error">{error}</div> : null}
      <form className="form-grid panel" onSubmit={submit}>
        <input name="name" value={form.name} onChange={change} placeholder="Name" />
        <input
          name="description"
          value={form.description}
          onChange={change}
          placeholder="Description"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={change}
          placeholder="Price"
        />
        <input
          name="category"
          value={form.category}
          onChange={change}
          placeholder="Category"
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={change}
          placeholder="Stock"
        />
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={change}
          placeholder="Image URL"
        />
        <button className="btn" type="submit">
          {editId ? "Update" : "Add"}
        </button>
        {editId ? (
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => {
              setEditId("");
              setForm(empty);
            }}
          >
            Cancel
          </button>
        ) : null}
      </form>
      {products.map((product) => (
        <div className="row" key={product._id}>
          <div>
            <div>{product.name}</div>
            <div className="muted">
              {product.category} · stock {product.stock}
            </div>
          </div>
          <b>{product.price}</b>
          <div>
            <button className="btn btn-ghost" type="button" onClick={() => startEdit(product)}>
              Edit
            </button>{" "}
            <button className="btn btn-danger" type="button" onClick={() => remove(product._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
