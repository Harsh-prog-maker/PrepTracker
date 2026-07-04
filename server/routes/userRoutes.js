const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/register", createUser);
router.post("/login", loginUser);

// protected route
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

module.exports = router;