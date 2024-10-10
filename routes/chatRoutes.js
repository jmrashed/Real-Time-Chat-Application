const ChatMessage = require("../models/ChatMessage");
const fs = require("fs");
const path = require("path");

// Send a chat message
const sendMessage = async (req, res) => {
  const { roomId, message } = req.body;
  const userId = req.user.userId; // Get the user ID from the JWT payload
  const newMessage = new ChatMessage({ roomId, message, sender: userId });

  try {
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Get chat history for a specific room
const getChatHistory = async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await ChatMessage.find({ roomId }).populate(
      "sender",
      "username"
    ); // Populate sender username
    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    res.status(500).json({ message: "Error fetching chat history" });
  }
};

// Upload a file
const uploadFile = async (req, res) => {
  const { roomId } = req.body;
  const file = req.file; // Assuming you're using multer for file uploads

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = path.join(__dirname, "../uploads", file.filename); // Save the file path
  const newMessage = new ChatMessage({
    roomId,
    message: "File uploaded",
    sender: req.user.userId,
    file: {
      filename: file.filename,
      path: filePath,
    },
  });

  try {
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({ message: "Error uploading file" });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  uploadFile,
};
