const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

function normalizeMongoUri(raw) {
  if (raw == null || raw === "") return "";
  let uri = String(raw).trim();
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1).trim();
  }
  return uri;
}

function mongoUriLooksValid(uri) {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}

function redactMongoUri(uri) {
  if (!uri) return "(empty)";
  return uri.replace(/:\/\/([^:/@]+):([^@]+)@/, "://$1:***@");
}

const MONGODB_URI =
  normalizeMongoUri(process.env.MONGODB_URI) || "mongodb://127.0.0.1:27017/ekart";

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
  if (!mongoUriLooksValid(MONGODB_URI)) {
    console.error(
      "mongo connect failed Invalid scheme. Set MONGODB_URI to a full Atlas string starting with mongodb+srv:// (no quotes). Current:",
      redactMongoUri(MONGODB_URI)
    );
    setTimeout(connectMongo, 15000);
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("mongo connected");
  } catch (err) {
    console.error("mongo connect failed", err.message, redactMongoUri(MONGODB_URI));
    setTimeout(connectMongo, 5000);
  }
}

connectMongo();
