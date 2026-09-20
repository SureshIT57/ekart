const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ekart";

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("listening on", PORT);
});

async function connectMongo() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("mongo connected");
  } catch (err) {
    console.error("mongo connect failed", err.message);
    setTimeout(connectMongo, 5000);
  }
}

connectMongo();
