"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    myAppointments: 0,
    completedAppointments: 0,
    averageRating: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch pending appointments
      const pendingResponse = await api.get("/appointments/pending");

      // Fetch doctor's appointments
      const myAppointmentsResponse = await api.get("/appointments?mine=true");

      // Fetch feedback
      const feedbackResponse = await api.get(`/feedback/doctor/${user.id}`);

      const myAppointments = myAppointmentsResponse.data;
      const completedAppointments = myAppointments.filter(
        (apt) => apt.status === "Completed"
      );

      setStats({
        pendingAppointments: pendingResponse.data.length,
        myAppointments: myAppointments.length,
        completedAppointments: completedAppointments.length,
        averageRating: feedbackResponse.data.averageRating || 0,
      });

      setRecentAppointments(myAppointments.slice(0, 5));
      setFeedback(feedbackResponse.data.feedback.slice(0, 3));
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
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
      month: "short",
      day: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner mr-3"></div>
        <span className="text-lg font-medium text-gray-800">
          Loading dashboard...
        </span>
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
              {getGreeting()}, Dr. {user.name}! 👨‍⚕️
            </h1>
            <p className="text-gray-700 text-lg font-medium">
              Ready to help your patients today?
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
            to="/pending-appointments"
            className="btn-gradient px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-300"
          >
            ⏳ View Pending Appointments
          </Link>
          <Link
            to="/my-appointments"
            className="btn-success px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-300"
          >
            👨‍⚕️ My Appointments
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-warning-600 mb-2">
            {stats.pendingAppointments}
          </div>
          <div className="text-gray-700 font-bold">Pending</div>
          <div className="text-2xl mt-2">⏳</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-gradient mb-2">
            {stats.myAppointments}
          </div>
          <div className="text-gray-700 font-bold">My Appointments</div>
          <div className="text-2xl mt-2">📅</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">
            {stats.completedAppointments}
          </div>
          <div className="text-gray-700 font-bold">Completed</div>
          <div className="text-2xl mt-2">✅</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {stats.averageRating > 0 ? stats.averageRating : "N/A"}
          </div>
          <div className="text-gray-700 font-bold">Average Rating</div>
          <div className="text-2xl mt-2">⭐</div>
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

        {recentAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No appointments yet
            </h3>
            <p className="text-gray-600 font-medium mb-6">
              Check pending appointments to get started!
            </p>
            <Link
              to="/pending-appointments"
              className="btn-gradient px-6 py-3 rounded-xl font-semibold inline-block hover:scale-105 transition-transform duration-300"
            >
              View Pending Appointments
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {recentAppointments.map((appointment, index) => (
              <div
                key={appointment._id}
                className="appointment-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">
                          {appointment.patient?.name?.charAt(0) || "P"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {appointment.patient?.name}
                        </h3>
                        <p className="text-gray-600 font-medium">
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

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-2">
                    Health Concern:
                  </h4>
                  <p className="text-gray-700">{appointment.healthConcern}</p>
                </div>
              </div>
            ))}

            {stats.myAppointments > 5 && (
              <div className="text-center pt-6">
                <Link
                  to="/my-appointments"
                  className="text-gradient font-bold hover:underline text-lg"
                >
                  View all {stats.myAppointments} appointments →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Feedback */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 font-display">
            Recent Patient Feedback
          </h2>
          <div className="text-2xl floating">⭐</div>
        </div>

        {feedback.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              No feedback received yet
            </h3>
            <p className="text-gray-600">
              Complete appointments to receive patient feedback!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((fb, index) => (
              <div
                key={fb._id}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">
                        {fb.patient?.name?.charAt(0) || "P"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {fb.patient?.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {formatDate(fb.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/50 rounded-lg px-3 py-1">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-bold text-gray-800">
                      {fb.rating}/5
                    </span>
                  </div>
                </div>

                {fb.comment && (
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-gray-700 italic font-medium">
                      "{fb.comment}"
                    </p>
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

export default DoctorDashboard;
