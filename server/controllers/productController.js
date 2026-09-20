const Product = require("../models/Product");

async function getProducts(req, res) {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    const products = await Product.find(filter);
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

async function getProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

async function createProduct(req, res) {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

async function updateProduct(req, res) {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, imageUrl },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
