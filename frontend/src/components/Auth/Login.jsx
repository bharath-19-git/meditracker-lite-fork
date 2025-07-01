"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      const redirectPath =
        user.role === "Doctor" ? "/doctor-dashboard" : "/dashboard";
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success("Welcome back! 🎉", {
          style: {
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            color: "white",
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow: "0 10px 25px rgba(17, 153, 142, 0.3)",
          },
        });
        const redirectPath =
          result.user.role === "Doctor" ? "/doctor-dashboard" : "/dashboard";
        navigate(redirectPath, { replace: true });
      } else {
        toast.error(result.message, {
          style: {
            background: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
            color: "white",
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow: "0 10px 25px rgba(255, 65, 108, 0.3)",
          },
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg medical-pattern flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl floating-delayed"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="glass-card rounded-3xl p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 floating">
              <span className="text-white text-3xl">🏥</span>
            </div>
            <h2 className="text-3xl font-bold text-gradient font-display">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in to your MediTrack account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input w-full"
                  placeholder="yourname@meditrack.local"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-input w-full"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-gradient font-semibold hover:underline"
              >
                Create one here
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-2">
              🧪 Demo Credentials:
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Patient:</strong> alice.wilson@meditrack.local
              </p>
              <p>
                <strong>Doctor:</strong> john.smith@meditrack.local
              </p>
              <p>
                <strong>Password:</strong> password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
