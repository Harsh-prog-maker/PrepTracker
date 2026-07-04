const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.get("/", (req, res) => {
  res.send("PrepTracker Backend is Running 🚀");
});

const activityRoutes = require("./routes/activityRoutes");

app.use("/api/activity", activityRoutes);
app.use("/api/users", userRoutes);

const problemRoutes = require("./routes/problemRoutes");
app.use("/api/problems", problemRoutes);

module.exports = app;