/**
 * Smart Submissions - Hiring Manager Backend
 * --------------------------------------------
 * MERN backend with separate modules for authentication, positions,
 * applications, purchase orders, and dashboards.
 */

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Express setup
const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB connection
const connectHiringManagerDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.HIRING_MANAGER_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ Connected to Hiring Manager DB: ${conn.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

connectHiringManagerDB();

// ✅ Routes import
const authRoutes = require("./routes/auth");
const hiringDashboardRoutes = require("./routes/hiringDashboard");
const positionRoutes = require("./routes/positions");
const purchaseOrderRoutes = require("./routes/purchaseOrders");
const applicationRoutes = require("./routes/applications"); // 🆕 Added
const onboardingRoutes = require("./routes/onboarding");
const agencyRoutes = require("./routes/agencies");



// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/hiring-dashboard", hiringDashboardRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/applications", applicationRoutes); // 🆕 Added
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/agencies", agencyRoutes);



// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Smart Submissions Hiring Manager API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
