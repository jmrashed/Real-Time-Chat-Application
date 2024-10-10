const Message = require("../models/Message"); // Import the Message model
const path = require("path");
const fs = require("fs");

// Function to send a message
const sendMessage = async (req, res) => {
  try {
    const { roomId, userId, content, file } = req.body;

    // Create a new message object
    const newMessage = new Message({
      roomId,
      userId,
      content,
      file: file ? file.filename : null,
      createdAt: new Date(),
    });

    // Save the message to the database
    const savedMessage = await newMessage.save();

    // Emit the message to the specific room via Socket.IO
    req.io.to(roomId).emit("message", savedMessage);

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Function to get chat history for a specific room
const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Fetch messages for the specified room
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving chat history:", error.message);
    res.status(500).json({ message: "Error retrieving chat history" });
  }
};

// Function to handle file upload
const uploadFile = (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Respond with the file metadata
  res.status(200).json({ filename: file.filename });
};

// Function to download a file
const downloadFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads", filename);

  // Check if the file exists
  fs.stat(filePath, (err) => {
    if (err) {
      return res.status(404).json({ message: "File not found" });
    }

    // Send the file to the client
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error downloading file:", err.message);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  });
};

module.exports = {
  sendMessage,
  getChatHistory,
  uploadFile,
  downloadFile,
};
