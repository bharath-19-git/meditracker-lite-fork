"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    medicineName: "",
    dosage: "",
    frequency: "",
  });

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      const response = await api.get("/appointments?mine=true");
      setAppointments(response.data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, {
        status: newStatus,
      });
      toast.success("🎉 Appointment status updated successfully!", {
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
          color: "white",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
        },
      });
      fetchMyAppointments();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update status";
      toast.error(message);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/appointments/${selectedAppointment._id}/prescription`,
        prescriptionForm
      );
      toast.success("💊 Prescription added successfully!", {
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
          color: "white",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
        },
      });
      setSelectedAppointment(null);
      setPrescriptionForm({ medicineName: "", dosage: "", frequency: "" });
      fetchMyAppointments();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add prescription";
      toast.error(message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "Confirmed":
        return "In Progress";
      case "In Progress":
        return "Completed";
      default:
        return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return "✅";
      case "In Progress":
        return "🔄";
      case "Completed":
        return "🎉";
      default:
        return "📋";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((apt) => apt.status === "Confirmed").length,
    inProgress: appointments.filter((apt) => apt.status === "In Progress")
      .length,
    completed: appointments.filter((apt) => apt.status === "Completed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner mr-3"></div>
        <span className="text-lg font-medium text-gray-800">
          Loading your appointments...
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
              My Appointments 👨‍⚕️
            </h1>
            <p className="text-gray-700 text-lg font-medium">
              Manage your accepted appointments and track their progress.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center floating">
              <span className="text-white text-3xl">👨‍⚕️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-gradient mb-2">
            {stats.total}
          </div>
          <div className="text-gray-700 font-bold">Total</div>
          <div className="text-2xl mt-2">📊</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats.confirmed}
          </div>
          <div className="text-gray-700 font-bold">Confirmed</div>
          <div className="text-2xl mt-2">✅</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {stats.inProgress}
          </div>
          <div className="text-gray-700 font-bold">In Progress</div>
          <div className="text-2xl mt-2">🔄</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">
            {stats.completed}
          </div>
          <div className="text-gray-700 font-bold">Completed</div>
          <div className="text-2xl mt-2">🎉</div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 font-display">
            Your Appointments
          </h2>
          <div className="text-2xl floating">📋</div>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6 floating">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Appointments Yet
            </h3>
            <p className="text-gray-600 text-lg font-medium mb-6">
              You haven't accepted any appointments yet. Check the pending
              appointments to get started.
            </p>
            <a
              href="/pending-appointments"
              className="btn-gradient px-8 py-4 rounded-xl font-bold text-lg inline-block hover:scale-105 transition-transform duration-300"
            >
              ⏳ View Pending Appointments
            </a>
          </div>
        ) : (
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
                            ✅ Accepted:
                          </span>
                          <span className="font-medium">
                            {formatDate(appointment.updatedAt)}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="flex items-center">
                          <span className="font-bold text-gray-800 mr-2">
                            ⏰ Time:
                          </span>
                          <span className="font-medium">
                            {appointment.appointmentTime}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-bold text-gray-800 mr-2">
                            📋 Status:
                          </span>
                          <span
                            className={`status-badge ${getStatusColor(
                              appointment.status
                            )} ml-0`}
                          >
                            {getStatusIcon(appointment.status)}{" "}
                            {appointment.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col items-end space-y-3">
                    {getNextStatus(appointment.status) && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            appointment._id,
                            getNextStatus(appointment.status)
                          )
                        }
                        className="btn-success px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform duration-300"
                      >
                        {getNextStatus(appointment.status) === "In Progress"
                          ? "🔄 Start Treatment"
                          : "🎉 Mark Complete"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
                    💬 Health Concern:
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                    <p className="text-gray-800 leading-relaxed font-medium">
                      {appointment.healthConcern}
                    </p>
                  </div>
                </div>

                {appointment.prescription && (
                  <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                    <h4 className="font-bold text-green-900 mb-4 text-lg flex items-center">
                      💊 Prescription
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white/60 rounded-xl p-4">
                        <span className="font-bold text-green-900 block mb-1">
                          Medicine:
                        </span>
                        <p className="text-green-700 font-medium text-lg">
                          {appointment.prescription.medicineName}
                        </p>
                      </div>
                      <div className="bg-white/60 rounded-xl p-4">
                        <span className="font-bold text-green-800 block mb-1">
                          Dosage:
                        </span>
                        <p className="text-green-700 font-medium text-lg">
                          {appointment.prescription.dosage}
                        </p>
                      </div>
                      <div className="bg-white/60 rounded-xl p-4">
                        <span className="font-bold text-green-800 block mb-1">
                          Frequency:
                        </span>
                        <p className="text-green-700 font-medium text-lg">
                          {appointment.prescription.frequency}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {appointment.status === "Completed" &&
                  !appointment.prescription && (
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className="btn-warning px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-300 flex items-center space-x-2"
                      >
                        <span>💊</span>
                        <span>Add Prescription</span>
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-scale">
          <div className="prescription-modal rounded-2xl max-w-md w-full p-1 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-700 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 floating">
                <span className="text-white text-2xl">💊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 font-display mb-2">
                Add Prescription
              </h2>
              <p className="text-gray-700 font-medium">
                For {selectedAppointment.patient?.name}
              </p>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-gray-800">Patient:</span>
                  <p className="text-gray-700 font-medium">
                    {selectedAppointment.patient?.name}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-gray-800">Date:</span>
                  <p className="text-gray-700 font-medium">
                    {formatDate(selectedAppointment.appointmentDate)}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePrescriptionSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="medicineName"
                  className="block text-sm font-bold text-gray-800 mb-2"
                >
                  Medicine Name *
                </label>
                <input
                  type="text"
                  id="medicineName"
                  required
                  className="prescription-input w-full"
                  placeholder="e.g., Paracetamol"
                  value={prescriptionForm.medicineName}
                  onChange={(e) =>
                    setPrescriptionForm({
                      ...prescriptionForm,
                      medicineName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="dosage"
                  className="block text-sm font-bold text-gray-800 mb-2"
                >
                  Dosage *
                </label>
                <input
                  type="text"
                  id="dosage"
                  required
                  className="prescription-input w-full"
                  placeholder="e.g., 500mg"
                  value={prescriptionForm.dosage}
                  onChange={(e) =>
                    setPrescriptionForm({
                      ...prescriptionForm,
                      dosage: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="frequency"
                  className="block text-sm font-bold text-gray-800 mb-2"
                >
                  Frequency *
                </label>
                <input
                  type="text"
                  id="frequency"
                  required
                  className="prescription-input w-full"
                  placeholder="e.g., Twice daily after meals"
                  value={prescriptionForm.frequency}
                  onChange={(e) =>
                    setPrescriptionForm({
                      ...prescriptionForm,
                      frequency: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAppointment(null);
                    setPrescriptionForm({
                      medicineName: "",
                      dosage: "",
                      frequency: "",
                    });
                  }}
                  className="px-6 py-3 border-2 border-gray-400 rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-500 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-300"
                >
                  💊 Add Prescription
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-200 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <span className="font-bold text-gray-600 hover:text-red-600">
                ×
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
