const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    // required: true,
  },
  created: { type: Date, default: Date.now },
});
const user = mongoose.model("user", UserSchema);
module.exports = user;
