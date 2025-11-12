/**
 * MongoDB Connection — Hiring Manager DB Only
 */

const mongoose = require("mongoose");

const connectHiringManagerDB = async () => {
  try {
    const uri = process.env.HIRING_MANAGER_DB_URI;

    if (!uri) {
      throw new Error("❌ HIRING_MANAGER_DB_URI is missing in .env file");
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = { connectHiringManagerDB };
