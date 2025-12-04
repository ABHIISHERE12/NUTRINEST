const connectDB = require("./config/db");
const config = require("./config/env");
const app = require("./app");
const PORT = config.port;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
