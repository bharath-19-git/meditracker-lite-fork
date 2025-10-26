const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const appointmentRoutes = require("./routes/appointments")
const feedbackRoutes = require("./routes/feedback")

const app = express()

// Middleware
// Configure CORS to allow requests from frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow all origins for now, set specific URL in production
  credentials: true
}))
app.use(express.json())

// Database connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/meditrack", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/feedback", feedbackRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "MediTrack Lite API is running!" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
