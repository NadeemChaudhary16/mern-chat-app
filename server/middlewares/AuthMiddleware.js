const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");
const asyncHandler = require("express-async-handler");

const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the Authorization header is present and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode the token and verify it
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      // Log the decoded token (useful for debugging)
      console.log(decoded);

      // Find the user associated with the decoded token and exclude the password field
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      // Proceed to the next middleware
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // No token present in the headers
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

module.exports = isLoggedIn;
