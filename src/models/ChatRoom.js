const mongoose = require("mongoose");

// Define the ChatRoom schema
const ChatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure room name is unique
  },
  description: {
    type: String,
    required: false, // Optional description for the room
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the room creation date
  },
});

// Create the ChatRoom model
const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

module.exports = ChatRoom;
