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
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true)

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, true) // Allow all for now
    }
  },
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
