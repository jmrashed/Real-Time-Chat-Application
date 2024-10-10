const mongoose = require("mongoose");
require("dotenv").config(); // To load environment variables from .env file

// Get the MongoDB URI from environment variables
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/realtime-chat";

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

module.exports = connectDB;
