"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";

const PendingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      const response = await api.get("/appointments/pending");
      setAppointments(response.data);
    } catch (error) {
      toast.error("Failed to fetch pending appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      await api.put(`/appointments/${appointmentId}/accept`);
      toast.success("🎉 Appointment accepted successfully!", {
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
          color: "white",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
        },
      });
      fetchPendingAppointments(); // Refresh the list
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to accept appointment";
      toast.error(message, {
        style: {
          background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
          color: "white",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)",
        },
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner mr-3"></div>
        <span className="text-lg font-medium text-gray-800">
          Loading pending appointments...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-scale">
      {/* Header */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient font-display mb-2">
              Pending Appointments ⏳
            </h1>
            <p className="text-gray-700 text-lg font-medium">
              Review and accept appointment requests from patients.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-r from-warning-400 to-orange-500 rounded-2xl flex items-center justify-center floating">
              <span className="text-white text-3xl">⏳</span>
            </div>
          </div>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="glass-card rounded-3xl p-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6 floating">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Pending Appointments
            </h3>
            <p className="text-gray-600 text-lg font-medium">
              There are currently no pending appointment requests.
            </p>
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <p className="text-blue-800 font-medium">
                ✨ Great job! You're all caught up with appointment requests.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 font-display">
              {appointments.length} Pending Request
              {appointments.length !== 1 ? "s" : ""}
            </h2>
            <div className="stats-card px-4 py-2">
              <div className="text-2xl font-bold text-warning-600">
                {appointments.length}
              </div>
              <div className="text-xs text-gray-600 font-medium">Total</div>
            </div>
          </div>

          <div className="space-y-6">
            {appointments.map((appointment, index) => (
              <div
                key={appointment._id}
                className="appointment-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center floating">
                        <span className="text-white font-bold text-xl">
                          {appointment.patient?.name?.charAt(0) || "P"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">
                          {appointment.patient?.name}
                        </h3>
                        <p className="text-gray-600 font-medium text-lg">
                          📅 {formatDate(appointment.appointmentDate)} at{" "}
                          {appointment.appointmentTime}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 mb-6">
                      <div className="space-y-2">
                        <p className="flex items-center">
                          <span className="font-bold text-gray-800 mr-2">
                            📧 Email:
                          </span>
                          <span className="font-medium">
                            {appointment.patient?.email}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-bold text-gray-800 mr-2">
                            👨‍⚕️ Preferred Doctor:
                          </span>
                          <span className="font-medium">
                            Dr. {appointment.preferredDoctor?.name}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="flex items-center">
                          <span className="font-bold text-gray-800 mr-2">
                            📝 Requested:
                          </span>
                          <span className="font-medium">
                            {formatDate(appointment.createdAt)}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-bold text-gray-800 mr-2">
                            ⏰ Time Slot:
                          </span>
                          <span className="font-medium">
                            {appointment.appointmentTime}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col items-end space-y-3">
                    <span className="status-badge status-pending">
                      ⏳ Pending
                    </span>
                    <div className="text-sm text-gray-500 font-medium text-right">
                      Waiting for
                      <br />
                      your response
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
                    💬 Health Concern:
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                    <p className="text-gray-800 leading-relaxed font-medium text-lg">
                      {appointment.healthConcern}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleAcceptAppointment(appointment._id)}
                    className="btn-gradient px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform duration-300 flex items-center space-x-2"
                  >
                    <span>✅</span>
                    <span>Accept Appointment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {appointments.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">💡</span>
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-lg">
                    Quick Tip
                  </h4>
                  <p className="text-green-800 font-medium">
                    Review patient details carefully before accepting. Once
                    accepted, you'll be responsible for their care.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PendingAppointments;
