const mongoose = require("mongoose");
const config = require("./env");
async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("mongodb connected", mongoose.connection.host);
  } catch (err) {
    console.error("there is some error", err.message);
    process.exit(1);
  }
}
module.exports = connectDB;
