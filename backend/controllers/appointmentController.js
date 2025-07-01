const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { validationResult } = require("express-validator");

const createAppointment = async (req, res) => {
  try {
    console.log("📝 Creating appointment with data:", req.body);
    console.log("👤 User:", req.user);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation errors:", errors.array());
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { preferredDoctor, appointmentDate, appointmentTime, healthConcern } =
      req.body;

    // Verify preferred doctor exists and is a doctor
    const doctor = await User.findById(preferredDoctor);
    if (!doctor || doctor.role !== "Doctor") {
      console.log("❌ Invalid doctor selection:", preferredDoctor);
      return res.status(400).json({ message: "Invalid doctor selection" });
    }

    // Check if patient already has 2 appointments on the same day
    const appointmentDateObj = new Date(appointmentDate);
    const startOfDay = new Date(appointmentDateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDateObj);
    endOfDay.setHours(23, 59, 59, 999);

    console.log("📅 Checking existing appointments for date:", appointmentDate);
    console.log("📅 Date range:", { startOfDay, endOfDay });

    const existingAppointments = await Appointment.countDocuments({
      patient: req.user._id,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    console.log("📊 Existing appointments count:", existingAppointments);

    if (existingAppointments >= 2) {
      return res.status(400).json({
        message: "You cannot book more than 2 appointments on the same day",
      });
    }

    // Validate time format and range
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(appointmentTime)) {
      return res
        .status(400)
        .json({ message: "Invalid time format. Use HH:MM format." });
    }

    const [hours, minutes] = appointmentTime.split(":").map(Number);
    if (hours < 9 || hours >= 17) {
      return res
        .status(400)
        .json({
          message: "Appointment time must be between 9:00 AM and 5:00 PM",
        });
    }

    const appointment = new Appointment({
      patient: req.user._id,
      preferredDoctor,
      appointmentDate: appointmentDateObj,
      appointmentTime,
      healthConcern,
      status: "Pending",
    });

    console.log("💾 Saving appointment:", appointment);

    await appointment.save();
    await appointment.populate(["patient", "preferredDoctor"]);

    console.log("✅ Appointment created successfully:", appointment._id);

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("❌ Create appointment error:", error);
    res.status(500).json({
      message: "Server error while booking appointment",
      error: error.message,
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    console.log(
      "📋 Getting appointments for user:",
      req.user._id,
      "Role:",
      req.user.role
    );

    const query = {};

    if (req.user.role === "Patient") {
      query.patient = req.user._id;
    } else if (req.user.role === "Doctor") {
      // Doctors can see all appointments or just their own based on query param
      if (req.query.mine === "true") {
        query.doctor = req.user._id;
      }
    }

    console.log("🔍 Query:", query);

    const appointments = await Appointment.find(query)
      .populate("patient", "name email")
      .populate("preferredDoctor", "name email")
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    console.log("📊 Found appointments:", appointments.length);

    res.json(appointments);
  } catch (error) {
    console.error("❌ Get appointments error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching appointments" });
  }
};

const getPendingAppointments = async (req, res) => {
  try {
    console.log("⏳ Getting pending appointments");

    const appointments = await Appointment.find({ status: "Pending" })
      .populate("patient", "name email")
      .populate("preferredDoctor", "name email")
      .sort({ createdAt: -1 });

    console.log("📊 Found pending appointments:", appointments.length);

    res.json(appointments);
  } catch (error) {
    console.error("❌ Get pending appointments error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching pending appointments" });
  }
};

const acceptAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("✅ Accepting appointment:", id, "by doctor:", req.user._id);

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Appointment is no longer pending" });
    }

    // Use findOneAndUpdate with conditions to prevent race conditions
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: id, status: "Pending" },
      {
        status: "Confirmed",
        doctor: req.user._id,
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate(["patient", "preferredDoctor", "doctor"]);

    if (!updatedAppointment) {
      return res
        .status(400)
        .json({
          message: "Appointment was already accepted by another doctor",
        });
    }

    console.log(
      "✅ Appointment accepted successfully:",
      updatedAppointment._id
    );

    res.json({
      message: "Appointment accepted successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("❌ Accept appointment error:", error);
    res
      .status(500)
      .json({ message: "Server error while accepting appointment" });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("🔄 Updating appointment status:", id, "to:", status);

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only the assigned doctor can update status
    if (
      !appointment.doctor ||
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({
          message: "Only the assigned doctor can update appointment status",
        });
    }

    // Validate status transitions
    const validTransitions = {
      Confirmed: ["In Progress"],
      "In Progress": ["Completed"],
    };

    if (
      !validTransitions[appointment.status] ||
      !validTransitions[appointment.status].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    appointment.status = status;
    appointment.updatedAt = Date.now();
    await appointment.save();
    await appointment.populate(["patient", "preferredDoctor", "doctor"]);

    console.log("✅ Appointment status updated successfully");

    res.json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("❌ Update appointment status error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating appointment status" });
  }
};

const addPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { medicineName, dosage, frequency } = req.body;

    console.log("💊 Adding prescription to appointment:", id);

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only the assigned doctor can add prescription
    if (
      !appointment.doctor ||
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Only the assigned doctor can add prescription" });
    }

    // Only completed appointments can have prescriptions
    if (appointment.status !== "Completed") {
      return res
        .status(400)
        .json({
          message: "Prescription can only be added to completed appointments",
        });
    }

    appointment.prescription = {
      medicineName,
      dosage,
      frequency,
    };
    appointment.updatedAt = Date.now();
    await appointment.save();
    await appointment.populate(["patient", "preferredDoctor", "doctor"]);

    console.log("✅ Prescription added successfully");

    res.json({
      message: "Prescription added successfully",
      appointment,
    });
  } catch (error) {
    console.error("❌ Add prescription error:", error);
    res.status(500).json({ message: "Server error while adding prescription" });
  }
};

const getDoctors = async (req, res) => {
  try {
    console.log("👨‍⚕️ Getting all doctors");

    const doctors = await User.find({ role: "Doctor" }).select("name email");

    console.log("📊 Found doctors:", doctors.length);

    res.json(doctors);
  } catch (error) {
    console.error("❌ Get doctors error:", error);
    res.status(500).json({ message: "Server error while fetching doctors" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getPendingAppointments,
  acceptAppointment,
  updateAppointmentStatus,
  addPrescription,
  getDoctors,
};
