const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  preferredDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
    validate: {
      validator: (time) => {
        // Validate time format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) return false;

        // Validate time range (9:00 - 16:59)
        const [hours] = time.split(":").map(Number);
        return hours >= 9 && hours < 17;
      },
      message:
        "Appointment time must be between 9:00 AM and 5:00 PM in HH:MM format",
    },
  },
  healthConcern: {
    type: String,
    required: true,
    minlength: [10, "Health concern must be at least 10 characters long"],
    maxlength: [200, "Health concern cannot exceed 200 characters"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "In Progress", "Completed"],
    default: "Pending",
  },
  prescription: {
    medicineName: {
      type: String,
      trim: true,
    },
    dosage: {
      type: String,
      trim: true,
    },
    frequency: {
      type: String,
      trim: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
appointmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ doctor: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
