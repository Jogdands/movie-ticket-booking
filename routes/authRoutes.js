const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const router = express.Router();

/* ================= CREATE ADMIN (ONE TIME) ================= */
router.get("/create", async (req, res) => {
  const hashedPassword = await bcrypt.hash("1234", 10);

  const admin = new Admin({
    username: "admin",
    password: hashedPassword
  });

  await admin.save();

  res.json({ message: "Admin created" });
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.json({ success: false, message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.json({ success: false, message: "Wrong password" });
  }

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ success: true, token });
});

module.exports = router;