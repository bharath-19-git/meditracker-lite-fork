const express = require("express");
const { body } = require("express-validator");
const {
  createAppointment,
  getAppointments,
  getPendingAppointments,
  acceptAppointment,
  updateAppointmentStatus,
  addPrescription,
  getDoctors,
} = require("../controllers/appointmentController");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Get all doctors
router.get("/doctors", auth, getDoctors);

// Create appointment (Patient only)
router.post(
  "/",
  [
    auth,
    requireRole(["Patient"]),
    body("preferredDoctor")
      .notEmpty()
      .withMessage("Preferred doctor is required")
      .isMongoId()
      .withMessage("Valid doctor ID is required"),
    body("appointmentDate")
      .notEmpty()
      .withMessage("Appointment date is required")
      .isISO8601()
      .withMessage("Valid appointment date is required"),
    body("appointmentTime")
      .notEmpty()
      .withMessage("Appointment time is required")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Valid time format required (HH:MM)"),
    body("healthConcern")
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage("Health concern must be between 10 and 200 characters"),
  ],
  createAppointment
);

// Get appointments
router.get("/", auth, getAppointments);

// Get pending appointments (Doctor only)
router.get("/pending", auth, requireRole(["Doctor"]), getPendingAppointments);

// Accept appointment (Doctor only)
router.put("/:id/accept", auth, requireRole(["Doctor"]), acceptAppointment);

// Update appointment status (Doctor only)
router.put(
  "/:id/status",
  [
    auth,
    requireRole(["Doctor"]),
    body("status")
      .isIn(["In Progress", "Completed"])
      .withMessage("Invalid status"),
  ],
  updateAppointmentStatus
);

// Add prescription (Doctor only)
router.put(
  "/:id/prescription",
  [
    auth,
    requireRole(["Doctor"]),
    body("medicineName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Medicine name is required"),
    body("dosage")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Dosage is required"),
    body("frequency")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Frequency is required"),
  ],
  addPrescription
);

module.exports = router;
