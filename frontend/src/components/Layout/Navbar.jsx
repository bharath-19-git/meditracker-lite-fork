"use client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully", {
      style: {
        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        color: "white",
        borderRadius: "12px",
        padding: "16px 20px",
        boxShadow: "0 10px 25px rgba(17, 153, 142, 0.3)",
      },
    });
    navigate("/login");
  };

  const getNavLinks = () => {
    if (!user) return [];

    const commonLinks = [
      { to: "/appointments", label: "All Appointments", icon: "📋" },
    ];

    if (user.role === "Patient") {
      return [
        { to: "/dashboard", label: "Dashboard", icon: "🏠" },
        { to: "/book-appointment", label: "Book Appointment", icon: "📅" },
        ...commonLinks,
      ];
    } else if (user.role === "Doctor") {
      return [
        { to: "/doctor-dashboard", label: "Dashboard", icon: "🏠" },
        { to: "/pending-appointments", label: "Pending", icon: "⏳" },
        { to: "/my-appointments", label: "My Appointments", icon: "👨‍⚕️" },
        ...commonLinks,
      ];
    }

    return commonLinks;
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "nav-glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl font-bold">🏥</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient font-display">
                MediTrack
              </h1>
              <p className="text-xs text-gray-600 -mt-1">Lite</p>
            </div>
          </Link>

          {user && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {getNavLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-primary-600 hover:bg-white/50 transition-all duration-300 group"
                  >
                    <span className="group-hover:animate-bounce">
                      {link.icon}
                    </span>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* User Info & Logout */}
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600">{user.role}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn-danger px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  Logout
                </button>
                <button onClick={toggleTheme}>{isDark ? "☀️" : "🌙"}</button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl bg-white/20 backdrop-blur-sm"
                >
                  <div className="w-6 h-6 flex flex-col justify-center items-center">
                    <span
                      className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                        isMobileMenuOpen
                          ? "rotate-45 translate-y-1"
                          : "-translate-y-0.5"
                      }`}
                    ></span>
                    <span
                      className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                        isMobileMenuOpen ? "opacity-0" : "opacity-100"
                      }`}
                    ></span>
                    <span
                      className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                        isMobileMenuOpen
                          ? "-rotate-45 -translate-y-1"
                          : "translate-y-0.5"
                      }`}
                    ></span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && (
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="py-4 space-y-2">
              {getNavLinks().map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-primary-600 hover:bg-white/50 transition-all duration-300"
                >
                  <span>{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
