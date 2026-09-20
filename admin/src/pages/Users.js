import React, { useEffect, useState } from "react";
import api from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
        setUsers(res.data);
        setError("");
      })
      .catch(() => setError("Could not load users"));
  }, []);

  return (
    <div className="main">
      <h1>Users</h1>
      {error ? <div className="error">{error}</div> : null}
      {users.map((user) => (
        <div className="row" key={user._id}>
          <div>
            <div>{user.name}</div>
            <div className="muted">{user.email}</div>
          </div>
          <span className="pill">{user.role}</span>
          <div className="muted">{user.address}</div>
        </div>
      ))}
    </div>
  );
}
