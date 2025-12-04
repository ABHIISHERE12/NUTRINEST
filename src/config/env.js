// src/config/env.js
const path = require("path");

// Load .env from project root (two levels up from this file)
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};
