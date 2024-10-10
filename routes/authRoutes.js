const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/authController");
const { authenticateJWT } = require("../middleware/authMiddleware"); // Middleware to protect routes

const router = express.Router();

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route for getting the current authenticated user
router.get("/me", authenticateJWT, getCurrentUser); // Protected route

module.exports = router;
