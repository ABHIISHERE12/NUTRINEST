const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/user");

connectDB().then(async () => {
  const user = new User({
    name: "Abhi",
    email: "abhi@test.com",
    password: "123456",
  });

  await user.save();
  console.log("User saved:", user);
  process.exit(0);
});
