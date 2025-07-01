export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export const USER_ROLES = {
  PATIENT: "Patient",
  DOCTOR: "Doctor",
}

export const APPOINTMENT_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
}

export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
]

export const RATING_SCALE = [1, 2, 3, 4, 5]

export const EMAIL_DOMAIN = "@meditrack.local"
