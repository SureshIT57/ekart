const express = require("express");
const { getUsers } = require("../controllers/userController");
const { auth, admin } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, admin, getUsers);

module.exports = router;
