const User = require("../models/User");

async function getUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getUsers };
