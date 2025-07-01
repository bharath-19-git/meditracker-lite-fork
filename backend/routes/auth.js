const express = require("express")
const { body } = require("express-validator")
const { register, login, getProfile } = require("../controllers/authController")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Register route
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("role").isIn(["Patient", "Doctor"]).withMessage("Role must be either Patient or Doctor"),
  ],
  register,
)

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  login,
)

// Get profile route
router.get("/profile", auth, getProfile)

module.exports = router
