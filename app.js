const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("welcome to my wesbite");
});
app.listen(3000, () => {
  console.log("website is running");
});
