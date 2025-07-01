"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
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

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.status.toLowerCase() === filter.toLowerCase();
  });

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter((apt) => apt.status === "Pending").length,
    confirmed: appointments.filter((apt) => apt.status === "Confirmed").length,
    "in progress": appointments.filter((apt) => apt.status === "In Progress")
      .length,
    completed: appointments.filter((apt) => apt.status === "Completed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner mr-3"></div>
        <span className="text-lg font-medium text-gray-800">
          Loading appointments...
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
            <h1 className="text-3xl font-bold text-gradient font-display mb-2">
              All Appointments
            </h1>
            <p className="text-gray-700 font-medium">
              {user.role === "Patient"
                ? "View all your appointments and their current status."
                : "Overview of all appointments in the system."}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center floating">
              <span className="text-white text-2xl">📋</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-card rounded-3xl p-6">
        <div className="border-b border-white/20">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`py-3 px-4 border-b-2 font-bold text-sm capitalize whitespace-nowrap transition-all duration-300 ${
                  filter === status
                    ? "border-primary-500 text-gradient scale-105"
                    : "border-transparent text-gray-600 hover:text-primary-600 hover:border-primary-300"
                }`}
              >
                {status} ({count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Appointments List */}
      <div className="glass-card rounded-3xl p-8">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No {filter !== "all" ? filter : ""} appointments found
            </h3>
            <p className="text-gray-600 font-medium">
              {filter === "all"
                ? "No appointments have been created yet."
                : `No appointments with ${filter} status.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((appointment, index) => (
              <div
                key={appointment._id}
                className="appointment-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-14 h-14 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user.role === "Patient"
                            ? (
                                appointment.preferredDoctor?.name ||
                                appointment.doctor?.name ||
                                "Dr"
                              ).charAt(0)
                            : appointment.patient?.name?.charAt(0) || "P"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {user.role === "Patient"
                            ? `Dr. ${
                                appointment.preferredDoctor?.name ||
                                appointment.doctor?.name ||
                                "TBD"
                              }`
                            : appointment.patient?.name}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          {formatDate(appointment.appointmentDate)} at{" "}
                          {appointment.appointmentTime}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="space-y-1">
                        {user.role === "Doctor" && (
                          <p>
                            <strong className="text-gray-800">
                              Patient Email:
                            </strong>{" "}
                            {appointment.patient?.email}
                          </p>
                        )}
                        <p>
                          <strong className="text-gray-800">Booked:</strong>{" "}
                          {formatDate(appointment.createdAt)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {appointment.doctor &&
                          appointment.status !== "Pending" && (
                            <p>
                              <strong className="text-gray-800">
                                Assigned Doctor:
                              </strong>{" "}
                              Dr. {appointment.doctor.name}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`status-badge ${getStatusColor(
                      appointment.status
                    )} ml-4`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4 border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    💬 Health Concern:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {appointment.healthConcern}
                  </p>
                </div>

                {appointment.status === "Completed" &&
                  appointment.prescription && (
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200 rounded-xl p-4">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center">
                        💊 Prescription
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white/50 rounded-lg p-3">
                          <span className="font-bold text-green-800 block">
                            Medicine:
                          </span>
                          <p className="text-green-700 font-medium">
                            {appointment.prescription.medicineName}
                          </p>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3">
                          <span className="font-bold text-green-800 block">
                            Dosage:
                          </span>
                          <p className="text-green-700 font-medium">
                            {appointment.prescription.dosage}
                          </p>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3">
                          <span className="font-bold text-green-800 block">
                            Frequency:
                          </span>
                          <p className="text-green-700 font-medium">
                            {appointment.prescription.frequency}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;
