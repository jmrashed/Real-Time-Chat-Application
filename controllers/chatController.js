const ChatMessage = require("../models/ChatMessage");

// Controller for sending a message
const sendMessage = async (req, res) => {
  const { text, sender } = req.body;

  if (!text || !sender) {
    return res.status(400).json({ message: "Text and sender are required." });
  }

  try {
    const message = new ChatMessage({ text, sender });
    await message.save();
    return res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Error sending message" });
  }
};

// Controller for retrieving messages
const getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ createdAt: -1 }); // Sorting by newest first
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Error fetching messages" });
  }
};

// Controller for uploading a file
const uploadFile = async (req, res) => {
  const { room } = req.body;
  const file = req.file; // Assumes multer is being used to handle file uploads

  if (!room || !file) {
    return res.status(400).json({ error: "Room and file are required." });
  }

  try {
    // Logic to handle file upload and potentially save file data to MongoDB
    // Example: Store file path, name, etc.
    // This could also be more complex depending on your file storage solution (S3, etc.)
    const filePath = file.path; // Example: getting the file path after multer stores it
    return res.status(201).json({ success: true, message: "File uploaded!", filePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Error uploading file" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  uploadFile,
};
