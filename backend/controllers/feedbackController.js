const Feedback = require("../models/Feedback")
const Appointment = require("../models/Appointment")
const { validationResult } = require("express-validator")

const submitFeedback = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { appointmentId, rating, comment } = req.body

    // Verify appointment exists and is completed
    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    if (appointment.status !== "Completed") {
      return res.status(400).json({ message: "Feedback can only be submitted for completed appointments" })
    }

    // Verify the patient is the one who booked the appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only submit feedback for your own appointments" })
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ appointment: appointmentId })
    if (existingFeedback) {
      return res.status(400).json({ message: "Feedback has already been submitted for this appointment" })
    }

    const feedback = new Feedback({
      appointment: appointmentId,
      patient: req.user._id,
      doctor: appointment.doctor,
      rating,
      comment: comment || "",
    })

    await feedback.save()
    await feedback.populate(["patient", "doctor", "appointment"])

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    })
  } catch (error) {
    console.error("Submit feedback error:", error)
    res.status(500).json({ message: "Server error while submitting feedback" })
  }
}

const getDoctorFeedback = async (req, res) => {
  try {
    const { doctorId } = req.params

    const feedback = await Feedback.find({ doctor: doctorId })
      .populate("patient", "name")
      .populate("appointment", "appointmentDate")
      .sort({ createdAt: -1 })

    // Calculate average rating
    const totalRating = feedback.reduce((sum, fb) => sum + fb.rating, 0)
    const averageRating = feedback.length > 0 ? (totalRating / feedback.length).toFixed(1) : 0

    res.json({
      feedback,
      averageRating: Number.parseFloat(averageRating),
      totalFeedback: feedback.length,
    })
  } catch (error) {
    console.error("Get doctor feedback error:", error)
    res.status(500).json({ message: "Server error while fetching feedback" })
  }
}

const getAppointmentFeedback = async (req, res) => {
  try {
    const { appointmentId } = req.params

    const feedback = await Feedback.findOne({ appointment: appointmentId })
      .populate("patient", "name")
      .populate("doctor", "name")

    res.json(feedback)
  } catch (error) {
    console.error("Get appointment feedback error:", error)
    res.status(500).json({ message: "Server error while fetching appointment feedback" })
  }
}

module.exports = {
  submitFeedback,
  getDoctorFeedback,
  getAppointmentFeedback,
}
