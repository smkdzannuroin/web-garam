const express = require("express");
const router = express.Router();

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "admin123") {
    return res.json({
      token: "token123",
      user: {
        name: "Administrator",
        role: "admin",
      },
    });
  }

  res.status(401).json({
    message: "Email atau password salah",
  });
});

// REGISTER
router.post("/register", (req, res) => {
  res.json({
    message: "Registrasi berhasil",
  });
});

// FORGOT PASSWORD
router.post("/forgot-password", (req, res) => {
  res.json({
    message: "Link reset password telah dikirim",
  });
});

module.exports = router;
