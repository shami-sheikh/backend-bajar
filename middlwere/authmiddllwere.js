const jwt = require("jsonwebtoken");
const User = require('../models/user-models')

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized - No token" });
    }

    const jwtToken = token.replace("Bearer ", "").trim();
    const isVerify = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const userData = await User.findOne({ email: isVerify.email }).select("-password")

    if (!userData) {
      return res.status(401).json({ msg: "User not found" })  // ✅ add return
    }

    req.user = userData
    req.token = token
    req.userID = userData._id

    next();

  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized - Invalid token" });
  }
};

module.exports = authMiddleware;