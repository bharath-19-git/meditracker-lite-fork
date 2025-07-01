const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("❌ No token provided");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    console.log("🔐 Verifying token...");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("❌ User not found for token");
      return res.status(401).json({ message: "Token is not valid" });
    }

    console.log("✅ User authenticated:", user.name, user.role);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log("❌ No user in request");
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      console.log(
        `❌ Access denied. User role: ${req.user.role}, Required: ${roles.join(
          ", "
        )}`
      );
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    console.log(`✅ Role check passed: ${req.user.role}`);
    next();
  };
};

module.exports = { auth, requireRole };
