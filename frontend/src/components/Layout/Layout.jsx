import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen animated-bg medical-pattern">
      <Navbar />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-scale">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl floating"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl floating-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-success-200/20 rounded-full blur-3xl floating"></div>
      </div>
    </div>
  );
};

export default Layout;
