const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { auth, admin } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/mine", auth, getMyOrders);
router.get("/", auth, admin, getOrders);
router.put("/:id", auth, admin, updateOrderStatus);

module.exports = router;
