const express = require("express");
const cors = require("cors");
const agentRoutes = require("./routes/agentRoutes");
const codeExecutionRoutes = require("./routes/codeExecutionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/agent", agentRoutes);
app.use("/api/code", codeExecutionRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ status: "ok", message: "Backend is connected!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
