const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const User = require("../models/User")
const Appointment = require("../models/Appointment")

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Appointment.deleteMany({})
    console.log("Cleared existing data")

    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 10)

    const sampleUsers = [
      {
        name: "Dr. John Smith",
        email: "john.smith@meditrack.local",
        password: hashedPassword,
        role: "Doctor",
      },
      {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@meditrack.local",
        password: hashedPassword,
        role: "Doctor",
      },
      {
        name: "Dr. Michael Brown",
        email: "michael.brown@meditrack.local",
        password: hashedPassword,
        role: "Doctor",
      },
      {
        name: "Alice Wilson",
        email: "alice.wilson@meditrack.local",
        password: hashedPassword,
        role: "Patient",
      },
      {
        name: "Bob Davis",
        email: "bob.davis@meditrack.local",
        password: hashedPassword,
        role: "Patient",
      },
      {
        name: "Carol Martinez",
        email: "carol.martinez@meditrack.local",
        password: hashedPassword,
        role: "Patient",
      },
    ]

    const createdUsers = await User.insertMany(sampleUsers)
    console.log("Created sample users")

    // Get doctors and patients
    const doctors = createdUsers.filter((user) => user.role === "Doctor")
    const patients = createdUsers.filter((user) => user.role === "Patient")

    // Create sample appointments
    const sampleAppointments = [
      {
        patient: patients[0]._id,
        preferredDoctor: doctors[0]._id,
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        appointmentTime: "10:00",
        healthConcern: "Regular checkup and blood pressure monitoring",
        status: "Pending",
      },
      {
        patient: patients[1]._id,
        preferredDoctor: doctors[1]._id,
        doctor: doctors[1]._id,
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        appointmentTime: "14:30",
        healthConcern: "Persistent headaches and dizziness for the past week",
        status: "Confirmed",
      },
      {
        patient: patients[2]._id,
        preferredDoctor: doctors[2]._id,
        doctor: doctors[2]._id,
        appointmentDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        appointmentTime: "11:00",
        healthConcern: "Follow-up appointment for diabetes management",
        status: "Completed",
        prescription: {
          medicineName: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily with meals",
        },
      },
    ]

    await Appointment.insertMany(sampleAppointments)
    console.log("Created sample appointments")

    console.log("\n=== SEED DATA CREATED SUCCESSFULLY ===")
    console.log("\nSample Login Credentials:")
    console.log("Doctors:")
    console.log("- john.smith@meditrack.local / password123")
    console.log("- sarah.johnson@meditrack.local / password123")
    console.log("- michael.brown@meditrack.local / password123")
    console.log("\nPatients:")
    console.log("- alice.wilson@meditrack.local / password123")
    console.log("- bob.davis@meditrack.local / password123")
    console.log("- carol.martinez@meditrack.local / password123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seedData()
