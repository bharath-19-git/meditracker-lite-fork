import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/Shared/ErrorBoundary";
import Layout from "./components/Layout/Layout";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PatientDashboard from "./components/Patient/PatientDashboard";
import BookAppointment from "./components/Patient/BookAppointment";
import DoctorDashboard from "./components/Doctor/DoctorDashboard";
import PendingAppointments from "./components/Doctor/PendingAppointments";
import MyAppointments from "./components/Doctor/MyAppointments";
import AppointmentsList from "./components/Shared/AppointmentsList";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    theme: {
                      primary: "#22c55e",
                    },
                  },
                  error: {
                    duration: 5000,
                    theme: {
                      primary: "#ef4444",
                    },
                  },
                }}
              />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />

                  {/* Patient Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["Patient"]}>
                        <PatientDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/book-appointment"
                    element={
                      <ProtectedRoute allowedRoles={["Patient"]}>
                        <BookAppointment />
                      </ProtectedRoute>
                    }
                  />

                  {/* Doctor Routes */}
                  <Route
                    path="/doctor-dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["Doctor"]}>
                        <DoctorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pending-appointments"
                    element={
                      <ProtectedRoute allowedRoles={["Doctor"]}>
                        <PendingAppointments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-appointments"
                    element={
                      <ProtectedRoute allowedRoles={["Doctor"]}>
                        <MyAppointments />
                      </ProtectedRoute>
                    }
                  />

                  {/* Shared Routes */}
                  <Route
                    path="/appointments"
                    element={
                      <ProtectedRoute allowedRoles={["Patient", "Doctor"]}>
                        <AppointmentsList />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
