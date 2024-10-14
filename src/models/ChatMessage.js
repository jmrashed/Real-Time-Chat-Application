const mongoose = require("mongoose");

// Define the ChatMessage schema
const ChatMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom", // Reference to the ChatRoom model
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Set default to current time
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
});

// Create the ChatMessage model
const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

module.exports = ChatMessage;
