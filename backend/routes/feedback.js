const express = require("express")
const { body } = require("express-validator")
const { submitFeedback, getDoctorFeedback, getAppointmentFeedback } = require("../controllers/feedbackController")
const { auth, requireRole } = require("../middleware/auth")

const router = express.Router()

// Submit feedback (Patient only)
router.post(
  "/",
  [
    auth,
    requireRole(["Patient"]),
    body("appointmentId").isMongoId().withMessage("Valid appointment ID is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment").optional().isLength({ max: 150 }).withMessage("Comment must not exceed 150 characters"),
  ],
  submitFeedback,
)

// Get doctor feedback
router.get("/doctor/:doctorId", auth, getDoctorFeedback)

// Get appointment feedback
router.get("/appointment/:appointmentId", auth, getAppointmentFeedback)

module.exports = router
