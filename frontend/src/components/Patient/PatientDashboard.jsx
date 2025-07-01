"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import FeedbackForm from "./FeedbackForm";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments");
      setAppointments(response.data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    setShowFeedbackForm(false);
    setSelectedAppointment(null);
    fetchAppointments();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Confirmed":
        return "status-confirmed";
      case "In Progress":
        return "status-in-progress";
      case "Completed":
        return "status-completed";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter((apt) => apt.status === "Pending").length,
    confirmed: appointments.filter((apt) => apt.status === "Confirmed").length,
    completed: appointments.filter((apt) => apt.status === "Completed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-scale">
      {/* Welcome Header */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient font-display mb-2">
              {getGreeting()}, {user.name}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Ready to take charge of your health journey today?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center floating">
              <span className="text-white text-4xl">🏥</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <Link
            to="/book-appointment"
            className="btn-gradient px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-300"
          >
            📅 Book New Appointment
          </Link>
          <Link
            to="/appointments"
            className="btn-success px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-300"
          >
            📋 View All Appointments
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-gradient mb-2">
            {stats.total}
          </div>
          <div className="text-gray-600 font-medium">Total</div>
          <div className="text-2xl mt-2">📊</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-warning-600 mb-2">
            {stats.pending}
          </div>
          <div className="text-gray-600 font-medium">Pending</div>
          <div className="text-2xl mt-2">⏳</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {stats.confirmed}
          </div>
          <div className="text-gray-600 font-medium">Confirmed</div>
          <div className="text-2xl mt-2">✅</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">
            {stats.completed}
          </div>
          <div className="text-gray-600 font-medium">Completed</div>
          <div className="text-2xl mt-2">🎉</div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 font-display">
            Recent Appointments
          </h2>
          <div className="text-2xl floating">📋</div>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No appointments yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start your health journey by booking your first appointment!
            </p>
            <Link
              to="/book-appointment"
              className="btn-gradient px-6 py-3 rounded-xl font-semibold inline-block hover:scale-105 transition-transform duration-300"
            >
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.slice(0, 5).map((appointment, index) => (
              <div
                key={appointment._id}
                className="appointment-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {(
                            appointment.preferredDoctor?.name ||
                            appointment.doctor?.name ||
                            "Dr"
                          ).charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          Dr.{" "}
                          {appointment.preferredDoctor?.name ||
                            appointment.doctor?.name ||
                            "TBD"}
                        </h3>
                        <p className="text-gray-600">
                          {formatDate(appointment.appointmentDate)} at{" "}
                          {appointment.appointmentTime}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`status-badge ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Health Concern:
                  </h4>
                  <p className="text-gray-700">{appointment.healthConcern}</p>
                </div>

                {appointment.status === "Completed" &&
                  appointment.prescription && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                        💊 Prescription
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-green-800">
                            Medicine:
                          </span>
                          <p className="text-green-700">
                            {appointment.prescription.medicineName}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">
                            Dosage:
                          </span>
                          <p className="text-green-700">
                            {appointment.prescription.dosage}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">
                            Frequency:
                          </span>
                          <p className="text-green-700">
                            {appointment.prescription.frequency}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {appointment.status === "Completed" && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowFeedbackForm(true);
                      }}
                      className="btn-warning px-4 py-2 rounded-xl font-medium hover:scale-105 transition-transform duration-300"
                    >
                      ⭐ Submit Feedback
                    </button>
                  </div>
                )}
              </div>
            ))}

            {appointments.length > 5 && (
              <div className="text-center pt-6">
                <Link
                  to="/appointments"
                  className="text-gradient font-semibold hover:underline text-lg"
                >
                  View all {appointments.length} appointments →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackForm && selectedAppointment && (
        <FeedbackForm
          appointment={selectedAppointment}
          onClose={() => setShowFeedbackForm(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
