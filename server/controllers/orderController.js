const Order = require("../models/Order");
const Product = require("../models/Product");

async function createOrder(req, res) {
  try {
    const { products } = req.body;
    if (!products || !products.length) {
      return res.status(400).json({ message: "No products" });
    }
    const lines = [];
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const qty = Number(item.qty);
      if (qty < 1 || product.stock < qty) {
        return res.status(400).json({ message: "Invalid qty" });
      }
      const price = product.price;
      lines.push({ productId: product._id, qty, price });
      totalAmount += price * qty;
    }
    for (const line of lines) {
      await Product.findByIdAndUpdate(line.productId, { $inc: { stock: -line.qty } });
    }
    const order = await Order.create({
      userId: req.user._id,
      products: lines,
      totalAmount,
      status: "pending",
    });
    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

async function getOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};
