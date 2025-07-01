"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    preferredDoctor: "",
    appointmentDate: "",
    appointmentTime: "",
    healthConcern: "",
  });
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/appointments/doctors");
      setDoctors(response.data);
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      setDoctorsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.preferredDoctor) {
      errors.push("Please select a doctor");
    }

    if (!formData.appointmentDate) {
      errors.push("Please select an appointment date");
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        errors.push("Appointment date must be in the future");
      }
    }

    if (!formData.appointmentTime) {
      errors.push("Please select an appointment time");
    }

    if (!formData.healthConcern || formData.healthConcern.trim().length < 10) {
      errors.push("Health concern must be at least 10 characters long");
    }

    if (formData.healthConcern && formData.healthConcern.length > 200) {
      errors.push("Health concern must not exceed 200 characters");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        preferredDoctor: formData.preferredDoctor,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        healthConcern: formData.healthConcern.trim(),
      };

      await api.post("/appointments", appointmentData);

      toast.success("🎉 Appointment booked successfully!", {
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
          color: "white",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
        },
      });
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          toast.error(err.msg || err.message);
        });
      } else {
        const message =
          error.response?.data?.message || "Failed to book appointment";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getSelectedDoctorName = () => {
    const selectedDoctor = doctors.find(
      (doctor) => doctor._id === formData.preferredDoctor
    );
    return selectedDoctor ? selectedDoctor.name : "Select a doctor";
  };

  if (doctorsLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center justify-center py-8">
            <div className="loading-spinner mr-3"></div>
            <span className="text-lg font-medium text-gray-800">
              Loading doctors...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-scale">
      <div className="glass-card rounded-3xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 floating">
            <span className="text-white text-2xl">📅</span>
          </div>
          <h1 className="text-3xl font-bold text-gradient font-display mb-2">
            Book New Appointment
          </h1>
          <p className="text-gray-700 font-medium">
            Schedule your visit with our expert doctors
          </p>
        </div>

        {doctors.length === 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              ⚠️ No doctors are currently available. Please try again later.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Doctor Selection - DROPDOWN */}
          <div>
            <label
              htmlFor="preferredDoctor"
              className="block text-lg font-bold text-gray-800 mb-4"
            >
              Select Doctor *
            </label>
            <div className="relative">
              <select
                id="preferredDoctor"
                name="preferredDoctor"
                required
                className="form-input w-full text-lg appearance-none cursor-pointer pr-10"
                value={formData.preferredDoctor}
                onChange={handleChange}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 12px center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "16px",
                }}
              >
                <option value="">Choose your preferred doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            {formData.preferredDoctor && (
              <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">
                      {getSelectedDoctorName().charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      Dr. {getSelectedDoctorName()}
                    </p>
                    <p className="text-sm text-gray-600">Selected Doctor</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div>
            <label
              htmlFor="appointmentDate"
              className="block text-lg font-bold text-gray-800 mb-3"
            >
              Appointment Date *
            </label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              required
              min={getTomorrowDate()}
              className="form-input w-full text-lg"
              value={formData.appointmentDate}
              onChange={handleChange}
            />
            <p className="mt-2 text-sm text-gray-600 font-medium">
              📅 Select a future date
            </p>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Appointment Time *
            </label>
            <div className="grid grid-cols-4 gap-3">
              {generateTimeSlots().map((time) => (
                <label
                  key={time}
                  className={`time-slot ${
                    formData.appointmentTime === time ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="appointmentTime"
                    value={time}
                    checked={formData.appointmentTime === time}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="font-bold">{time}</div>
                  <div className="text-xs opacity-75">
                    {time >= "12:00" ? "PM" : "AM"}
                  </div>
                </label>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-600 font-medium">
              🕘 Available slots: 9:00 AM - 5:00 PM
            </p>
          </div>

          {/* Health Concern */}
          <div>
            <label
              htmlFor="healthConcern"
              className="block text-lg font-bold text-gray-800 mb-3"
            >
              Health Concern *
            </label>
            <textarea
              id="healthConcern"
              name="healthConcern"
              required
              rows={4}
              maxLength={200}
              className="form-input w-full resize-none text-base"
              placeholder="Please describe your health concern or reason for the appointment (minimum 10 characters)..."
              value={formData.healthConcern}
              onChange={handleChange}
            />
            <div className="flex justify-between mt-3">
              <p className="text-sm text-gray-600 font-medium">
                💬 Minimum 10 characters required
              </p>
              <p
                className={`text-sm font-semibold ${
                  formData.healthConcern.length > 180
                    ? "text-warning-600"
                    : "text-gray-600"
                }`}
              >
                {formData.healthConcern.length}/200 characters
              </p>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar mt-3">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    (formData.healthConcern.length / 200) * 100,
                    100
                  )}%`,
                  background:
                    formData.healthConcern.length > 180
                      ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                      : "linear-gradient(90deg, #10b981, #34d399)",
                }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 border-2 border-gray-400 rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-500 transition-all duration-300 text-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || doctors.length === 0}
              className="btn-gradient px-8 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Booking...
                </span>
              ) : (
                "📅 Book Appointment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
