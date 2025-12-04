const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "htpps:/dryfruits.versal" }));
app.use(express.json());
app.use(express.urlencoded());
app.use(static);
app.get("/", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

module.exports = app;
