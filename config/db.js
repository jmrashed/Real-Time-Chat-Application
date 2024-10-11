// config/db.js
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

// Use the provided MongoDB URI p@ssw0rd
const mongoURI = process.env.MONGO_URI || "mongodb+srv://rashed:p@ssw0rd@cluster0.s2v3h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Establish connection with MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB; // Export the connectDB function
